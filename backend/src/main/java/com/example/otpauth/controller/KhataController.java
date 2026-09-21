package com.example.otpauth.controller;

import com.example.otpauth.dto.KhataPartyRequest;
import com.example.otpauth.dto.KhataTransactionRequest;
import com.example.otpauth.model.KhataParty;
import com.example.otpauth.model.KhataTransaction;
import com.example.otpauth.service.KhataService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/khata")
public class KhataController {

    private final KhataService khataService;

    public KhataController(KhataService khataService) {
        this.khataService = khataService;
    }

    /** GET /api/khata/summary — get dashboard statistics */
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(khataService.getSummary());
    }

    /** GET /api/khata/parties — list customer/supplier parties */
    @GetMapping("/parties")
    public ResponseEntity<List<KhataParty>> getParties(
            @RequestParam(value = "type", required = false) String partyType,
            @RequestParam(value = "search", required = false) String search) {
        return ResponseEntity.ok(khataService.getParties(partyType, search));
    }

    /** GET /api/khata/parties/{id} — get party by ID */
    @GetMapping("/parties/{id}")
    public ResponseEntity<?> getParty(@PathVariable Long id) {
        return khataService.getPartyById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Party not found")));
    }

    /** POST /api/khata/parties — create new customer or supplier */
    @PostMapping("/parties")
    public ResponseEntity<?> createParty(@RequestBody KhataPartyRequest req) {
        if (req.getName() == null || req.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Party name is required"));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(khataService.createParty(req));
    }

    /** PUT /api/khata/parties/{id} — update party */
    @PutMapping("/parties/{id}")
    public ResponseEntity<?> updateParty(@PathVariable Long id, @RequestBody KhataPartyRequest req) {
        return khataService.updateParty(id, req)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Party not found")));
    }

    /** DELETE /api/khata/parties/{id} — delete party & all its transactions */
    @DeleteMapping("/parties/{id}")
    public ResponseEntity<?> deleteParty(@PathVariable Long id) {
        boolean deleted = khataService.deleteParty(id);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Party not found"));
        }
        return ResponseEntity.ok(Map.of("message", "Party and associated transactions deleted successfully"));
    }

    /** GET /api/khata/parties/{id}/transactions — get party ledger */
    @GetMapping("/parties/{id}/transactions")
    public ResponseEntity<List<KhataTransaction>> getPartyTransactions(@PathVariable Long id) {
        return ResponseEntity.ok(khataService.getPartyTransactions(id));
    }

    /** POST /api/khata/transactions — record a debit or credit entry */
    @PostMapping("/transactions")
    public ResponseEntity<?> addTransaction(@RequestBody KhataTransactionRequest req) {
        if (req.getPartyId() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "partyId is required"));
        }
        if (req.getAmount() == null || req.getAmount().signum() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Valid positive amount is required"));
        }
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(khataService.addTransaction(req));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** DELETE /api/khata/transactions/{id} — delete a transaction */
    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        boolean deleted = khataService.deleteTransaction(id);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Transaction not found"));
        }
        return ResponseEntity.ok(Map.of("message", "Transaction deleted successfully"));
    }

    /** GET /api/khata/daybook — get daily chronological ledger */
    @GetMapping("/daybook")
    public ResponseEntity<List<KhataTransaction>> getDaybook(
            @RequestParam(value = "date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(khataService.getDaybook(date));
    }
}
