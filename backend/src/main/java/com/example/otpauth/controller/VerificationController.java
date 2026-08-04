package com.example.otpauth.controller;

import com.example.otpauth.dto.VerificationRequest;
import com.example.otpauth.service.VerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/verification")
public class VerificationController {

    private final VerificationService verificationService;

    public VerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendOtp(@RequestBody VerificationRequest request) {
        try {
            String otp = verificationService.generateAndSendOtp(request.getEmail(), request.getType());
            Map<String, String> response = new HashMap<>();
            response.put("message", "OTP sent successfully to " + request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to send OTP: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody VerificationRequest request) {
        try {
            boolean isValid = verificationService.verifyOtp(request);
            if (isValid) {
                return ResponseEntity.ok().body("{\"success\": true, \"message\": \"Verification successful\"}");
            } else {
                return ResponseEntity.badRequest().body("{\"success\": false, \"message\": \"Invalid OTP\"}");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"success\": false, \"message\": \"" + e.getMessage() + "\"}");
        }
    }
}
