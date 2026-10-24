package com.example.otpauth.config;

import com.example.otpauth.model.*;
import com.example.otpauth.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.SmartInitializingSingleton;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Automatically inspects the database schema on startup:
 * 1. Verifies that all entity tables exist, creating any missing tables with full definitions.
 * 2. Checks all tables for missing columns against entity specifications, adding them safely via ALTER TABLE.
 * 3. Migrates legacy columns and drops obsolete single-column unique constraints.
 * 4. Ensures foundational / seed rows (Super Admin, Roles, Units, Categories, Brands, Customer,
 *    Warehouses, Stores, Bank Accounts, Settings, Products) are present and active.
 *
 * Runs with highest precedence before other startup runners.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class DatabaseSchemaAutoUpgrader implements ApplicationRunner, SmartInitializingSingleton {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSchemaAutoUpgrader.class);

    private final JdbcTemplate jdbcTemplate;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final UnitRepository unitRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final WarehouseRepository warehouseRepository;
    private final StoreRepository storeRepository;
    private final CustomerRepository customerRepository;
    private final BankAccountRepository bankAccountRepository;
    private final SettingRepository settingRepository;
    private final ProductRepository productRepository;
    private final WorkCenterRepository workCenterRepository;
    private final PasswordEncoder passwordEncoder;

    private final AtomicBoolean executed = new AtomicBoolean(false);

    public DatabaseSchemaAutoUpgrader(
            JdbcTemplate jdbcTemplate,
            RoleRepository roleRepository,
            UserRepository userRepository,
            UnitRepository unitRepository,
            CategoryRepository categoryRepository,
            BrandRepository brandRepository,
            WarehouseRepository warehouseRepository,
            StoreRepository storeRepository,
            CustomerRepository customerRepository,
            BankAccountRepository bankAccountRepository,
            SettingRepository settingRepository,
            ProductRepository productRepository,
            WorkCenterRepository workCenterRepository,
            PasswordEncoder passwordEncoder) {
        this.jdbcTemplate = jdbcTemplate;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.unitRepository = unitRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.warehouseRepository = warehouseRepository;
        this.storeRepository = storeRepository;
        this.customerRepository = customerRepository;
        this.bankAccountRepository = bankAccountRepository;
        this.settingRepository = settingRepository;
        this.productRepository = productRepository;
        this.workCenterRepository = workCenterRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void afterSingletonsInstantiated() {
        triggerUpgrade("SmartInitializingSingleton");
    }

    @Override
    public void run(ApplicationArguments args) {
        triggerUpgrade("ApplicationRunner");
    }

    private synchronized void triggerUpgrade(String source) {
        if (executed.compareAndSet(false, true)) {
            log.info("🚀 [DatabaseSchemaAutoUpgrader] Executing database schema auto-upgrade from {}...", source);
            Map<String, Object> report = performFullSchemaUpgradeAndSeed();
            log.info("✅ [DatabaseSchemaAutoUpgrader] Database auto-upgrade finished: {} tables checked, {} columns added, status={}",
                    report.get("tablesChecked"), report.get("columnsAdded"), report.get("status"));
        }
    }

    /**
     * Public method to run or re-check schema and foundational rows at any time (e.g. from an admin/health endpoint).
     */
    public synchronized Map<String, Object> performFullSchemaUpgradeAndSeed() {
        Map<String, Object> report = new LinkedHashMap<>();
        List<String> actionsTaken = new ArrayList<>();
        int tablesCreated = 0;
        int columnsAdded = 0;

        try {
            boolean isPostgres = isPostgreSql();
            log.info("[DatabaseSchemaAutoUpgrader] Database engine detected: {}", isPostgres ? "PostgreSQL" : "MySQL/Other");

            // ── Phase 1: Tables & Columns Definition Map ──────────────────────────
            Map<String, Map<String, String>> schemaMap = buildSchemaDefinition(isPostgres);
            report.put("totalSchemaTables", schemaMap.size());

            // ── Phase 2: Create Missing Tables & Add Missing Columns ──────────────
            for (Map.Entry<String, Map<String, String>> tableEntry : schemaMap.entrySet()) {
                String tableName = tableEntry.getKey();
                Map<String, String> columns = tableEntry.getValue();

                boolean tableExists = doesTableExist(tableName);
                if (!tableExists) {
                    createTable(tableName, columns, isPostgres, actionsTaken);
                    tablesCreated++;
                } else {
                    int added = ensureAllColumnsExist(tableName, columns, isPostgres, actionsTaken);
                    columnsAdded += added;
                }
            }

            // ── Phase 3: Cleanup Unneeded Tables, Columns & Orphaned Rows ────────
            int tablesDropped = cleanupUnneededTables(schemaMap.keySet(), isPostgres, actionsTaken);
            int columnsDropped = cleanupUnneededColumns(schemaMap, isPostgres, actionsTaken);
            int rowsCleaned = cleanupOrphanedRows(actionsTaken);

            // ── Phase 4: Legacy Migrations & Constraints ─────────────────────────
            applyLegacyMigrationsAndConstraints(isPostgres, actionsTaken);

            // ── Phase 5: Ensure Foundational Rows / Seed Data ─────────────────────
            int rowsVerified = ensureFoundationalRows(actionsTaken);

            report.put("status", "SUCCESS");
            report.put("tablesChecked", schemaMap.size());
            report.put("tablesCreated", tablesCreated);
            report.put("columnsAdded", columnsAdded);
            report.put("tablesDropped", tablesDropped);
            report.put("columnsDropped", columnsDropped);
            report.put("rowsCleaned", rowsCleaned);
            report.put("rowsVerified", rowsVerified);
            report.put("actions", actionsTaken);

        } catch (Exception e) {
            log.error("[DatabaseSchemaAutoUpgrader] Error during auto-upgrade: {}", e.getMessage(), e);
            report.put("status", "FAILED");
            report.put("error", e.getMessage());
        }

        return report;
    }

    private boolean isPostgreSql() {
        try (Connection conn = Objects.requireNonNull(jdbcTemplate.getDataSource()).getConnection()) {
            String dbProduct = conn.getMetaData().getDatabaseProductName();
            return dbProduct != null && dbProduct.toLowerCase().contains("postgresql");
        } catch (Exception e) {
            log.debug("[DatabaseSchemaAutoUpgrader] Could not determine DB dialect, defaulting to PostgreSQL syntax: {}", e.getMessage());
            return true;
        }
    }

    private boolean doesTableExist(String tableName) {
        try {
            Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM information_schema.tables WHERE LOWER(table_name) = ? AND (table_schema = current_schema() OR table_schema = 'public')",
                    Integer.class,
                    tableName.toLowerCase()
            );
            return count != null && count > 0;
        } catch (Exception e) {
            try {
                jdbcTemplate.execute("SELECT 1 FROM " + tableName + " LIMIT 1");
                return true;
            } catch (Exception ex) {
                return false;
            }
        }
    }

    private Set<String> getExistingColumns(String tableName) {
        Set<String> columns = new HashSet<>();
        try {
            List<String> list = jdbcTemplate.query(
                    "SELECT column_name FROM information_schema.columns WHERE LOWER(table_name) = ? AND (table_schema = current_schema() OR table_schema = 'public')",
                    (rs, rowNum) -> rs.getString("column_name").toLowerCase(),
                    tableName.toLowerCase()
            );
            columns.addAll(list);
        } catch (Exception e) {
            log.warn("[DatabaseSchemaAutoUpgrader] information_schema query failed for {}: {}", tableName, e.getMessage());
        }

        if (columns.isEmpty()) {
            try {
                DataSource ds = jdbcTemplate.getDataSource();
                if (ds != null) {
                    try (Connection conn = ds.getConnection()) {
                        DatabaseMetaData meta = conn.getMetaData();
                        try (ResultSet rs = meta.getColumns(null, null, tableName, null)) {
                            while (rs.next()) {
                                columns.add(rs.getString("COLUMN_NAME").toLowerCase());
                            }
                        }
                        if (columns.isEmpty()) {
                            try (ResultSet rs = meta.getColumns(null, null, tableName.toUpperCase(), null)) {
                                while (rs.next()) {
                                    columns.add(rs.getString("COLUMN_NAME").toLowerCase());
                                }
                            }
                        }
                    }
                }
            } catch (Exception metaEx) {
                log.warn("[DatabaseSchemaAutoUpgrader] Metadata lookup failed for {}: {}", tableName, metaEx.getMessage());
            }
        }
        return columns;
    }

    private void createTable(String tableName, Map<String, String> columns, boolean isPostgres, List<String> actionsTaken) {
        StringBuilder sb = new StringBuilder();
        sb.append("CREATE TABLE IF NOT EXISTS ").append(tableName).append(" (");

        List<String> colDefs = new ArrayList<>();
        for (Map.Entry<String, String> col : columns.entrySet()) {
            colDefs.add(col.getKey() + " " + col.getValue());
        }
        sb.append(String.join(", ", colDefs));
        sb.append(")");

        try {
            jdbcTemplate.execute(sb.toString());
            String msg = "Created missing table: " + tableName;
            log.info("🔨 [DatabaseSchemaAutoUpgrader] {}", msg);
            actionsTaken.add(msg);
        } catch (Exception e) {
            log.error("[DatabaseSchemaAutoUpgrader] Failed to create table {}: {}", tableName, e.getMessage());
        }
    }

    private int ensureAllColumnsExist(String tableName, Map<String, String> definedColumns, boolean isPostgres, List<String> actionsTaken) {
        Set<String> existingCols = getExistingColumns(tableName);
        int addedCount = 0;

        for (Map.Entry<String, String> entry : definedColumns.entrySet()) {
            String colName = entry.getKey();
            String colDef = entry.getValue();

            // Ignore primary key declaration if table already exists
            if (colDef.contains("PRIMARY KEY")) {
                continue;
            }

            if (!existingCols.contains(colName.toLowerCase())) {
                try {
                    // Strip NOT NULL to prevent failure on tables with existing rows
                    String colDefForAlter = colDef.replace("NOT NULL", "").trim();
                    String sql;
                    if (isPostgres) {
                        sql = "ALTER TABLE " + tableName + " ADD COLUMN IF NOT EXISTS " + colName + " " + colDefForAlter;
                    } else {
                        sql = "ALTER TABLE " + tableName + " ADD COLUMN " + colName + " " + colDefForAlter;
                    }
                    jdbcTemplate.execute(sql);
                    existingCols.add(colName.toLowerCase());
                    addedCount++;
                    String msg = "Added column '" + colName + "' to table '" + tableName + "'";
                    log.info("➕ [DatabaseSchemaAutoUpgrader] {}", msg);
                    actionsTaken.add(msg);
                } catch (Exception e) {
                    log.warn("[DatabaseSchemaAutoUpgrader] Could not add column '{}' to table '{}': {}", colName, tableName, e.getMessage());
                }
            }
        }

        return addedCount;
    }

    private void applyLegacyMigrationsAndConstraints(boolean isPostgres, List<String> actionsTaken) {
        // 1. Settings legacy key -> setting_key migration
        try {
            Set<String> settingCols = getExistingColumns("settings");
            if (settingCols.contains("key") && settingCols.contains("setting_key")) {
                jdbcTemplate.execute("UPDATE settings SET setting_key = \"key\" WHERE setting_key IS NULL AND \"key\" IS NOT NULL");
                actionsTaken.add("Migrated legacy settings.key into settings.setting_key");
            }
        } catch (Exception e) {
            log.debug("[DatabaseSchemaAutoUpgrader] Settings legacy check: {}", e.getMessage());
        }

        // 2. User AI settings legacy bytea column drop
        try {
            Set<String> aiCols = getExistingColumns("user_ai_settings");
            if (aiCols.contains("ai_api_key_bytes")) {
                jdbcTemplate.execute("ALTER TABLE user_ai_settings DROP COLUMN IF EXISTS ai_api_key_bytes");
                String msg = "Dropped legacy column ai_api_key_bytes from user_ai_settings";
                log.info("🧹 [DatabaseSchemaAutoUpgrader] {}", msg);
                actionsTaken.add(msg);
            }
        } catch (Exception e) {
            log.debug("[DatabaseSchemaAutoUpgrader] AI key migration check: {}", e.getMessage());
        }

        // 3. Drop single-column unique constraints on multi-tenant tables
        if (isPostgres) {
            try {
                jdbcTemplate.execute("""
                    DO $$
                    DECLARE
                        r RECORD;
                    BEGIN
                        FOR r IN (
                            SELECT tc.constraint_name, tc.table_name
                            FROM information_schema.table_constraints tc
                            JOIN information_schema.key_column_usage kcu
                              ON tc.constraint_name = kcu.constraint_name
                            WHERE tc.constraint_type = 'UNIQUE'
                              AND tc.table_name IN ('products', 'categories', 'settings')
                              AND kcu.column_name IN ('sku', 'slug', 'key', 'setting_key')
                              AND (
                                  SELECT COUNT(*)
                                  FROM information_schema.key_column_usage
                                  WHERE constraint_name = tc.constraint_name
                              ) = 1
                        ) LOOP
                            EXECUTE 'ALTER TABLE ' || r.table_name || ' DROP CONSTRAINT IF EXISTS ' || r.constraint_name;
                        END LOOP;
                    END $$;
                """);
            } catch (Exception e) {
                log.debug("[DatabaseSchemaAutoUpgrader] Single-column constraint check: {}", e.getMessage());
            }
        }
    }

    /**
     * Dedicated public method to prune unneeded tables, unneeded columns, and orphaned rows.
     */
    public synchronized Map<String, Object> performFullCleanup() {
        Map<String, Object> report = new LinkedHashMap<>();
        List<String> actionsTaken = new ArrayList<>();
        try {
            boolean isPostgres = isPostgreSql();
            Map<String, Map<String, String>> schemaMap = buildSchemaDefinition(isPostgres);

            int tablesDropped = cleanupUnneededTables(schemaMap.keySet(), isPostgres, actionsTaken);
            int columnsDropped = cleanupUnneededColumns(schemaMap, isPostgres, actionsTaken);
            int rowsCleaned = cleanupOrphanedRows(actionsTaken);

            report.put("status", "SUCCESS");
            report.put("tablesDropped", tablesDropped);
            report.put("columnsDropped", columnsDropped);
            report.put("rowsCleaned", rowsCleaned);
            report.put("actions", actionsTaken);
        } catch (Exception e) {
            log.error("[DatabaseSchemaAutoUpgrader] Error during database cleanup: {}", e.getMessage(), e);
            report.put("status", "FAILED");
            report.put("error", e.getMessage());
        }
        return report;
    }

    private int cleanupUnneededTables(Set<String> validTables, boolean isPostgres, List<String> actionsTaken) {
        int droppedCount = 0;
        Set<String> validLowerTables = new HashSet<>();
        for (String t : validTables) {
            validLowerTables.add(t.toLowerCase());
        }

        Set<String> protectedTables = Set.of(
                "flyway_schema_history",
                "databasechangelog",
                "databasechangeloglock",
                "spatial_ref_sys",
                "geography_columns",
                "geometry_columns",
                "raster_columns",
                "raster_overviews",
                "blog_posts"
        );

        List<String> existingTables = new ArrayList<>();
        try {
            existingTables = jdbcTemplate.query(
                    "SELECT table_name FROM information_schema.tables WHERE (table_schema = current_schema() OR table_schema = 'public') AND table_type = 'BASE TABLE'",
                    (rs, rowNum) -> rs.getString("table_name")
            );
        } catch (Exception e) {
            log.warn("[DatabaseSchemaAutoUpgrader] Failed to inspect existing tables for cleanup: {}", e.getMessage());
        }

        for (String tbl : existingTables) {
            String lowerTbl = tbl.toLowerCase();
            if (!validLowerTables.contains(lowerTbl) && !protectedTables.contains(lowerTbl)) {
                try {
                    String dropSql = isPostgres
                            ? "DROP TABLE IF EXISTS \"" + tbl + "\" CASCADE"
                            : "DROP TABLE IF EXISTS `" + tbl + "` CASCADE";
                    jdbcTemplate.execute(dropSql);
                    droppedCount++;
                    String msg = "Dropped obsolete table: " + tbl;
                    log.info("🗑️ [DatabaseSchemaAutoUpgrader] {}", msg);
                    actionsTaken.add(msg);
                } catch (Exception e) {
                    log.warn("[DatabaseSchemaAutoUpgrader] Failed to drop obsolete table '{}': {}", tbl, e.getMessage());
                }
            }
        }

        return droppedCount;
    }

    private List<String> getExistingColumnNames(String tableName) {
        List<String> cols = new ArrayList<>();
        try {
            cols = jdbcTemplate.query(
                    "SELECT column_name FROM information_schema.columns WHERE LOWER(table_name) = ? AND (table_schema = current_schema() OR table_schema = 'public')",
                    (rs, rowNum) -> rs.getString("column_name"),
                    tableName.toLowerCase()
            );
        } catch (Exception e) {
            log.warn("[DatabaseSchemaAutoUpgrader] Failed to fetch columns for {}: {}", tableName, e.getMessage());
        }

        if (cols.isEmpty()) {
            try {
                DataSource ds = jdbcTemplate.getDataSource();
                if (ds != null) {
                    try (Connection conn = ds.getConnection()) {
                        DatabaseMetaData meta = conn.getMetaData();
                        try (ResultSet rs = meta.getColumns(null, null, tableName, null)) {
                            while (rs.next()) {
                                cols.add(rs.getString("COLUMN_NAME"));
                            }
                        }
                    }
                }
            } catch (Exception metaEx) {
                log.debug("[DatabaseSchemaAutoUpgrader] Metadata lookup fallback for {}: {}", tableName, metaEx.getMessage());
            }
        }
        return cols;
    }

    private int cleanupUnneededColumns(Map<String, Map<String, String>> schemaMap, boolean isPostgres, List<String> actionsTaken) {
        int droppedCount = 0;
        Set<String> protectedColumns = Set.of("id", "ctid", "xmin", "xmax", "cmin", "cmax", "tableoid");

        for (Map.Entry<String, Map<String, String>> entry : schemaMap.entrySet()) {
            String tableName = entry.getKey();
            Map<String, String> validColumnDefs = entry.getValue();

            Set<String> validColumnNames = new HashSet<>();
            for (String col : validColumnDefs.keySet()) {
                validColumnNames.add(col.toLowerCase());
            }

            List<String> existingCols = getExistingColumnNames(tableName);
            for (String col : existingCols) {
                String lowerCol = col.toLowerCase();
                if (!validColumnNames.contains(lowerCol) && !protectedColumns.contains(lowerCol)) {
                    try {
                        String dropColSql = isPostgres
                                ? "ALTER TABLE \"" + tableName + "\" DROP COLUMN IF EXISTS \"" + col + "\" CASCADE"
                                : "ALTER TABLE `" + tableName + "` DROP COLUMN `" + col + "`";
                        jdbcTemplate.execute(dropColSql);
                        droppedCount++;
                        String msg = "Dropped unneeded column '" + col + "' from table '" + tableName + "'";
                        log.info("🗑️ [DatabaseSchemaAutoUpgrader] {}", msg);
                        actionsTaken.add(msg);
                    } catch (Exception e) {
                        log.warn("[DatabaseSchemaAutoUpgrader] Could not drop column '{}' from table '{}': {}", col, tableName, e.getMessage());
                    }
                }
            }
        }

        return droppedCount;
    }

    private int cleanupOrphanedRows(List<String> actionsTaken) {
        int cleanedTotal = 0;

        // 1. Orphaned user_roles (user deleted or role deleted)
        cleanedTotal += executeDeleteIfTableExists("user_roles",
                "DELETE FROM user_roles WHERE user_id NOT IN (SELECT id FROM users)",
                actionsTaken, "Cleaned up user_roles with nonexistent user_id");
        cleanedTotal += executeDeleteIfTableExists("user_roles",
                "DELETE FROM user_roles WHERE role_id NOT IN (SELECT id FROM roles)",
                actionsTaken, "Cleaned up user_roles with nonexistent role_id");

        // 2. Orphaned folder_shares
        cleanedTotal += executeDeleteIfTableExists("folder_shares",
                "DELETE FROM folder_shares WHERE folder_id NOT IN (SELECT id FROM page_folders)",
                actionsTaken, "Cleaned up folder_shares with nonexistent folder_id");
        cleanedTotal += executeDeleteIfTableExists("folder_shares",
                "DELETE FROM folder_shares WHERE user_id NOT IN (SELECT id FROM users)",
                actionsTaken, "Cleaned up folder_shares with nonexistent user_id");

        // 3. Orphaned folder_invitations
        cleanedTotal += executeDeleteIfTableExists("folder_invitations",
                "DELETE FROM folder_invitations WHERE folder_id IS NOT NULL AND folder_id NOT IN (SELECT id FROM page_folders)",
                actionsTaken, "Cleaned up folder_invitations with nonexistent folder_id");

        // 4. Orphaned custom_pages
        cleanedTotal += executeDeleteIfTableExists("custom_pages",
                "DELETE FROM custom_pages WHERE folder_id IS NOT NULL AND folder_id NOT IN (SELECT id FROM page_folders)",
                actionsTaken, "Cleaned up custom_pages with nonexistent folder_id");

        // 5. Orphaned page_blocks
        cleanedTotal += executeDeleteIfTableExists("page_blocks",
                "DELETE FROM page_blocks WHERE page_id IS NOT NULL AND page_id NOT IN (SELECT id FROM custom_pages)",
                actionsTaken, "Cleaned up page_blocks with nonexistent page_id");

        // 6. Orphaned bom_items
        cleanedTotal += executeDeleteIfTableExists("bom_items",
                "DELETE FROM bom_items WHERE bom_id IS NOT NULL AND bom_id NOT IN (SELECT id FROM bill_of_materials)",
                actionsTaken, "Cleaned up bom_items with nonexistent bom_id");

        // 7. Orphaned khata_transactions
        cleanedTotal += executeDeleteIfTableExists("khata_transactions",
                "DELETE FROM khata_transactions WHERE party_id IS NOT NULL AND party_id NOT IN (SELECT id FROM khata_parties)",
                actionsTaken, "Cleaned up khata_transactions with nonexistent party_id");

        // 8. Orphaned interactions
        cleanedTotal += executeDeleteIfTableExists("interactions",
                "DELETE FROM interactions WHERE customer_id IS NOT NULL AND customer_id NOT IN (SELECT id FROM customers)",
                actionsTaken, "Cleaned up interactions with nonexistent customer_id");

        // 9. Orphaned work_orders
        cleanedTotal += executeDeleteIfTableExists("work_orders",
                "DELETE FROM work_orders WHERE bom_id IS NOT NULL AND bom_id NOT IN (SELECT id FROM bill_of_materials)",
                actionsTaken, "Cleaned up work_orders with nonexistent bom_id");

        // 10. Orphaned user_ai_settings
        cleanedTotal += executeDeleteIfTableExists("user_ai_settings",
                "DELETE FROM user_ai_settings WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM users)",
                actionsTaken, "Cleaned up user_ai_settings with nonexistent user_id");

        // 11. Orphaned stocks
        cleanedTotal += executeDeleteIfTableExists("stocks",
                "DELETE FROM stocks WHERE product_id IS NOT NULL AND product_id NOT IN (SELECT id FROM products)",
                actionsTaken, "Cleaned up stocks with nonexistent product_id");

        // 12. Invalid rows with blank/null required fields
        cleanedTotal += executeDeleteIfTableExists("user_roles",
                "DELETE FROM user_roles WHERE role_id IN (SELECT id FROM roles WHERE name IS NULL OR TRIM(name) = '')",
                actionsTaken, "Cleaned up user_roles referencing empty-name roles");
        cleanedTotal += executeDeleteIfTableExists("roles",
                "DELETE FROM roles WHERE name IS NULL OR TRIM(name) = ''",
                actionsTaken, "Cleaned up roles with empty name");
        cleanedTotal += executeDeleteIfTableExists("settings",
                "DELETE FROM settings WHERE setting_key IS NULL OR TRIM(setting_key) = ''",
                actionsTaken, "Cleaned up settings with empty setting_key");
        cleanedTotal += executeDeleteIfTableExists("user_roles",
                "DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE email IS NULL OR TRIM(email) = '')",
                actionsTaken, "Cleaned up user_roles referencing invalid users");
        cleanedTotal += executeDeleteIfTableExists("users",
                "DELETE FROM users WHERE email IS NULL OR TRIM(email) = ''",
                actionsTaken, "Cleaned up users with empty email");

        return cleanedTotal;
    }

    private int executeDeleteIfTableExists(String tableName, String sql, List<String> actionsTaken, String description) {
        if (!doesTableExist(tableName)) {
            return 0;
        }
        try {
            int rows = jdbcTemplate.update(sql);
            if (rows > 0) {
                String msg = description + " (deleted " + rows + " rows)";
                log.info("🧹 [DatabaseSchemaAutoUpgrader] {}", msg);
                actionsTaken.add(msg);
            }
            return rows;
        } catch (Exception e) {
            log.debug("[DatabaseSchemaAutoUpgrader] Cleanup query on '{}' skipped/failed: {}", tableName, e.getMessage());
            return 0;
        }
    }

    private int ensureFoundationalRows(List<String> actionsTaken) {
        int count = 0;

        // 1. Roles
        Role superAdminRole = roleRepository.findByName(RoleName.SUPER_ADMIN).orElseGet(() ->
                roleRepository.save(new Role(RoleName.SUPER_ADMIN))
        );
        Role adminRole = roleRepository.findByName(RoleName.ADMIN).orElseGet(() ->
                roleRepository.save(new Role(RoleName.ADMIN))
        );
        Role clientRole = roleRepository.findByName(RoleName.CLIENT).orElseGet(() ->
                roleRepository.save(new Role(RoleName.CLIENT))
        );
        roleRepository.findByName(RoleName.OTHER).orElseGet(() ->
                roleRepository.save(new Role(RoleName.OTHER))
        );
        count += 4;

        // 2. Super Admin User
        String superAdminEmail = "admin@gmail.com";
        String superAdminPassword = "Admin@12345";
        String superAdminName = "Super Admin";

        User superAdmin = userRepository.findByEmail(superAdminEmail).orElseGet(() -> {
            User newUser = new User(superAdminEmail, passwordEncoder.encode(superAdminPassword), superAdminName);
            newUser.setUsername("admin");
            newUser.setRoles(new HashSet<>(List.of(superAdminRole, adminRole)));
            newUser.setPlan(SubscriptionPlan.PREMIUM);
            newUser.setSubscriptionEndDate(LocalDateTime.now().plusYears(10));
            newUser.setBusinessType("POS & Retail");
            newUser.setEmailVerified(true);
            newUser.setPhoneVerified(true);
            newUser.setPhoneNumber("+1234567890");
            newUser.setActiveProjectId(1L);
            User saved = userRepository.save(newUser);
            actionsTaken.add("Created default Super Admin user (admin@gmail.com)");
            return saved;
        });

        boolean updatedAdmin = false;
        if (superAdmin.getRoles() == null || superAdmin.getRoles().isEmpty()) {
            superAdmin.setRoles(new HashSet<>(List.of(superAdminRole, adminRole)));
            updatedAdmin = true;
        }
        if (superAdmin.getUsername() == null || superAdmin.getUsername().isBlank()) {
            superAdmin.setUsername("admin");
            updatedAdmin = true;
        }
        if (superAdmin.getPlan() == null || superAdmin.getPlan() == SubscriptionPlan.NONE) {
            superAdmin.setPlan(SubscriptionPlan.PREMIUM);
            superAdmin.setSubscriptionEndDate(LocalDateTime.now().plusYears(10));
            updatedAdmin = true;
        }
        if (superAdmin.getActiveProjectId() == null) {
            superAdmin.setActiveProjectId(1L);
            updatedAdmin = true;
        }
        if (updatedAdmin) {
            superAdmin = userRepository.save(superAdmin);
        }
        count++;

        Long superAdminId = superAdmin.getId();

        // 3. Default Units — verify individual presence
        count += ensureUnitExists("Pieces", "pcs", superAdminId, actionsTaken);
        count += ensureUnitExists("Kilograms", "kg", superAdminId, actionsTaken);
        count += ensureUnitExists("Grams", "g", superAdminId, actionsTaken);
        count += ensureUnitExists("Meters", "m", superAdminId, actionsTaken);
        count += ensureUnitExists("Liters", "L", superAdminId, actionsTaken);
        count += ensureUnitExists("Boxes", "box", superAdminId, actionsTaken);
        count += ensureUnitExists("Packets", "pkt", superAdminId, actionsTaken);

        // 4. Default Categories — verify individual presence
        count += ensureCategoryExists("Electronics", "electronics", superAdminId, actionsTaken);
        count += ensureCategoryExists("Groceries", "groceries", superAdminId, actionsTaken);
        count += ensureCategoryExists("Clothing", "clothing", superAdminId, actionsTaken);
        count += ensureCategoryExists("General", "general", superAdminId, actionsTaken);

        // 5. Default Brands — verify individual presence
        count += ensureBrandExists("Generic", "Standard unbranded items", superAdminId, actionsTaken);
        count += ensureBrandExists("Apple", "Apple Electronics", superAdminId, actionsTaken);
        count += ensureBrandExists("Samsung", "Samsung Electronics", superAdminId, actionsTaken);

        // 6. Default Warehouse & Store
        if (warehouseRepository.findByUserId(superAdminId).isEmpty()) {
            Warehouse wh = new Warehouse();
            wh.setName("Main Warehouse");
            wh.setLocation("Headquarters Central");
            wh.setStatus(true);
            wh.setUserId(superAdminId);
            warehouseRepository.save(wh);
            actionsTaken.add("Seeded default Warehouse: Main Warehouse");
            count++;
        }

        if (storeRepository.findByUserId(superAdminId).isEmpty()) {
            Store st = new Store();
            st.setName("Main Branch");
            st.setLocation("Store #1 Front Desk");
            st.setStatus(true);
            st.setUserId(superAdminId);
            storeRepository.save(st);
            actionsTaken.add("Seeded default Store: Main Branch");
            count++;
        }

        // 7. Default Customer
        if (customerRepository.findByUserId(superAdminId).isEmpty()) {
            Customer cust = new Customer();
            cust.setName("Walk-in Customer");
            cust.setPhone("9999999999");
            cust.setEmail("walkin@store.com");
            cust.setAddress("Store Counter");
            cust.setCompany("Retail Walk-in");
            cust.setLoyaltyTier("Bronze");
            cust.setLifetimeValue(BigDecimal.ZERO);
            cust.setUserId(superAdminId);
            customerRepository.save(cust);
            actionsTaken.add("Seeded default Customer: Walk-in Customer");
            count++;
        }

        // 8. Default Bank Accounts
        if (bankAccountRepository.findByUserId(superAdminId).isEmpty()) {
            BankAccount cash = new BankAccount();
            cash.setBankName("Cash");
            cash.setAccountName("Cash in Hand / Drawer");
            cash.setAccountNumber("CASH-001");
            cash.setBranchIfsc("INTERNAL");
            cash.setUserId(superAdminId);

            BankAccount bank = new BankAccount();
            bank.setBankName("Operating Bank");
            bank.setAccountName("Primary Current Account");
            bank.setAccountNumber("ACC-100200300");
            bank.setBranchIfsc("BANK000123");
            bank.setUserId(superAdminId);

            bankAccountRepository.saveAll(List.of(cash, bank));
            actionsTaken.add("Seeded default Bank Accounts (Cash, Primary Current Account)");
            count += 2;
        }

        // 9. Default Settings — verify all standard POS settings
        count += createSettingIfNotExists("posDefaultBiller", "Admin", superAdminId, actionsTaken);
        count += createSettingIfNotExists("posDefaultCustomer", "Walk-in Customer", superAdminId, actionsTaken);
        count += createSettingIfNotExists("currency", "INR", superAdminId, actionsTaken);
        count += createSettingIfNotExists("currencySymbol", "₹", superAdminId, actionsTaken);
        count += createSettingIfNotExists("companyName", "Namustutam", superAdminId, actionsTaken);
        count += createSettingIfNotExists("posDisplayKeyboard", "true", superAdminId, actionsTaken);
        count += createSettingIfNotExists("taxRate", "0", superAdminId, actionsTaken);

        // 10. Default Work Center
        if (workCenterRepository.findByUserId(superAdminId).isEmpty()) {
            WorkCenter wc = new WorkCenter();
            wc.setName("Assembly Station 1");
            wc.setDescription("Main manufacturing and assembly workbench");
            wc.setCostPerHour(new BigDecimal("150.00"));
            wc.setUserId(superAdminId);
            workCenterRepository.save(wc);
            actionsTaken.add("Seeded default Work Center: Assembly Station 1");
            count++;
        }

        // 11. Default Demo Products
        if (productRepository.countByUserId(superAdminId) == 0) {
            Product p1 = new Product();
            p1.setName("Quantum Wireless Headphones");
            p1.setSlug("quantum-wireless-headphones");
            p1.setSku("QWH-001");
            p1.setPrice(new BigDecimal("2999.00"));
            p1.setPurchasePrice(new BigDecimal("1800.00"));
            p1.setDescription("Industry-leading active noise cancellation with 40 hours of battery life.");
            p1.setImages("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop");
            p1.setQuantity(50);
            p1.setCategory("Electronics");
            p1.setBrand("Generic");
            p1.setUnit("Pieces");
            p1.setItemBarcode("8901234567890");
            p1.setBarcodeSymbology("CODE128");
            p1.setUserId(superAdminId);

            Product p2 = new Product();
            p2.setName("Nebula Smartwatch Pro");
            p2.setSlug("nebula-smartwatch-pro");
            p2.setSku("NSP-002");
            p2.setPrice(new BigDecimal("4999.00"));
            p2.setPurchasePrice(new BigDecimal("3200.00"));
            p2.setDescription("AMOLED display, 24/7 heart rate and blood oxygen monitoring.");
            p2.setImages("https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=2000&auto=format&fit=crop");
            p2.setQuantity(30);
            p2.setCategory("Electronics");
            p2.setBrand("Generic");
            p2.setUnit("Pieces");
            p2.setItemBarcode("8901234567891");
            p2.setBarcodeSymbology("CODE128");
            p2.setUserId(superAdminId);

            Product p3 = new Product();
            p3.setName("Aero Mechanical Keyboard");
            p3.setSlug("aero-mechanical-keyboard");
            p3.setSku("AMK-003");
            p3.setPrice(new BigDecimal("2499.00"));
            p3.setPurchasePrice(new BigDecimal("1500.00"));
            p3.setDescription("RGB backlit mechanical keyboard with tactile blue switches.");
            p3.setImages("https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2071&auto=format&fit=crop");
            p3.setQuantity(40);
            p3.setCategory("Electronics");
            p3.setBrand("Generic");
            p3.setUnit("Pieces");
            p3.setItemBarcode("8901234567892");
            p3.setBarcodeSymbology("CODE128");
            p3.setUserId(superAdminId);

            Product p4 = new Product();
            p4.setName("iPhone 14 128GB");
            p4.setSlug("iphone-14-128gb");
            p4.setSku("IPH-14-128");
            p4.setPrice(new BigDecimal("69999.00"));
            p4.setPurchasePrice(new BigDecimal("62000.00"));
            p4.setDescription("Super Retina XDR display, advanced dual camera system.");
            p4.setImages("https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=60");
            p4.setQuantity(15);
            p4.setCategory("Electronics");
            p4.setBrand("Apple");
            p4.setUnit("Pieces");
            p4.setItemBarcode("8901234567893");
            p4.setBarcodeSymbology("CODE128");
            p4.setUserId(superAdminId);

            productRepository.saveAll(List.of(p1, p2, p3, p4));
            actionsTaken.add("Seeded initial Products for Super Admin");
            count += 4;
        }

        return count;
    }

    private int ensureUnitExists(String name, String shortName, Long userId, List<String> actionsTaken) {
        boolean exists = unitRepository.findAll().stream()
                .anyMatch(u -> (u.getName() != null && u.getName().equalsIgnoreCase(name))
                        || (u.getShortName() != null && u.getShortName().equalsIgnoreCase(shortName)));
        if (!exists) {
            Unit u = new Unit();
            u.setName(name);
            u.setShortName(shortName);
            u.setStatus(true);
            u.setUserId(userId);
            unitRepository.save(u);
            actionsTaken.add("Created default unit: " + name + " (" + shortName + ")");
            return 1;
        }
        return 0;
    }

    private int ensureCategoryExists(String name, String slug, Long userId, List<String> actionsTaken) {
        if (!categoryRepository.existsBySlugAndUserId(slug, userId)) {
            Category c = new Category();
            c.setName(name);
            c.setSlug(slug);
            c.setStatus(true);
            c.setUserId(userId);
            categoryRepository.save(c);
            actionsTaken.add("Created default category: " + name);
            return 1;
        }
        return 0;
    }

    private int ensureBrandExists(String name, String desc, Long userId, List<String> actionsTaken) {
        boolean exists = brandRepository.findByUserId(userId).stream()
                .anyMatch(b -> b.getName() != null && b.getName().equalsIgnoreCase(name));
        if (!exists) {
            Brand b = new Brand();
            b.setName(name);
            b.setDesc(desc);
            b.setStatus(true);
            b.setUserId(userId);
            brandRepository.save(b);
            actionsTaken.add("Created default brand: " + name);
            return 1;
        }
        return 0;
    }

    private int createSettingIfNotExists(String key, String value, Long userId, List<String> actionsTaken) {
        if (settingRepository.findBySettingKeyAndUserId(key, userId).isEmpty()) {
            Setting s = new Setting(key, value);
            s.setUserId(userId);
            settingRepository.save(s);
            actionsTaken.add("Created default setting: " + key + "=" + value);
            return 1;
        }
        return 0;
    }

    /**
     * Complete catalogue of tables and columns matching backend entity models.
     */
    private Map<String, Map<String, String>> buildSchemaDefinition(boolean isPostgres) {
        String idCol = isPostgres ? "BIGSERIAL PRIMARY KEY" : "BIGINT AUTO_INCREMENT PRIMARY KEY";
        String txt = "TEXT";
        String dt = "TIMESTAMP";
        String d = "DATE";
        String boolDefTrue = "BOOLEAN DEFAULT true";
        String boolDefFalse = "BOOLEAN DEFAULT false";

        Map<String, Map<String, String>> s = new LinkedHashMap<>();

        // 1. users
        Map<String, String> users = new LinkedHashMap<>();
        users.put("id", idCol);
        users.put("email", "VARCHAR(255)");
        users.put("password", "VARCHAR(255)");
        users.put("full_name", "VARCHAR(255)");
        users.put("first_name", "VARCHAR(255)");
        users.put("last_name", "VARCHAR(255)");
        users.put("username", "VARCHAR(255)");
        users.put("business_type", "VARCHAR(255)");
        users.put("phone_number", "VARCHAR(255)");
        users.put("email_verified", boolDefFalse);
        users.put("phone_verified", boolDefFalse);
        users.put("active_project_id", "BIGINT DEFAULT 1");
        users.put("subscription_plan", "VARCHAR(50) DEFAULT 'NONE'");
        users.put("subscription_end_date", dt);
        users.put("next_subscription_plan", "VARCHAR(50)");
        users.put("next_subscription_end_date", dt);
        s.put("users", users);

        // 2. roles
        Map<String, String> roles = new LinkedHashMap<>();
        roles.put("id", idCol);
        roles.put("name", "VARCHAR(50)");
        s.put("roles", roles);

        // 3. user_roles
        Map<String, String> userRoles = new LinkedHashMap<>();
        userRoles.put("user_id", "BIGINT NOT NULL");
        userRoles.put("role_id", "BIGINT NOT NULL");
        s.put("user_roles", userRoles);

        // 4. products
        Map<String, String> products = new LinkedHashMap<>();
        products.put("id", idCol);
        products.put("user_id", "BIGINT DEFAULT 1");
        products.put("name", "VARCHAR(255)");
        products.put("slug", "VARCHAR(255)");
        products.put("sku", "VARCHAR(100)");
        products.put("description", txt);
        products.put("store", "VARCHAR(255)");
        products.put("warehouse", "VARCHAR(255)");
        products.put("selling_type", "VARCHAR(255)");
        products.put("category", "VARCHAR(255)");
        products.put("sub_category", "VARCHAR(255)");
        products.put("brand", "VARCHAR(255)");
        products.put("unit", "VARCHAR(255)");
        products.put("barcode_symbology", "VARCHAR(255)");
        products.put("item_barcode", "VARCHAR(255)");
        products.put("quantity", "INTEGER DEFAULT 0");
        products.put("purchase_price", "NUMERIC(10,2) DEFAULT 0");
        products.put("price", "NUMERIC(10,2) DEFAULT 0");
        products.put("product_type", "VARCHAR(255)");
        products.put("item_type", "VARCHAR(255) DEFAULT 'STANDARD_ITEM'");
        products.put("tax_type", "VARCHAR(255)");
        products.put("tax", "VARCHAR(255)");
        products.put("discount_type", "VARCHAR(255)");
        products.put("discount_value", "NUMERIC(10,2) DEFAULT 0");
        products.put("quantity_alert", "INTEGER DEFAULT 0");
        products.put("warranty", "VARCHAR(255)");
        products.put("manufacturer", "VARCHAR(255)");
        products.put("manufactured_date", d);
        products.put("expiry_date", d);
        products.put("images", txt);
        products.put("variants_json", txt);
        products.put("created_at", dt);
        products.put("updated_at", dt);
        s.put("products", products);

        // 5. categories
        Map<String, String> categories = new LinkedHashMap<>();
        categories.put("id", idCol);
        categories.put("user_id", "BIGINT DEFAULT 1");
        categories.put("name", "VARCHAR(255)");
        categories.put("slug", "VARCHAR(255)");
        categories.put("status", boolDefTrue);
        categories.put("created_at", dt);
        categories.put("updated_at", dt);
        s.put("categories", categories);

        // 6. sub_categories
        Map<String, String> subCategories = new LinkedHashMap<>();
        subCategories.put("id", idCol);
        subCategories.put("user_id", "BIGINT DEFAULT 1");
        subCategories.put("category_id", "BIGINT");
        subCategories.put("name", "VARCHAR(255)");
        subCategories.put("category_code", "VARCHAR(100)");
        subCategories.put("description", txt);
        subCategories.put("status", boolDefTrue);
        subCategories.put("image", "VARCHAR(255)");
        subCategories.put("created_at", dt);
        subCategories.put("updated_at", dt);
        s.put("sub_categories", subCategories);

        // 7. brands
        Map<String, String> brands = new LinkedHashMap<>();
        brands.put("id", idCol);
        brands.put("user_id", "BIGINT DEFAULT 1");
        brands.put("name", "VARCHAR(255)");
        brands.put("description", txt);
        brands.put("img", txt);
        brands.put("status", boolDefTrue);
        brands.put("created_at", dt);
        brands.put("updated_at", dt);
        s.put("brands", brands);

        // 8. units
        Map<String, String> units = new LinkedHashMap<>();
        units.put("id", idCol);
        units.put("user_id", "BIGINT DEFAULT 1");
        units.put("name", "VARCHAR(255)");
        units.put("short_name", "VARCHAR(100)");
        units.put("products", "INTEGER DEFAULT 0");
        units.put("status", boolDefTrue);
        units.put("created_at", dt);
        units.put("updated_at", dt);
        s.put("units", units);

        // 9. warehouses
        Map<String, String> warehouses = new LinkedHashMap<>();
        warehouses.put("id", idCol);
        warehouses.put("user_id", "BIGINT DEFAULT 1");
        warehouses.put("name", "VARCHAR(255)");
        warehouses.put("location", txt);
        warehouses.put("status", boolDefTrue);
        warehouses.put("created_at", dt);
        warehouses.put("updated_at", dt);
        s.put("warehouses", warehouses);

        // 10. stores
        Map<String, String> stores = new LinkedHashMap<>();
        stores.put("id", idCol);
        stores.put("user_id", "BIGINT DEFAULT 1");
        stores.put("name", "VARCHAR(255)");
        stores.put("location", txt);
        stores.put("status", boolDefTrue);
        stores.put("created_at", dt);
        stores.put("updated_at", dt);
        s.put("stores", stores);

        // 11. customers
        Map<String, String> customers = new LinkedHashMap<>();
        customers.put("id", idCol);
        customers.put("user_id", "BIGINT DEFAULT 1");
        customers.put("name", "VARCHAR(255)");
        customers.put("email", "VARCHAR(255)");
        customers.put("phone", "VARCHAR(255)");
        customers.put("address", "VARCHAR(255)");
        customers.put("company", "VARCHAR(255)");
        customers.put("loyalty_tier", "VARCHAR(255) DEFAULT 'Bronze'");
        customers.put("lifetime_value", "NUMERIC(12,2) DEFAULT 0");
        customers.put("created_at", dt);
        customers.put("updated_at", dt);
        s.put("customers", customers);

        // 12. interactions
        Map<String, String> interactions = new LinkedHashMap<>();
        interactions.put("id", idCol);
        interactions.put("customer_id", "BIGINT");
        interactions.put("type", "VARCHAR(255)");
        interactions.put("notes", txt);
        interactions.put("created_at", dt);
        s.put("interactions", interactions);

        // 13. bank_accounts
        Map<String, String> bankAccounts = new LinkedHashMap<>();
        bankAccounts.put("id", idCol);
        bankAccounts.put("user_id", "BIGINT DEFAULT 1");
        bankAccounts.put("bank_name", "VARCHAR(255)");
        bankAccounts.put("account_name", "VARCHAR(255)");
        bankAccounts.put("account_number", "VARCHAR(255)");
        bankAccounts.put("branch_ifsc", "VARCHAR(255)");
        bankAccounts.put("created_at", dt);
        bankAccounts.put("updated_at", dt);
        s.put("bank_accounts", bankAccounts);

        // 14. settings
        Map<String, String> settings = new LinkedHashMap<>();
        settings.put("id", idCol);
        settings.put("user_id", "BIGINT DEFAULT 1");
        settings.put("setting_key", "VARCHAR(255)");
        settings.put("setting_value", txt);
        s.put("settings", settings);

        // 15. pos_orders
        Map<String, String> posOrders = new LinkedHashMap<>();
        posOrders.put("id", idCol);
        posOrders.put("user_id", "BIGINT DEFAULT 1");
        posOrders.put("reference_no", "VARCHAR(255)");
        posOrders.put("customer_name", "VARCHAR(255)");
        posOrders.put("date", d);
        posOrders.put("formatted_date", "VARCHAR(255)");
        posOrders.put("status", "VARCHAR(255)");
        posOrders.put("payment_status", "VARCHAR(255)");
        posOrders.put("order_tax", "NUMERIC(12,2) DEFAULT 0");
        posOrders.put("discount", "NUMERIC(12,2) DEFAULT 0");
        posOrders.put("shipping", "NUMERIC(12,2) DEFAULT 0");
        posOrders.put("grand_total", "NUMERIC(12,2) DEFAULT 0");
        posOrders.put("paid_amount", "NUMERIC(12,2) DEFAULT 0");
        posOrders.put("due_amount", "NUMERIC(12,2) DEFAULT 0");
        posOrders.put("biller", "VARCHAR(255)");
        posOrders.put("products_json", txt);
        posOrders.put("notes", txt);
        posOrders.put("created_at", dt);
        posOrders.put("updated_at", dt);
        s.put("pos_orders", posOrders);

        // 16. sale_orders
        Map<String, String> saleOrders = new LinkedHashMap<>(posOrders);
        s.put("sale_orders", saleOrders);

        // 17. sales_returns
        Map<String, String> salesReturns = new LinkedHashMap<>(posOrders);
        s.put("sales_returns", salesReturns);

        // 18. purchases
        Map<String, String> purchases = new LinkedHashMap<>();
        purchases.put("id", idCol);
        purchases.put("user_id", "BIGINT DEFAULT 1");
        purchases.put("reference", "VARCHAR(255)");
        purchases.put("supplier", "VARCHAR(255)");
        purchases.put("date", d);
        purchases.put("formatted_date", "VARCHAR(255)");
        purchases.put("status", "VARCHAR(255)");
        purchases.put("payment_status", "VARCHAR(255)");
        purchases.put("order_tax", "NUMERIC(12,2) DEFAULT 0");
        purchases.put("discount", "NUMERIC(12,2) DEFAULT 0");
        purchases.put("shipping", "NUMERIC(12,2) DEFAULT 0");
        purchases.put("total", "NUMERIC(12,2) DEFAULT 0");
        purchases.put("paid", "NUMERIC(12,2) DEFAULT 0");
        purchases.put("due", "NUMERIC(12,2) DEFAULT 0");
        purchases.put("products_json", txt);
        purchases.put("notes", txt);
        purchases.put("created_at", dt);
        purchases.put("updated_at", dt);
        s.put("purchases", purchases);

        // 19. purchase_returns
        Map<String, String> purchaseReturns = new LinkedHashMap<>(purchases);
        s.put("purchase_returns", purchaseReturns);

        // 20. stocks
        Map<String, String> stocks = new LinkedHashMap<>();
        stocks.put("id", idCol);
        stocks.put("user_id", "BIGINT DEFAULT 1");
        stocks.put("warehouse", "VARCHAR(255)");
        stocks.put("store", "VARCHAR(255)");
        stocks.put("product_id", "BIGINT");
        stocks.put("product_name", "VARCHAR(255)");
        stocks.put("product_sku", "VARCHAR(255)");
        stocks.put("product_category", "VARCHAR(255)");
        stocks.put("quantity", "INTEGER DEFAULT 0");
        stocks.put("responsible_person", "VARCHAR(255)");
        stocks.put("date", d);
        stocks.put("product_img", txt);
        stocks.put("created_at", dt);
        s.put("stocks", stocks);

        // 21. stock_transfers
        Map<String, String> stockTransfers = new LinkedHashMap<>();
        stockTransfers.put("id", idCol);
        stockTransfers.put("user_id", "BIGINT DEFAULT 1");
        stockTransfers.put("from_warehouse", "VARCHAR(255)");
        stockTransfers.put("to_warehouse", "VARCHAR(255)");
        stockTransfers.put("reference_no", "VARCHAR(255)");
        stockTransfers.put("notes", txt);
        stockTransfers.put("shipping", "VARCHAR(255)");
        stockTransfers.put("status", "VARCHAR(255)");
        stockTransfers.put("description", txt);
        stockTransfers.put("products_json", txt);
        stockTransfers.put("no_of_products", "INTEGER DEFAULT 0");
        stockTransfers.put("quantity_transferred", "INTEGER DEFAULT 0");
        stockTransfers.put("date", d);
        stockTransfers.put("formatted_date", "VARCHAR(255)");
        stockTransfers.put("created_at", dt);
        s.put("stock_transfers", stockTransfers);

        // 22. bill_of_materials
        Map<String, String> boms = new LinkedHashMap<>();
        boms.put("id", idCol);
        boms.put("user_id", "BIGINT DEFAULT 1");
        boms.put("product_id", "BIGINT");
        boms.put("name", "VARCHAR(255)");
        boms.put("created_at", dt);
        boms.put("updated_at", dt);
        s.put("bill_of_materials", boms);

        // 23. bom_items
        Map<String, String> bomItems = new LinkedHashMap<>();
        bomItems.put("id", idCol);
        bomItems.put("bom_id", "BIGINT");
        bomItems.put("ingredient_product_id", "BIGINT");
        bomItems.put("quantity_required", "NUMERIC(10,4) DEFAULT 0");
        s.put("bom_items", bomItems);

        // 24. work_centers
        Map<String, String> workCenters = new LinkedHashMap<>();
        workCenters.put("id", idCol);
        workCenters.put("user_id", "BIGINT DEFAULT 1");
        workCenters.put("name", "VARCHAR(255)");
        workCenters.put("description", txt);
        workCenters.put("cost_per_hour", "NUMERIC(10,2) DEFAULT 0");
        workCenters.put("created_at", dt);
        workCenters.put("updated_at", dt);
        s.put("work_centers", workCenters);

        // 25. work_orders
        Map<String, String> workOrders = new LinkedHashMap<>();
        workOrders.put("id", idCol);
        workOrders.put("user_id", "BIGINT DEFAULT 1");
        workOrders.put("order_number", "VARCHAR(100)");
        workOrders.put("product_id", "BIGINT");
        workOrders.put("bom_id", "BIGINT");
        workOrders.put("quantity_to_produce", "NUMERIC(10,4) DEFAULT 1");
        workOrders.put("status", "VARCHAR(50) DEFAULT 'DRAFT'");
        workOrders.put("created_at", dt);
        workOrders.put("updated_at", dt);
        workOrders.put("completed_at", dt);
        s.put("work_orders", workOrders);

        // 26. warranties
        Map<String, String> warranties = new LinkedHashMap<>();
        warranties.put("id", idCol);
        warranties.put("user_id", "BIGINT DEFAULT 1");
        warranties.put("name", "VARCHAR(255)");
        warranties.put("description", txt);
        warranties.put("duration", "VARCHAR(255)");
        warranties.put("status", boolDefTrue);
        warranties.put("created_at", dt);
        warranties.put("updated_at", dt);
        s.put("warranties", warranties);

        // 27. khata_parties
        Map<String, String> khataParties = new LinkedHashMap<>();
        khataParties.put("id", idCol);
        khataParties.put("user_id", "BIGINT DEFAULT 1");
        khataParties.put("name", "VARCHAR(255)");
        khataParties.put("phone", "VARCHAR(255)");
        khataParties.put("email", "VARCHAR(255)");
        khataParties.put("address", "VARCHAR(255)");
        khataParties.put("business_name", "VARCHAR(255)");
        khataParties.put("gstin", "VARCHAR(255)");
        khataParties.put("party_type", "VARCHAR(255)");
        khataParties.put("opening_balance", "NUMERIC(12,2) DEFAULT 0");
        khataParties.put("opening_balance_type", "VARCHAR(50) DEFAULT 'YOU_WILL_GET'");
        khataParties.put("net_balance", "NUMERIC(12,2) DEFAULT 0");
        khataParties.put("created_at", dt);
        khataParties.put("updated_at", dt);
        s.put("khata_parties", khataParties);

        // 28. khata_transactions
        Map<String, String> khataTransactions = new LinkedHashMap<>();
        khataTransactions.put("id", idCol);
        khataTransactions.put("user_id", "BIGINT DEFAULT 1");
        khataTransactions.put("party_id", "BIGINT");
        khataTransactions.put("party_name", "VARCHAR(255)");
        khataTransactions.put("party_type", "VARCHAR(255)");
        khataTransactions.put("transaction_type", "VARCHAR(50)");
        khataTransactions.put("amount", "NUMERIC(12,2) DEFAULT 0");
        khataTransactions.put("payment_mode", "VARCHAR(50) DEFAULT 'CASH'");
        khataTransactions.put("reference_number", "VARCHAR(255)");
        khataTransactions.put("notes", txt);
        khataTransactions.put("transaction_date", d);
        khataTransactions.put("running_balance", "NUMERIC(12,2) DEFAULT 0");
        khataTransactions.put("created_at", dt);
        s.put("khata_transactions", khataTransactions);

        // 29. project_members
        Map<String, String> projectMembers = new LinkedHashMap<>();
        projectMembers.put("id", idCol);
        projectMembers.put("project_id", "BIGINT");
        projectMembers.put("member_user_id", "BIGINT");
        projectMembers.put("permissions", txt);
        projectMembers.put("role_title", "VARCHAR(255) DEFAULT 'Staff'");
        projectMembers.put("status", "VARCHAR(50) DEFAULT 'ACTIVE'");
        projectMembers.put("joined_at", dt);
        s.put("project_members", projectMembers);

        // 30. project_invitations
        Map<String, String> projectInvitations = new LinkedHashMap<>();
        projectInvitations.put("id", idCol);
        projectInvitations.put("inviter_id", "BIGINT");
        projectInvitations.put("invitee_email", "VARCHAR(255)");
        projectInvitations.put("permissions", txt);
        projectInvitations.put("token", "VARCHAR(255)");
        projectInvitations.put("status", "VARCHAR(50) DEFAULT 'PENDING'");
        projectInvitations.put("created_at", dt);
        s.put("project_invitations", projectInvitations);

        // 31. page_folders
        Map<String, String> pageFolders = new LinkedHashMap<>();
        pageFolders.put("id", idCol);
        pageFolders.put("user_id", "BIGINT");
        pageFolders.put("name", "VARCHAR(255)");
        pageFolders.put("icon", "VARCHAR(255)");
        s.put("page_folders", pageFolders);

        // 32. folder_shares
        Map<String, String> folderShares = new LinkedHashMap<>();
        folderShares.put("folder_id", "BIGINT NOT NULL");
        folderShares.put("user_id", "BIGINT NOT NULL");
        s.put("folder_shares", folderShares);

        // 33. custom_pages
        Map<String, String> customPages = new LinkedHashMap<>();
        customPages.put("id", idCol);
        customPages.put("folder_id", "BIGINT");
        customPages.put("user_id", "BIGINT");
        customPages.put("name", "VARCHAR(255)");
        customPages.put("icon", "VARCHAR(255)");
        s.put("custom_pages", customPages);

        // 34. page_blocks
        Map<String, String> pageBlocks = new LinkedHashMap<>();
        pageBlocks.put("id", idCol);
        pageBlocks.put("user_id", "BIGINT DEFAULT 1");
        pageBlocks.put("page_id", "BIGINT");
        pageBlocks.put("block_type", "VARCHAR(255)");
        pageBlocks.put("content", txt);
        pageBlocks.put("order_index", "INTEGER DEFAULT 0");
        s.put("page_blocks", pageBlocks);

        // 35. folder_invitations
        Map<String, String> folderInvitations = new LinkedHashMap<>();
        folderInvitations.put("id", idCol);
        folderInvitations.put("folder_id", "BIGINT");
        folderInvitations.put("email", "VARCHAR(255)");
        folderInvitations.put("token", "VARCHAR(255)");
        folderInvitations.put("status", "VARCHAR(50) DEFAULT 'PENDING'");
        folderInvitations.put("created_at", dt);
        s.put("folder_invitations", folderInvitations);

        // 36. notes
        Map<String, String> notes = new LinkedHashMap<>();
        notes.put("id", idCol);
        notes.put("content", "VARCHAR(1000)");
        notes.put("user_id", "BIGINT");
        notes.put("target_user_id", "BIGINT");
        notes.put("for_all", boolDefTrue);
        notes.put("created_at", dt);
        s.put("notes", notes);

        // 37. user_ai_settings
        Map<String, String> userAiSettings = new LinkedHashMap<>();
        userAiSettings.put("id", idCol);
        userAiSettings.put("user_id", "BIGINT");
        userAiSettings.put("ai_api_key_enc", txt);
        userAiSettings.put("ai_provider", "VARCHAR(50) DEFAULT 'openai'");
        userAiSettings.put("ai_model", "VARCHAR(150) DEFAULT 'gpt-4o-mini'");
        s.put("user_ai_settings", userAiSettings);

        // 38. subscription_transactions
        Map<String, String> subTxns = new LinkedHashMap<>();
        subTxns.put("id", idCol);
        subTxns.put("user_email", "VARCHAR(255)");
        subTxns.put("plan", "VARCHAR(255)");
        subTxns.put("amount", "DOUBLE PRECISION DEFAULT 0");
        subTxns.put("billing_cycle", "VARCHAR(255)");
        subTxns.put("razorpay_payment_id", "VARCHAR(255)");
        subTxns.put("razorpay_order_id", "VARCHAR(255)");
        subTxns.put("status", "VARCHAR(50) DEFAULT 'SUCCESS'");
        subTxns.put("transaction_date", dt);
        s.put("subscription_transactions", subTxns);

        // 39. landing_page_config
        Map<String, String> landingConfig = new LinkedHashMap<>();
        landingConfig.put("id", idCol);
        landingConfig.put("config_key", "VARCHAR(100) NOT NULL");
        landingConfig.put("content_json", txt);
        landingConfig.put("updated_at", dt);
        landingConfig.put("updated_by", "VARCHAR(150)");
        s.put("landing_page_config", landingConfig);

        // 40. blog_posts
        Map<String, String> blogPosts = new LinkedHashMap<>();
        blogPosts.put("id", idCol);
        blogPosts.put("title", "VARCHAR(500) NOT NULL");
        blogPosts.put("slug", "VARCHAR(255) NOT NULL");
        blogPosts.put("excerpt", "VARCHAR(2000)");
        blogPosts.put("content", txt);
        blogPosts.put("category", "VARCHAR(100) DEFAULT 'Software'");
        blogPosts.put("author", "VARCHAR(150) DEFAULT 'Akshay Patil'");
        blogPosts.put("author_role", "VARCHAR(150) DEFAULT 'Founder & CTO'");
        blogPosts.put("author_avatar", "VARCHAR(500)");
        blogPosts.put("image_url", "VARCHAR(500)");
        blogPosts.put("cover_color", "VARCHAR(255) DEFAULT 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'");
        blogPosts.put("cover_emoji", "VARCHAR(50) DEFAULT '📦'");
        blogPosts.put("read_time", "VARCHAR(50) DEFAULT '5 min'");
        blogPosts.put("tags", "VARCHAR(500)");
        blogPosts.put("visibility", "VARCHAR(50) DEFAULT 'Visible'");
        blogPosts.put("theme_template", "VARCHAR(100)");
        blogPosts.put("views_count", "BIGINT DEFAULT 0");
        blogPosts.put("likes_count", "BIGINT DEFAULT 0");
        blogPosts.put("seo_title", "VARCHAR(500)");
        blogPosts.put("seo_description", "VARCHAR(1000)");
        blogPosts.put("user_id", "BIGINT");
        blogPosts.put("created_at", dt);
        blogPosts.put("updated_at", dt);
        s.put("blog_posts", blogPosts);

        // 41. contact_submissions
        Map<String, String> contactSubmissions = new LinkedHashMap<>();
        contactSubmissions.put("id", idCol);
        contactSubmissions.put("name", "VARCHAR(150) NOT NULL");
        contactSubmissions.put("email", "VARCHAR(150) NOT NULL");
        contactSubmissions.put("phone", "VARCHAR(50)");
        contactSubmissions.put("subject", "VARCHAR(250)");
        contactSubmissions.put("message", txt);
        contactSubmissions.put("service", "VARCHAR(100)");
        contactSubmissions.put("status", "VARCHAR(50) DEFAULT 'NEW'");
        contactSubmissions.put("ip_address", "VARCHAR(60)");
        contactSubmissions.put("admin_notes", txt);
        contactSubmissions.put("created_at", dt);
        contactSubmissions.put("updated_at", dt);
        s.put("contact_submissions", contactSubmissions);

        return s;
    }
}
