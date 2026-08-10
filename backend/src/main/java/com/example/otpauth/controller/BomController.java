package com.example.otpauth.controller;

import com.example.otpauth.config.JwtUtil;
import com.example.otpauth.dto.BillOfMaterialDTO;
import com.example.otpauth.model.BillOfMaterial;
import com.example.otpauth.model.User;
import com.example.otpauth.repository.UserRepository;
import com.example.otpauth.service.BomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/manufacturing/bom")
public class BomController {

    @Autowired
    private BomService bomService;

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
    public ResponseEntity<?> getAllBoms(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            Long userId = getUserIdFromToken(token);
            if (userId == null) return ResponseEntity.badRequest().body("User not found");
            
            List<BillOfMaterial> boms = bomService.getBomsByUserId(userId);
            return ResponseEntity.ok(boms);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createBom(@RequestHeader(value = "Authorization", required = false) String token, @RequestBody BillOfMaterialDTO dto) {
        try {
            Long userId = getUserIdFromToken(token);
            if (userId == null) return ResponseEntity.badRequest().body("User not found");
            
            BillOfMaterial bom = bomService.createBom(userId, dto);
            return ResponseEntity.ok(bom);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBom(@RequestHeader(value = "Authorization", required = false) String token, @PathVariable Long id) {
        try {
            Long userId = getUserIdFromToken(token);
            if (userId == null) return ResponseEntity.badRequest().body("User not found");
            
            bomService.deleteBom(id, userId);
            return ResponseEntity.ok("Deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBom(@RequestHeader(value = "Authorization", required = false) String token, @PathVariable Long id, @RequestBody BillOfMaterialDTO dto) {
        try {
            Long userId = getUserIdFromToken(token);
            if (userId == null) return ResponseEntity.badRequest().body("User not found");
            
            BillOfMaterial bom = bomService.updateBom(id, userId, dto);
            return ResponseEntity.ok(bom);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
