package com.example.otpauth;

import com.example.otpauth.model.SubscriptionPlan;
import com.example.otpauth.model.User;
import com.example.otpauth.model.Role;
import com.example.otpauth.model.RoleName;
import com.example.otpauth.repository.UserRepository;
import com.example.otpauth.repository.RoleRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@SpringBootTest
public class UserSeederTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.example.otpauth.config.DatabaseSchemaAutoUpgrader schemaUpgrader;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Test
    public void testDatabaseSchemaAutoUpgrade() {
        // Deliberately drop a column to verify auto-repair detection
        jdbcTemplate.execute("ALTER TABLE warranties DROP COLUMN IF EXISTS duration");

        java.util.Map<String, Object> report = schemaUpgrader.performFullSchemaUpgradeAndSeed();
        org.junit.jupiter.api.Assertions.assertNotNull(report);
        org.junit.jupiter.api.Assertions.assertEquals("SUCCESS", report.get("status"));
        org.junit.jupiter.api.Assertions.assertEquals(38, report.get("tablesChecked"));
        org.junit.jupiter.api.Assertions.assertTrue((Integer) report.get("columnsAdded") >= 1, "Should have auto-added missing column");

        // Verify that after upgrade, subsequent run is clean (0 columns missing)
        java.util.Map<String, Object> report2 = schemaUpgrader.performFullSchemaUpgradeAndSeed();
        org.junit.jupiter.api.Assertions.assertEquals(0, report2.get("columnsAdded"));
        System.out.println("Auto-Upgrade Report: " + report);
    }

    @Test
    public void testDatabaseCleanupOfUnneededTablesAndColumnsAndRows() {
        // 1. Create a dummy unneeded table
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS dummy_unneeded_test_table (id BIGSERIAL PRIMARY KEY, test_val VARCHAR(100))");

        // 2. Add an unneeded column to an existing table
        try {
            jdbcTemplate.execute("ALTER TABLE warranties ADD COLUMN IF NOT EXISTS unneeded_test_column VARCHAR(100)");
        } catch (Exception ignored) {
        }

        // 3. Insert an invalid orphaned/dummy row
        try {
            jdbcTemplate.execute("INSERT INTO roles (name) VALUES ('')");
        } catch (Exception ignored) {
        }

        // Run full cleanup
        java.util.Map<String, Object> cleanupReport = schemaUpgrader.performFullCleanup();
        org.junit.jupiter.api.Assertions.assertNotNull(cleanupReport);
        org.junit.jupiter.api.Assertions.assertEquals("SUCCESS", cleanupReport.get("status"));
        org.junit.jupiter.api.Assertions.assertTrue((Integer) cleanupReport.get("tablesDropped") >= 1, "Should have dropped dummy_unneeded_test_table");
        org.junit.jupiter.api.Assertions.assertTrue((Integer) cleanupReport.get("columnsDropped") >= 1, "Should have dropped unneeded_test_column");

        // Verify table no longer exists
        Integer tableCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.tables WHERE LOWER(table_name) = 'dummy_unneeded_test_table'",
                Integer.class
        );
        org.junit.jupiter.api.Assertions.assertEquals(0, tableCount != null ? tableCount : 0);

        // Verify column no longer exists
        Integer colCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.columns WHERE LOWER(table_name) = 'warranties' AND LOWER(column_name) = 'unneeded_test_column'",
                Integer.class
        );
        org.junit.jupiter.api.Assertions.assertEquals(0, colCount != null ? colCount : 0);

        // Subsequent cleanup run should be clean (0 drops)
        java.util.Map<String, Object> secondCleanup = schemaUpgrader.performFullCleanup();
        org.junit.jupiter.api.Assertions.assertEquals(0, secondCleanup.get("tablesDropped"));
        org.junit.jupiter.api.Assertions.assertEquals(0, secondCleanup.get("columnsDropped"));
        System.out.println("Database Cleanup Report: " + cleanupReport);
    }

    @Test
    public void seedUsers() {
        Role clientRole = roleRepository.findByName(RoleName.CLIENT).orElseGet(() -> {
            Role newRole = new Role(RoleName.CLIENT);
            return roleRepository.save(newRole);
        });

        // createUser("starter@example.com", "password123", "Starter User",
        // SubscriptionPlan.STARTER, clientRole);
        // createUser("growth@example.com", "password123", "Growth User",
        // SubscriptionPlan.GROWTH, clientRole);
        // createUser("premium@example.com", "password123", "Premium User",
        // SubscriptionPlan.PREMIUM, clientRole);
    }

    private void createUser(String email, String password, String fullName, SubscriptionPlan plan, Role role) {
        if (!userRepository.findByEmail(email).isPresent()) {
            User user = new User(email, passwordEncoder.encode(password), fullName);
            user.setPlan(plan);
            user.setSubscriptionEndDate(LocalDateTime.now().plusYears(1));
            user.getRoles().add(role);
            user.setEmailVerified(true);
            userRepository.save(user);
            System.out.println("User created: " + email + " with plan " + plan);
        } else {
            User user = userRepository.findByEmail(email).get();
            user.setPlan(plan);
            user.setSubscriptionEndDate(LocalDateTime.now().plusYears(1));
            userRepository.save(user);
            System.out.println("User updated: " + email + " with plan " + plan);
        }
    }
}
