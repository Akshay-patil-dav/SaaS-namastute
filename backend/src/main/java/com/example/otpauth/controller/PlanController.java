package com.example.otpauth.controller;

import com.example.otpauth.dto.PlanRequest;
import com.example.otpauth.model.SubscriptionPlan;
import com.example.otpauth.model.User;
import com.example.otpauth.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class PlanController {

    private final UserRepository userRepository;

    public PlanController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PutMapping("/current/plan")
    public ResponseEntity<?> updatePlan(@RequestBody PlanRequest request, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            SubscriptionPlan plan;
            try {
                plan = SubscriptionPlan.valueOf(request.getPlan().toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid plan type");
            }

            user.setPlan(plan);
            userRepository.save(user);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Plan updated successfully");
            response.put("plan", plan.name());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update plan: " + e.getMessage());
        }
    }
}
