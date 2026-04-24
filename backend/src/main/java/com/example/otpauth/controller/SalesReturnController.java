package com.example.otpauth.controller;

import com.example.otpauth.dto.SalesReturnRequest;
import com.example.otpauth.model.SalesReturn;
import com.example.otpauth.service.SalesReturnService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales-returns")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
    "http://localhost:8080"
})
public class SalesReturnController {

    private final SalesReturnService salesReturnService;

    public SalesReturnController(SalesReturnService salesReturnService) {
        this.salesReturnService = salesReturnService;
    }

    /** GET /api/sales-returns */
    @GetMapping
    public ResponseEntity<List<SalesReturn>> getAllReturns(
            @RequestParam(value = "q", required = false) String q) {
        if (q != null && !q.isBlank()) {
            return ResponseEntity.ok(salesReturnService.searchReturns(q));
        }
        return ResponseEntity.ok(salesReturnService.getAllReturns());
    }

    /** GET /api/sales-returns/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<?> getReturn(@PathVariable Long id) {
        return salesReturnService.getReturnById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Sales return not found")));
    }

    /** POST /api/sales-returns */
    @PostMapping
    public ResponseEntity<?> createReturn(@RequestBody SalesReturnRequest request) {
        try {
            SalesReturn created = salesReturnService.createReturn(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /** PUT /api/sales-returns/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReturn(@PathVariable Long id,
                                          @RequestBody SalesReturnRequest request) {
        try {
            SalesReturn updated = salesReturnService.updateReturn(id, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /** DELETE /api/sales-returns/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReturn(@PathVariable Long id) {
        try {
            boolean deleted = salesReturnService.deleteReturn(id);
            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "Sales return deleted successfully"));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Sales return not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
