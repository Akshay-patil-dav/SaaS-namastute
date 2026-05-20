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
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            // ── 1. Seed default units ────────────────────────────────────────
            if (unitRepository.count() == 0) {
                Unit pieces = new Unit(); pieces.setName("Pieces");     pieces.setShortName("pcs"); pieces.setStatus(true);
                Unit kg     = new Unit(); kg.setName("Kilograms");      kg.setShortName("kg");      kg.setStatus(true);
                Unit grams  = new Unit(); grams.setName("Grams");       grams.setShortName("g");    grams.setStatus(true);
                Unit meters = new Unit(); meters.setName("Meters");     meters.setShortName("m");   meters.setStatus(true);
                Unit liters = new Unit(); liters.setName("Liters");     liters.setShortName("L");   liters.setStatus(true);
                unitRepository.saveAll(List.of(pieces, kg, grams, meters, liters));
                System.out.println("DataSeeder: Initial units seeded.");
            }

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

            // ── 3. Seed real default products matching POS mock items ────────
            if (productRepository.count() == 0) {
                // iPhone 14 64GB
                Product p1 = new Product();
                p1.setName("iPhone 14 64GB");
                p1.setSlug("iphone-14-64gb");
                p1.setSku("IPH14-64");
                p1.setCategory("Mobiles");
                p1.setPrice(BigDecimal.valueOf(15800.00));
                p1.setQuantity(12);
                p1.setImages("https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=60");
                p1.setStore("Freshmart");
                p1.setWarehouse("Main Warehouse");
                p1.setUnit("Pieces");
                p1.setBarcodeSymbology("CODE128");
                p1.setItemBarcode("123456789012");
                p1.setProductType("SINGLE");
                p1.setBrand("Apple");

                // MacBook Pro
                Product p2 = new Product();
                p2.setName("MacBook Pro");
                p2.setSlug("macbook-pro");
                p2.setSku("MBP-14");
                p2.setCategory("Laptops");
                p2.setPrice(BigDecimal.valueOf(1000.00));
                p2.setQuantity(8);
                p2.setImages("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60");
                p2.setStore("Freshmart");
                p2.setWarehouse("Main Warehouse");
                p2.setUnit("Pieces");
                p2.setBarcodeSymbology("CODE128");
                p2.setItemBarcode("123456789013");
                p2.setProductType("SINGLE");
                p2.setBrand("Apple");

                // Rolex Tribute V3
                Product p3 = new Product();
                p3.setName("Rolex Tribute V3");
                p3.setSlug("rolex-tribute-v3");
                p3.setSku("RLX-V3");
                p3.setCategory("Watches");
                p3.setPrice(BigDecimal.valueOf(6800.00));
                p3.setQuantity(5);
                p3.setImages("https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=500&auto=format&fit=crop&q=60");
                p3.setStore("Freshmart");
                p3.setWarehouse("Main Warehouse");
                p3.setUnit("Pieces");
                p3.setBarcodeSymbology("CODE128");
                p3.setItemBarcode("123456789014");
                p3.setProductType("SINGLE");
                p3.setBrand("Rolex");

                // Red Nike Angelo
                Product p4 = new Product();
                p4.setName("Red Nike Angelo");
                p4.setSlug("red-nike-angelo");
                p4.setSku("NKE-ANG-R");
                p4.setCategory("Shoes");
                p4.setPrice(BigDecimal.valueOf(398.00));
                p4.setQuantity(15);
                p4.setImages("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60");
                p4.setStore("Freshmart");
                p4.setWarehouse("Main Warehouse");
                p4.setUnit("Pieces");
                p4.setBarcodeSymbology("CODE128");
                p4.setItemBarcode("123456789015");
                p4.setProductType("SINGLE");
                p4.setBrand("Nike");

                // Airpod 2
                Product p5 = new Product();
                p5.setName("Airpod 2");
                p5.setSlug("airpod-2");
                p5.setSku("APOD-2");
                p5.setCategory("Headset");
                p5.setPrice(BigDecimal.valueOf(1580.00));
                p5.setQuantity(20);
                p5.setImages("https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=500&auto=format&fit=crop&q=60");
                p5.setStore("Freshmart");
                p5.setWarehouse("Main Warehouse");
                p5.setUnit("Pieces");
                p5.setBarcodeSymbology("CODE128");
                p5.setItemBarcode("123456789016");
                p5.setProductType("SINGLE");
                p5.setBrand("Apple");

                // Blue White OGR
                Product p6 = new Product();
                p6.setName("Blue White OGR");
                p6.setSlug("blue-white-ogr");
                p6.setSku("OGR-BW");
                p6.setCategory("Shoes");
                p6.setPrice(BigDecimal.valueOf(350.00));
                p6.setQuantity(32);
                p6.setImages("https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=60");
                p6.setStore("Freshmart");
                p6.setWarehouse("Main Warehouse");
                p6.setUnit("Pieces");
                p6.setBarcodeSymbology("CODE128");
                p6.setItemBarcode("123456789017");
                p6.setProductType("SINGLE");
                p6.setBrand("OGR");

                // IdeaPad Slim 5 Gen 7
                Product p7 = new Product();
                p7.setName("IdeaPad Slim 5 Gen 7");
                p7.setSlug("ideapad-slim-5-gen-7");
                p7.setSku("IP-SL5");
                p7.setCategory("Laptops");
                p7.setPrice(BigDecimal.valueOf(3000.00));
                p7.setQuantity(10);
                p7.setImages("https://images.unsplash.com/photo-1496181130204-755241544e3f?w=500&auto=format&fit=crop&q=60");
                p7.setStore("Freshmart");
                p7.setWarehouse("Main Warehouse");
                p7.setUnit("Pieces");
                p7.setBarcodeSymbology("CODE128");
                p7.setItemBarcode("123456789018");
                p7.setProductType("SINGLE");
                p7.setBrand("Lenovo");

                // SWAGME Headset
                Product p8 = new Product();
                p8.setName("SWAGME Headset");
                p8.setSlug("swagme-headset");
                p8.setSku("SWM-HS");
                p8.setCategory("Headset");
                p8.setPrice(BigDecimal.valueOf(398.00));
                p8.setQuantity(25);
                p8.setImages("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60");
                p8.setStore("Freshmart");
                p8.setWarehouse("Main Warehouse");
                p8.setUnit("Pieces");
                p8.setBarcodeSymbology("CODE128");
                p8.setItemBarcode("123456789019");
                p8.setProductType("SINGLE");
                p8.setBrand("SWAGME");

                // Tablet 1.02 inch
                Product p9 = new Product();
                p9.setName("Tablet 1.02 inch");
                p9.setSlug("tablet-1-02-inch");
                p9.setSku("TAB-1.02");
                p9.setCategory("Mobiles");
                p9.setPrice(BigDecimal.valueOf(3000.00));
                p9.setQuantity(20);
                p9.setImages("https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500");
                p9.setStore("Freshmart");
                p9.setWarehouse("Main Warehouse");
                p9.setUnit("Pieces");
                p9.setBarcodeSymbology("CODE128");
                p9.setItemBarcode("123456789020");
                p9.setProductType("SINGLE");
                p9.setBrand("Apple");

                // IdeaPad Slim 3i
                Product p10 = new Product();
                p10.setName("IdeaPad Slim 3i");
                p10.setSlug("ideapad-slim-3i");
                p10.setSku("IP-SL3I");
                p10.setCategory("Laptops");
                p10.setPrice(BigDecimal.valueOf(3000.00));
                p10.setQuantity(25);
                p10.setImages("https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500");
                p10.setStore("Freshmart");
                p10.setWarehouse("Main Warehouse");
                p10.setUnit("Pieces");
                p10.setBarcodeSymbology("CODE128");
                p10.setItemBarcode("123456789021");
                p10.setProductType("SINGLE");
                p10.setBrand("Lenovo");

                productRepository.saveAll(List.of(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10));
                System.out.println("DataSeeder: 10 target visual-identical products seeded successfully.");
            }

            // ── 4. Upsert SUPER_ADMIN user (always sync password on startup) ──
            String superAdminEmail    = "admin@gmail.com";
            String superAdminPassword = "Admin@12345";
            String superAdminName     = "Super Admin";

            userRepository.findByEmail(superAdminEmail).ifPresentOrElse(
                existing -> {
                    // Always update password so it stays in sync with this file
                    existing.setPassword(passwordEncoder.encode(superAdminPassword));
                    existing.setFullName(superAdminName);
                    // Ensure SUPER_ADMIN role is assigned
                    existing.getRoles().add(superAdminRole);
                    userRepository.save(existing);
                    System.out.println("DataSeeder: Super admin password synced → " + superAdminEmail);
                },
                () -> {
                    User superAdmin = new User(
                            superAdminEmail,
                            passwordEncoder.encode(superAdminPassword),
                            superAdminName
                    );
                    superAdmin.getRoles().add(superAdminRole);
                    userRepository.save(superAdmin);
                    System.out.println("DataSeeder: Super admin user created → " + superAdminEmail);
                }
            );
        };
    }
}
