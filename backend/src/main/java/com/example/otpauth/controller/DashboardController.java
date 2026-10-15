package com.example.otpauth.controller;

import com.example.otpauth.dto.DashboardDTO;
import com.example.otpauth.service.DashboardService;
import com.example.otpauth.config.JwtUtil;
import com.example.otpauth.model.User;
import com.example.otpauth.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public DashboardController(DashboardService dashboardService, JwtUtil jwtUtil, UserRepository userRepository) {
        this.dashboardService = dashboardService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @GetMapping("/sales")
    public ResponseEntity<?> getSalesDashboardAnalytics(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
            if (userId == null && token != null && token.startsWith("Bearer ")) {
                String jwt = token.substring(7);
                String email = jwtUtil.extractUsername(jwt);
                Optional<User> userOptional = userRepository.findByEmail(email);
                if (userOptional.isPresent()) {
                    User u = userOptional.get();
                    userId = u.getActiveProjectId() != null ? u.getActiveProjectId() : u.getId();
                }
            }
            if (userId == null) {
                return ResponseEntity.badRequest().body("User not authenticated");
            }
            
            DashboardDTO dashboard = dashboardService.getDashboardAnalytics(userId);
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching dashboard data: " + e.getMessage());
        }
    }

    @GetMapping("/chart")
    public ResponseEntity<?> getSalesPurchaseChartData(
            @RequestHeader(value = "Authorization", required = false) String token,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "1W", required = false) String period) {
        try {
            Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
            if (userId == null && token != null && token.startsWith("Bearer ")) {
                String jwt = token.substring(7);
                String email = jwtUtil.extractUsername(jwt);
                Optional<User> userOptional = userRepository.findByEmail(email);
                if (userOptional.isPresent()) {
                    User u = userOptional.get();
                    userId = u.getActiveProjectId() != null ? u.getActiveProjectId() : u.getId();
                }
            }
            if (userId == null) {
                return ResponseEntity.badRequest().body("User not authenticated");
            }

            java.util.List<com.example.otpauth.dto.SalesPurchaseChartDTO> chartData = dashboardService.getSalesPurchaseChartData(userId, period);
            return ResponseEntity.ok(chartData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching chart data: " + e.getMessage());
        }
    }
}
