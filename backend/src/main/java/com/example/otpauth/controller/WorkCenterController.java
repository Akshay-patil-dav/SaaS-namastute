package com.example.otpauth.controller;

import com.example.otpauth.config.JwtUtil;
import com.example.otpauth.model.User;
import com.example.otpauth.model.WorkCenter;
import com.example.otpauth.repository.UserRepository;
import com.example.otpauth.service.WorkCenterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/manufacturing/work-centers")
public class WorkCenterController {

    @Autowired
    private WorkCenterService workCenterService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    private Long getUserIdFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            try {
                String jwt = token.substring(7);
                String email = jwtUtil.extractUsername(jwt);
                Optional<User> userOpt = userRepository.findByEmail(email);
                if (userOpt.isPresent()) return userOpt.get().getId();
            } catch (Exception ignored) {}
        }
        return com.example.otpauth.util.SecurityUtils.getCurrentUserId();
    }

    @GetMapping
    public ResponseEntity<?> getAllWorkCenters(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            Long userId = getUserIdFromToken(token);
            if (userId == null) return ResponseEntity.badRequest().body("User not found");
            
            List<WorkCenter> centers = workCenterService.getWorkCentersByUserId(userId);
            return ResponseEntity.ok(centers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createWorkCenter(@RequestHeader(value = "Authorization", required = false) String token, @RequestBody WorkCenter center) {
        try {
            Long userId = getUserIdFromToken(token);
            if (userId == null) return ResponseEntity.badRequest().body("User not found");
            
            WorkCenter saved = workCenterService.createWorkCenter(userId, center);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateWorkCenter(@RequestHeader(value = "Authorization", required = false) String token, @PathVariable Long id, @RequestBody WorkCenter center) {
        try {
            Long userId = getUserIdFromToken(token);
            if (userId == null) return ResponseEntity.badRequest().body("User not found");
            
            WorkCenter updated = workCenterService.updateWorkCenter(id, userId, center);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorkCenter(@RequestHeader(value = "Authorization", required = false) String token, @PathVariable Long id) {
        try {
            Long userId = getUserIdFromToken(token);
            if (userId == null) return ResponseEntity.badRequest().body("User not found");
            
            workCenterService.deleteWorkCenter(id, userId);
            return ResponseEntity.ok("Deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
