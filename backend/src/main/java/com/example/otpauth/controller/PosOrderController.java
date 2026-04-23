package com.example.otpauth.controller;

import com.example.otpauth.dto.PosOrderRequest;
import com.example.otpauth.model.PosOrder;
import com.example.otpauth.service.PosOrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pos-sales")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
    "http://localhost:8080"
})
public class PosOrderController {

    private final PosOrderService posOrderService;

    public PosOrderController(PosOrderService posOrderService) {
        this.posOrderService = posOrderService;
    }

    /** GET /api/pos-sales */
    @GetMapping
    public ResponseEntity<List<PosOrder>> getAllOrders(
            @RequestParam(value = "q", required = false) String q) {
        if (q != null && !q.isBlank()) {
            return ResponseEntity.ok(posOrderService.searchOrders(q));
        }
        return ResponseEntity.ok(posOrderService.getAllOrders());
    }

    /** GET /api/pos-sales/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@PathVariable Long id) {
        return posOrderService.getOrderById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "POS order not found")));
    }

    /** POST /api/pos-sales */
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody PosOrderRequest request) {
        try {
            PosOrder created = posOrderService.createOrder(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /** PUT /api/pos-sales/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable Long id,
                                         @RequestBody PosOrderRequest request) {
        try {
            PosOrder updated = posOrderService.updateOrder(id, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /** DELETE /api/pos-sales/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            boolean deleted = posOrderService.deleteOrder(id);
            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "POS order deleted successfully"));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "POS order not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
