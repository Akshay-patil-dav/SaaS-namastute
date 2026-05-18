package com.example.otpauth.controller;

import com.example.otpauth.dto.TransferRequest;
import com.example.otpauth.model.StockTransfer;
import com.example.otpauth.service.StockTransferService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transfers")
// CORS is handled globally in SecurityConfig.java — reads FRONTEND_URL from backend/.env
public class StockTransferController {

    private final StockTransferService stockTransferService;

    public StockTransferController(StockTransferService stockTransferService) {
        this.stockTransferService = stockTransferService;
    }

    @GetMapping
    public ResponseEntity<List<StockTransfer>> getAllTransfers() {
        return ResponseEntity.ok(stockTransferService.getAllTransfers());
    }

    @PostMapping
    public ResponseEntity<?> createTransfer(@RequestBody TransferRequest request) {
        try {
            StockTransfer created = stockTransferService.createTransfer(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/import")
    public ResponseEntity<?> importTransfer(@RequestParam("file") org.springframework.web.multipart.MultipartFile file,
                                            @RequestParam("warehouseFrom") String warehouseFrom,
                                            @RequestParam("warehouseTo") String warehouseTo,
                                            @RequestParam("status") String status,
                                            @RequestParam("shipping") String shipping,
                                            @RequestParam(value = "description", required = false) String description) {
        try {
            TransferRequest request = new TransferRequest();
            request.setWarehouseFrom(warehouseFrom);
            request.setWarehouseTo(warehouseTo);
            request.setStatus(status);
            request.setShipping(shipping);
            request.setDescription(description);
            request.setReferenceNo("#IMP" + (long)(Math.random() * 1000000));
            request.setNotes("Imported via CSV");

            StockTransfer created = stockTransferService.importTransferFromCsv(file, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTransfer(@PathVariable Long id) {
        return stockTransferService.getTransferById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Transfer record not found")));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransfer(@PathVariable Long id, @RequestBody TransferRequest request) {
        try {
            StockTransfer updated = stockTransferService.updateTransfer(id, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransfer(@PathVariable Long id) {
        try {
            boolean deleted = stockTransferService.deleteTransfer(id);
            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "Transfer deleted successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Transfer not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/delete-bulk")
    public ResponseEntity<?> bulkDeleteTransfers(@RequestBody Map<String, List<Long>> payload) {
        try {
            List<Long> ids = payload.get("ids");
            if (ids == null || ids.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No IDs provided"));
            }
            stockTransferService.bulkDeleteTransfers(ids);
            return ResponseEntity.ok(Map.of("message", "Transfers deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
