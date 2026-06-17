package com.example.otpauth.controller;

import com.example.otpauth.config.JwtUtil;
import com.example.otpauth.dto.WorkOrderDTO;
import com.example.otpauth.model.User;
import com.example.otpauth.model.WorkOrder;
import com.example.otpauth.repository.UserRepository;
import com.example.otpauth.service.WorkOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/manufacturing/work-orders")
public class WorkOrderController {

    @Autowired
    private WorkOrderService workOrderService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    private Long getUserIdFromToken(String token) {
        String jwt = token.substring(7);
        String email = jwtUtil.extractUsername(jwt);
        Optional<User> userOpt = userRepository.findByEmail(email);
        return userOpt.map(User::getId).orElse(null);
    }

    @GetMapping
    public ResponseEntity<?> getAllWorkOrders(@RequestHeader("Authorization") String token) {
        try {
            Long userId = getUserIdFromToken(token);
            if (userId == null) return ResponseEntity.badRequest().body("User not found");
            
            List<WorkOrder> orders = workOrderService.getWorkOrdersByUserId(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createWorkOrder(@RequestHeader("Authorization") String token, @RequestBody WorkOrderDTO dto) {
        try {
            Long userId = getUserIdFromToken(token);
            if (userId == null) return ResponseEntity.badRequest().body("User not found");
            
            WorkOrder order = workOrderService.createWorkOrder(userId, dto);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@RequestHeader("Authorization") String token, @PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            Long userId = getUserIdFromToken(token);
            if (userId == null) return ResponseEntity.badRequest().body("User not found");
            
            String status = payload.get("status");
            if (status == null) throw new RuntimeException("Status is required");

            WorkOrder order = workOrderService.updateStatus(id, userId, status);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorkOrder(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        try {
            Long userId = getUserIdFromToken(token);
            if (userId == null) return ResponseEntity.badRequest().body("User not found");
            
            workOrderService.deleteWorkOrder(id, userId);
            return ResponseEntity.ok("Deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
