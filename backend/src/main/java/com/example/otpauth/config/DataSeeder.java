package com.example.otpauth.config;

import com.example.otpauth.model.Role;
import com.example.otpauth.model.RoleName;
import com.example.otpauth.model.Unit;
import com.example.otpauth.model.User;
import com.example.otpauth.model.Product;
import com.example.otpauth.repository.RoleRepository;
import com.example.otpauth.repository.UnitRepository;
import com.example.otpauth.repository.UserRepository;
import com.example.otpauth.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner initData(
            UnitRepository unitRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
            ProductRepository productRepository,
            PasswordEncoder passwordEncoder,
            JdbcTemplate jdbcTemplate) {
        return args -> {
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
                                      AND kcu.column_name IN ('sku', 'slug', 'key')
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
                System.out.println("DataSeeder: Dropped old single-column unique constraints.");
            } catch (Exception e) {
                System.out.println("Could not drop old unique constraints: " + e.getMessage());
            }

            // Initial units are seeded after user creation now

            // ── 2. Seed roles ────────────────────────────────────────────────
            Role superAdminRole = roleRepository.findByName(RoleName.SUPER_ADMIN).orElseGet(() -> {
                Role r = new Role(RoleName.SUPER_ADMIN);
                return roleRepository.save(r);
            });
            roleRepository.findByName(RoleName.ADMIN).orElseGet(() -> {
                Role r = new Role(RoleName.ADMIN);
                return roleRepository.save(r);
            });
            roleRepository.findByName(RoleName.CLIENT).orElseGet(() -> {
                Role r = new Role(RoleName.CLIENT);
                return roleRepository.save(r);
            });
            roleRepository.findByName(RoleName.OTHER).orElseGet(() -> {
                Role r = new Role(RoleName.OTHER);
                return roleRepository.save(r);
            });

            // // ── 3. Upsert SUPER_ADMIN user (always sync password on startup) ──
            String superAdminEmail = "admin@gmail.com";
            String superAdminPassword = "Admin@12345";
            String superAdminName = "Super Admin";

            User superAdmin = userRepository.findByEmail(superAdminEmail).orElseGet(() ->
            {
            User newUser = new User(superAdminEmail,
            passwordEncoder.encode(superAdminPassword), superAdminName);
            newUser.getRoles().add(superAdminRole);
            return userRepository.save(newUser);
            });

            // ── 4. Seed default units for SUPER_ADMIN
            // ────────────────────────────────────────
            if (unitRepository.count() == 0) {
                Unit pieces = new Unit();
                pieces.setName("Pieces");
                pieces.setShortName("pcs");
                pieces.setStatus(true);
                pieces.setUserId(superAdmin.getId());
                Unit kg = new Unit();
                kg.setName("Kilograms");
                kg.setShortName("kg");
                kg.setStatus(true);
                kg.setUserId(superAdmin.getId());
                Unit grams = new Unit();
                grams.setName("Grams");
                grams.setShortName("g");
                grams.setStatus(true);
                grams.setUserId(superAdmin.getId());
                Unit meters = new Unit();
                meters.setName("Meters");
                meters.setShortName("m");
                meters.setStatus(true);
                meters.setUserId(superAdmin.getId());
                Unit liters = new Unit();
                liters.setName("Liters");
                liters.setShortName("L");
                liters.setStatus(true);
                liters.setUserId(superAdmin.getId());
                unitRepository.saveAll(List.of(pieces, kg, grams, meters, liters));
                System.out.println("DataSeeder: Initial units seeded for Super Admin.");
            }

            // ── 5. Seed default products for SUPER_ADMIN ───────────
            if (productRepository.count() == 0 && superAdmin != null) {
                Product p1 = new Product();
                p1.setName("Airpod 2");
                p1.setCategory("Headset");
                p1.setPrice(new BigDecimal("158.00"));
                p1.setQuantity(20);
                p1.setSku("APOD-2");
                p1.setUserId(superAdmin.getId());
                p1.setImages("https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=500&auto=format&fit=crop&q=60");

                Product p2 = new Product();
                p2.setName("MacBook Pro 14");
                p2.setCategory("Laptops");
                p2.setPrice(new BigDecimal("1200.00"));
                p2.setQuantity(5);
                p2.setSku("MBP-14");
                p2.setUserId(superAdmin.getId());
                p2.setImages("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60");

                Product p3 = new Product();
                p3.setName("Red Nike Angelo");
                p3.setCategory("Shoes");
                p3.setPrice(new BigDecimal("120.00"));
                p3.setQuantity(15);
                p3.setSku("NKE-ANG-R");
                p3.setUserId(superAdmin.getId());
                p3.setImages("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60");

                Product p4 = new Product();
                p4.setName("iPhone 14 64GB");
                p4.setCategory("Mobiles");
                p4.setPrice(new BigDecimal("800.00"));
                p4.setQuantity(10);
                p4.setSku("IPH14-64");
                p4.setUserId(superAdmin.getId());
                p4.setImages("https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=60");

                productRepository.saveAll(List.of(p1, p2, p3, p4));
                System.out.println("DataSeeder: Initial products seeded for Super Admin.");
            }
        };
    }
}
