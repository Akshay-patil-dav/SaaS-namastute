package com.example.otpauth.config;

import com.example.otpauth.model.*;
import com.example.otpauth.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataSeeder {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    @Bean
    public CommandLineRunner initData(
            UnitRepository unitRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            BrandRepository brandRepository,
            WarehouseRepository warehouseRepository,
            StoreRepository storeRepository,
            CustomerRepository customerRepository,
            SettingRepository settingRepository,
            BankAccountRepository bankAccountRepository,
            WorkCenterRepository workCenterRepository,
            PasswordEncoder passwordEncoder,
            JdbcTemplate jdbcTemplate) {
        return args -> {
            log.info("DataSeeder: Checking database tables and foundational seed data...");

            // ── 1. Drop old single-column unique constraints safely ──────────
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
                            EXECUTE 'ALTER TABLE ' || r.table_name || ' DROP CONSTRAINT ' || r.constraint_name;
                        END LOOP;
                    END $$;
                """);
                log.info("DataSeeder: Dropped old single-column unique constraints if any existed.");
            } catch (Exception e) {
                log.debug("DataSeeder: Note on unique constraint migration: {}", e.getMessage());
            }

            // ── 2. Seed Roles ────────────────────────────────────────────────
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
            log.info("DataSeeder: Roles verified.");

            // ── 3. Seed / Update Super Admin User ────────────────────────────
            String superAdminEmail = "admin@gmail.com";
            String superAdminPassword = "Admin@12345";
            String superAdminName = "Super Admin";

            User superAdmin = userRepository.findByEmail(superAdminEmail).orElseGet(() -> {
                User newUser = new User(superAdminEmail, passwordEncoder.encode(superAdminPassword), superAdminName);
                newUser.setUsername("admin");
                newUser.setRoles(new java.util.HashSet<>(List.of(superAdminRole, adminRole)));
                newUser.setPlan(SubscriptionPlan.PREMIUM);
                newUser.setSubscriptionEndDate(LocalDateTime.now().plusYears(10));
                newUser.setBusinessType("POS & Retail");
                newUser.setEmailVerified(true);
                newUser.setPhoneVerified(true);
                newUser.setPhoneNumber("+1234567890");
                newUser.setActiveProjectId(1L);
                return userRepository.save(newUser);
            });

            // Ensure superAdmin has essential roles and active enterprise plan
            boolean updatedAdmin = false;
            if (superAdmin.getRoles() == null || superAdmin.getRoles().isEmpty()) {
                superAdmin.setRoles(new java.util.HashSet<>(List.of(superAdminRole, adminRole)));
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
            log.info("DataSeeder: Super Admin user verified (Email: {}).", superAdminEmail);

            Long superAdminId = superAdmin.getId();

            // ── 4. Seed Default Units ────────────────────────────────────────
            if (unitRepository.count() == 0) {
                Unit pieces = createUnit("Pieces", "pcs", superAdminId);
                Unit kg     = createUnit("Kilograms", "kg", superAdminId);
                Unit grams  = createUnit("Grams", "g", superAdminId);
                Unit meters = createUnit("Meters", "m", superAdminId);
                Unit liters = createUnit("Liters", "L", superAdminId);
                Unit boxes  = createUnit("Boxes", "box", superAdminId);
                Unit packets = createUnit("Packets", "pkt", superAdminId);
                unitRepository.saveAll(List.of(pieces, kg, grams, meters, liters, boxes, packets));
                log.info("DataSeeder: Default units seeded.");
            }

            // ── 5. Seed Default Categories ───────────────────────────────────
            if (categoryRepository.count() == 0) {
                Category cat1 = new Category();
                cat1.setName("Electronics");
                cat1.setSlug("electronics");
                cat1.setStatus(true);
                cat1.setUserId(superAdminId);

                Category cat2 = new Category();
                cat2.setName("Groceries");
                cat2.setSlug("groceries");
                cat2.setStatus(true);
                cat2.setUserId(superAdminId);

                Category cat3 = new Category();
                cat3.setName("Clothing");
                cat3.setSlug("clothing");
                cat3.setStatus(true);
                cat3.setUserId(superAdminId);

                Category cat4 = new Category();
                cat4.setName("General");
                cat4.setSlug("general");
                cat4.setStatus(true);
                cat4.setUserId(superAdminId);

                categoryRepository.saveAll(List.of(cat1, cat2, cat3, cat4));
                log.info("DataSeeder: Default categories seeded.");
            }

            // ── 6. Seed Default Brands ───────────────────────────────────────
            if (brandRepository.count() == 0) {
                Brand b1 = new Brand();
                b1.setName("Generic");
                b1.setDesc("Standard unbranded items");
                b1.setStatus(true);
                b1.setUserId(superAdminId);

                Brand b2 = new Brand();
                b2.setName("Apple");
                b2.setDesc("Apple Electronics");
                b2.setStatus(true);
                b2.setUserId(superAdminId);

                Brand b3 = new Brand();
                b3.setName("Samsung");
                b3.setDesc("Samsung Electronics");
                b3.setStatus(true);
                b3.setUserId(superAdminId);

                brandRepository.saveAll(List.of(b1, b2, b3));
                log.info("DataSeeder: Default brands seeded.");
            }

            // ── 7. Seed Default Warehouse & Store ────────────────────────────
            if (warehouseRepository.count() == 0) {
                Warehouse wh = new Warehouse();
                wh.setName("Main Warehouse");
                wh.setLocation("Headquarters Central");
                wh.setStatus(true);
                wh.setUserId(superAdminId);
                warehouseRepository.save(wh);
                log.info("DataSeeder: Default warehouse seeded.");
            }

            if (storeRepository.count() == 0) {
                Store st = new Store();
                st.setName("Main Branch");
                st.setLocation("Store #1 Front Desk");
                st.setStatus(true);
                st.setUserId(superAdminId);
                storeRepository.save(st);
                log.info("DataSeeder: Default store seeded.");
            }

            // ── 8. Seed Default Customer ─────────────────────────────────────
            if (customerRepository.count() == 0) {
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
                log.info("DataSeeder: Default customer seeded.");
            }

            // ── 9. Seed Default Bank Accounts ────────────────────────────────
            if (bankAccountRepository.count() == 0) {
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
                log.info("DataSeeder: Default bank accounts seeded.");
            }

            // ── 10. Seed Default Settings ────────────────────────────────────
            if (settingRepository.count() == 0) {
                createSetting(settingRepository, "posDefaultBiller", "Admin", superAdminId);
                createSetting(settingRepository, "posDefaultCustomer", "Walk-in Customer", superAdminId);
                createSetting(settingRepository, "currency", "INR", superAdminId);
                createSetting(settingRepository, "currencySymbol", "₹", superAdminId);
                createSetting(settingRepository, "companyName", "Namustutam", superAdminId);
                createSetting(settingRepository, "posDisplayKeyboard", "true", superAdminId);
                createSetting(settingRepository, "taxRate", "0", superAdminId);
                log.info("DataSeeder: Default settings seeded.");
            }

            // ── 11. Seed Default Products ────────────────────────────────────
            if (productRepository.count() == 0) {
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
                log.info("DataSeeder: Default products seeded for Super Admin.");
            }

            // ── 12. Seed Default Work Center ─────────────────────────────────
            if (workCenterRepository.count() == 0) {
                WorkCenter wc = new WorkCenter();
                wc.setName("Assembly Station 1");
                wc.setDescription("Main manufacturing and assembly workbench");
                wc.setCostPerHour(new BigDecimal("150.00"));
                wc.setUserId(superAdminId);
                workCenterRepository.save(wc);
                log.info("DataSeeder: Default work center seeded.");
            }

            log.info("DataSeeder: All tables, columns, and foundational rows verified successfully.");
        };
    }

    private Unit createUnit(String name, String shortName, Long userId) {
        Unit u = new Unit();
        u.setName(name);
        u.setShortName(shortName);
        u.setStatus(true);
        u.setUserId(userId);
        return u;
    }

    private void createSetting(SettingRepository repo, String key, String value, Long userId) {
        Setting s = new Setting(key, value);
        s.setUserId(userId);
        repo.save(s);
    }
}
