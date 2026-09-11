package com.example.otpauth.controller;

import com.example.otpauth.dto.AuthResponse;
import com.example.otpauth.dto.LoginRequest;
import com.example.otpauth.dto.RegisterRequest;
import com.example.otpauth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import com.example.otpauth.dto.OnboardingRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> payload) {
        try {
            String credential = payload.get("credential");
            if (credential == null || credential.isEmpty()) {
                return ResponseEntity.badRequest().body("Missing credential");
            }
            AuthResponse response = authService.googleLogin(credential);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Google Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/onboarding")
    public ResponseEntity<?> completeOnboarding(@RequestBody OnboardingRequest request, Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            AuthResponse response = authService.completeOnboarding(request, authentication.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Onboarding failed: " + e.getMessage());
        }
    }

    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam String username) {
        try {
            return ResponseEntity.ok(authService.checkUsername(username));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            AuthResponse response = authService.getCurrentUser(authentication.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
