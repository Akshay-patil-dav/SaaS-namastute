package com.example.otpauth.controller;

import com.example.otpauth.dto.PurchaseReturnRequest;
import com.example.otpauth.model.PurchaseReturn;
import com.example.otpauth.service.PurchaseReturnService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchase-returns")
public class PurchaseReturnController {

    private final PurchaseReturnService purchaseReturnService;

    public PurchaseReturnController(PurchaseReturnService purchaseReturnService) {
        this.purchaseReturnService = purchaseReturnService;
    }

    @GetMapping
    public ResponseEntity<List<PurchaseReturn>> getAllPurchaseReturns(@RequestParam(value = "q", required = false) String q) {
        if (q != null && !q.isBlank()) {
            return ResponseEntity.ok(purchaseReturnService.searchPurchaseReturns(q));
        }
        return ResponseEntity.ok(purchaseReturnService.getAllPurchaseReturns());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPurchaseReturn(@PathVariable Long id) {
        return purchaseReturnService.getPurchaseReturnById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "PurchaseReturn not found")));
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getPurchaseReturnSummary() {
        return ResponseEntity.ok(Map.of(
            "totalAmount", purchaseReturnService.getPurchaseReturnSummary(),
            "totalCount", purchaseReturnService.getPurchaseReturnCount()
        ));
    }

    @PostMapping
    public ResponseEntity<?> createPurchaseReturn(@RequestBody PurchaseReturnRequest request) {
        try {
            PurchaseReturn created = purchaseReturnService.createPurchaseReturn(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePurchaseReturn(@PathVariable Long id, @RequestBody PurchaseReturnRequest request) {
        try {
            PurchaseReturn updated = purchaseReturnService.updatePurchaseReturn(id, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePurchaseReturn(@PathVariable Long id) {
        try {
            boolean deleted = purchaseReturnService.deletePurchaseReturn(id);
            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "PurchaseReturn deleted successfully"));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "PurchaseReturn not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/delete-bulk")
    public ResponseEntity<?> bulkDeletePurchaseReturns(@RequestBody Map<String, List<Long>> payload) {
        try {
            List<Long> ids = payload.get("ids");
            if (ids == null || ids.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No IDs provided"));
            }
            purchaseReturnService.bulkDeletePurchaseReturns(ids);
            return ResponseEntity.ok(Map.of("message", "Purchase returns deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
