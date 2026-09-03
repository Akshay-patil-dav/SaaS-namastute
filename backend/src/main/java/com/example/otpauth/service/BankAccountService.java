package com.example.otpauth.service;

import com.example.otpauth.dto.BankAccountRequest;
import com.example.otpauth.model.BankAccount;
import com.example.otpauth.repository.BankAccountRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BankAccountService {

    private final BankAccountRepository bankAccountRepository;

    public BankAccountService(BankAccountRepository bankAccountRepository) {
        this.bankAccountRepository = bankAccountRepository;
    }

    private Long getCurrentUserId() {
        try {
            org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof com.example.otpauth.config.UserDetailsImpl) {
                com.example.otpauth.config.UserDetailsImpl userDetails = (com.example.otpauth.config.UserDetailsImpl) auth.getPrincipal();
                return userDetails.getUser().getId();
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    public List<BankAccount> getAllBankAccounts() {
        Long userId = getCurrentUserId();
        if (userId == null) return List.of();
        return bankAccountRepository.findByUserId(userId);
    }

    public BankAccount createBankAccount(BankAccountRequest request) {
        Long userId = getCurrentUserId();
        if (userId == null) throw new RuntimeException("Unauthorized");

        BankAccount bankAccount = new BankAccount();
        bankAccount.setUserId(userId);
        bankAccount.setBankName(request.getBankName());
        bankAccount.setAccountName(request.getAccountName());
        bankAccount.setAccountNumber(request.getAccountNumber());
        bankAccount.setBranchIfsc(request.getBranchIfsc());

        return bankAccountRepository.save(bankAccount);
    }

    public Optional<BankAccount> updateBankAccount(Long id, BankAccountRequest request) {
        Long userId = getCurrentUserId();
        if (userId == null) return Optional.empty();

        return bankAccountRepository.findById(id).map(bankAccount -> {
            if (!bankAccount.getUserId().equals(userId)) {
                throw new RuntimeException("Unauthorized");
            }
            if (request.getBankName() != null) bankAccount.setBankName(request.getBankName());
            if (request.getAccountName() != null) bankAccount.setAccountName(request.getAccountName());
            if (request.getAccountNumber() != null) bankAccount.setAccountNumber(request.getAccountNumber());
            if (request.getBranchIfsc() != null) bankAccount.setBranchIfsc(request.getBranchIfsc());
            
            return bankAccountRepository.save(bankAccount);
        });
    }

    public boolean deleteBankAccount(Long id) {
        Long userId = getCurrentUserId();
        if (userId == null) return false;

        return bankAccountRepository.findById(id).map(bankAccount -> {
            if (!bankAccount.getUserId().equals(userId)) {
                return false;
            }
            bankAccountRepository.delete(bankAccount);
            return true;
        }).orElse(false);
    }
}
