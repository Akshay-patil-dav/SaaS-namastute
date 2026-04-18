package com.example.otpauth.config;

import com.example.otpauth.model.Role;
import com.example.otpauth.model.RoleName;
import com.example.otpauth.model.Unit;
import com.example.otpauth.model.User;
import com.example.otpauth.repository.RoleRepository;
import com.example.otpauth.repository.UnitRepository;
import com.example.otpauth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner initData(
            UnitRepository unitRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
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

            // ── 3. Upsert SUPER_ADMIN user (always sync password on startup) ──
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
