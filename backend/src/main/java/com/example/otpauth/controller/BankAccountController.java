package com.example.otpauth.controller;

import com.example.otpauth.dto.BankAccountRequest;
import com.example.otpauth.model.BankAccount;
import com.example.otpauth.service.BankAccountService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bank-accounts")
public class BankAccountController {

    private final BankAccountService bankAccountService;

    public BankAccountController(BankAccountService bankAccountService) {
        this.bankAccountService = bankAccountService;
    }

    @GetMapping
    public ResponseEntity<List<BankAccount>> getAllBankAccounts() {
        return ResponseEntity.ok(bankAccountService.getAllBankAccounts());
    }

    @PostMapping
    public ResponseEntity<?> createBankAccount(@RequestBody BankAccountRequest request) {
        try {
            if (request.getBankName() == null || request.getBankName().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Bank name is required"));
            }
            BankAccount created = bankAccountService.createBankAccount(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBankAccount(@PathVariable Long id, @RequestBody BankAccountRequest request) {
        try {
            return bankAccountService.updateBankAccount(id, request)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBankAccount(@PathVariable Long id) {
        if (bankAccountService.deleteBankAccount(id)) {
            return ResponseEntity.ok(Map.of("message", "Bank account deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Bank account not found"));
    }
}
