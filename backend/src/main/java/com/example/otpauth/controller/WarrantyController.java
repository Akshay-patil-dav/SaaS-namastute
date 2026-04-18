package com.example.otpauth.controller;

import com.example.otpauth.dto.WarrantyRequest;
import com.example.otpauth.model.Warranty;
import com.example.otpauth.service.WarrantyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/warranties")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000", "http://localhost:8080"})
public class WarrantyController {

    private static final Logger logger = LoggerFactory.getLogger(WarrantyController.class);
    private final WarrantyService warrantyService;

    public WarrantyController(WarrantyService warrantyService) {
        this.warrantyService = warrantyService;
    }

    @GetMapping
    public ResponseEntity<List<Warranty>> getAllWarranties() {
        return ResponseEntity.ok(warrantyService.getAllWarranties());
    }

    @PostMapping
    public ResponseEntity<?> createWarranty(@RequestBody WarrantyRequest request) {
        logger.info("Received request to create warranty: {}", request.getName());
        try {
            if (request.getName() == null || request.getName().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Warranty name is required"));
            }
            Warranty created = warrantyService.createWarranty(request);
            logger.info("Successfully created warranty with ID: {}", created.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            logger.error("Error creating warranty: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateWarranty(@PathVariable Long id, @RequestBody WarrantyRequest request) {
        logger.info("Received request to update warranty ID: {} - {}", id, request.getName());
        try {
            if (request.getName() == null || request.getName().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Warranty name is required"));
            }
            return warrantyService.updateWarranty(id, request)
                    .map(updated -> {
                        logger.info("Successfully updated warranty ID: {}", id);
                        return ResponseEntity.ok(updated);
                    })
                    .orElseGet(() -> {
                        logger.warn("Warranty ID: {} not found for update", id);
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                    });
        } catch (Exception e) {
            logger.error("Error updating warranty ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWarranty(@PathVariable Long id) {
        if (warrantyService.deleteWarranty(id)) {
            return ResponseEntity.ok(Map.of("message", "Warranty deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Warranty not found"));
    }

    @PostMapping("/delete-bulk")
    public ResponseEntity<?> bulkDeleteWarranties(@RequestBody Map<String, List<Long>> payload) {
        try {
            List<Long> ids = payload.get("ids");
            if (ids == null || ids.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No IDs provided"));
            }
            warrantyService.bulkDeleteWarranties(ids);
            return ResponseEntity.ok(Map.of("message", "Warranties deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
