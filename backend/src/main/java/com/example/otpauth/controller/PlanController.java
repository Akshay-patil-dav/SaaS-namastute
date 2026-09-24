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
    private final com.example.otpauth.service.DataUsageService dataUsageService;

    public PlanController(UserRepository userRepository, com.example.otpauth.service.DataUsageService dataUsageService) {
        this.userRepository = userRepository;
        this.dataUsageService = dataUsageService;
    }

    @GetMapping("/current/usage")
    public ResponseEntity<?> getUsage(Authentication authentication) {
        try {
            Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
            if (userId == null && authentication != null) {
                User u = userRepository.findByEmail(authentication.getName()).orElse(null);
                if (u != null) {
                    userId = u.getActiveProjectId() != null ? u.getActiveProjectId() : u.getId();
                }
            }
            if (userId == null) {
                userId = 1L;
            }
            return ResponseEntity.ok(dataUsageService.getUsageSummary(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
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
            if (plan != SubscriptionPlan.NONE) {
                user.setSubscriptionEndDate(java.time.LocalDateTime.now().plusDays(30));
            } else {
                user.setSubscriptionEndDate(null);
            }
            userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Plan updated successfully");
            response.put("plan", plan.name());
            if (user.getSubscriptionEndDate() != null) {
                response.put("subscriptionEndDate", user.getSubscriptionEndDate().toString());
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update plan: " + e.getMessage());
        }
    }
}
