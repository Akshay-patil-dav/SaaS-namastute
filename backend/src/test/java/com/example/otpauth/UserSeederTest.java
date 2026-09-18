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
