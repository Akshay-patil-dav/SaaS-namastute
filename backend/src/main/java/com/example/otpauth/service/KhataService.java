package com.example.otpauth.service;

import com.example.otpauth.dto.KhataPartyRequest;
import com.example.otpauth.dto.KhataTransactionRequest;
import com.example.otpauth.model.KhataParty;
import com.example.otpauth.model.KhataTransaction;
import com.example.otpauth.repository.KhataPartyRepository;
import com.example.otpauth.repository.KhataTransactionRepository;
import com.example.otpauth.util.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
@Transactional
public class KhataService {

    private final KhataPartyRepository partyRepository;
    private final KhataTransactionRepository transactionRepository;
    private final DataUsageService dataUsageService;

    public KhataService(KhataPartyRepository partyRepository,
                        KhataTransactionRepository transactionRepository,
                        DataUsageService dataUsageService) {
        this.partyRepository = partyRepository;
        this.transactionRepository = transactionRepository;
        this.dataUsageService = dataUsageService;
    }

    private Long getUserId() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            userId = 1L; // Fallback default tenant
        }
        return userId;
    }

    // ── Parties ──────────────────────────────────────────────────────────────

    public List<KhataParty> getParties(String partyType, String search) {
        Long userId = getUserId();
        if (search != null && !search.trim().isEmpty()) {
            return partyRepository.searchParties(userId, partyType, search.trim());
        }
        if (partyType != null && !partyType.trim().isEmpty() && !partyType.equalsIgnoreCase("ALL")) {
            return partyRepository.findByUserIdAndPartyTypeOrderByUpdatedAtDesc(userId, partyType.toUpperCase());
        }
        return partyRepository.findByUserIdOrderByUpdatedAtDesc(userId);
    }

    public Optional<KhataParty> getPartyById(Long id) {
        return partyRepository.findByIdAndUserId(id, getUserId());
    }

    public KhataParty createParty(KhataPartyRequest req) {
        Long userId = getUserId();
        dataUsageService.checkDataLimit(userId);
        KhataParty party = new KhataParty();
        party.setUserId(userId);
        party.setName(req.getName());
        party.setPhone(req.getPhone());
        party.setEmail(req.getEmail());
        party.setAddress(req.getAddress());
        party.setPartyType(req.getPartyType() != null ? req.getPartyType().toUpperCase() : "CUSTOMER");

        BigDecimal opening = req.getOpeningBalance() != null ? req.getOpeningBalance() : BigDecimal.ZERO;
        party.setOpeningBalance(opening);

        String opType = req.getOpeningBalanceType() != null ? req.getOpeningBalanceType().toUpperCase() : "YOU_WILL_GET";
        party.setOpeningBalanceType(opType);

        // Initial net balance:
        // Positive = You will get (Receivable)
        // Negative = You will give (Payable)
        if ("YOU_WILL_GIVE".equalsIgnoreCase(opType)) {
            party.setNetBalance(opening.negate());
        } else {
            party.setNetBalance(opening);
        }

        return partyRepository.save(party);
    }

    public Optional<KhataParty> updateParty(Long id, KhataPartyRequest req) {
        return partyRepository.findByIdAndUserId(id, getUserId()).map(party -> {
            party.setName(req.getName());
            party.setPhone(req.getPhone());
            party.setEmail(req.getEmail());
            party.setAddress(req.getAddress());
            if (req.getPartyType() != null) {
                party.setPartyType(req.getPartyType().toUpperCase());
            }
            return partyRepository.save(party);
        });
    }

    public boolean deleteParty(Long id) {
        Long userId = getUserId();
        return partyRepository.findByIdAndUserId(id, userId).map(party -> {
            transactionRepository.deleteByPartyIdAndUserId(id, userId);
            partyRepository.delete(party);
            return true;
        }).orElse(false);
    }

    // ── Transactions ─────────────────────────────────────────────────────────

    public KhataTransaction addTransaction(KhataTransactionRequest req) {
        Long userId = getUserId();
        dataUsageService.checkDataLimit(userId);
        KhataParty party = partyRepository.findByIdAndUserId(req.getPartyId(), userId)
                .orElseThrow(() -> new IllegalArgumentException("Khata party not found with ID: " + req.getPartyId()));

        BigDecimal amount = req.getAmount() != null ? req.getAmount() : BigDecimal.ZERO;
        String type = req.getTransactionType() != null ? req.getTransactionType().toUpperCase() : "GAVE";

        KhataTransaction tx = new KhataTransaction();
        tx.setUserId(userId);
        tx.setPartyId(party.getId());
        tx.setPartyName(party.getName());
        tx.setPartyType(party.getPartyType());
        tx.setTransactionType(type);
        tx.setAmount(amount);
        tx.setPaymentMode(req.getPaymentMode() != null ? req.getPaymentMode().toUpperCase() : "CASH");
        tx.setReferenceNumber(req.getReferenceNumber());
        tx.setNotes(req.getNotes());
        tx.setTransactionDate(req.getTransactionDate() != null ? req.getTransactionDate() : LocalDate.now());

        // Update Party balance:
        // GAVE: You gave goods/money (increases what they owe you / reduces what you owe them) -> +amount
        // GOT: You received money/goods (reduces what they owe you / increases what you owe them) -> -amount
        BigDecimal current = party.getNetBalance() != null ? party.getNetBalance() : BigDecimal.ZERO;
        BigDecimal newBalance = "GAVE".equalsIgnoreCase(type) ? current.add(amount) : current.subtract(amount);

        party.setNetBalance(newBalance);
        partyRepository.save(party);

        tx.setRunningBalance(newBalance);
        return transactionRepository.save(tx);
    }

    public List<KhataTransaction> getPartyTransactions(Long partyId) {
        return transactionRepository.findByUserIdAndPartyIdOrderByTransactionDateDescCreatedAtDesc(getUserId(), partyId);
    }

    public boolean deleteTransaction(Long txId) {
        Long userId = getUserId();
        return transactionRepository.findByIdAndUserId(txId, userId).map(tx -> {
            KhataParty party = partyRepository.findByIdAndUserId(tx.getPartyId(), userId).orElse(null);
            if (party != null) {
                // Revert balance change
                BigDecimal current = party.getNetBalance() != null ? party.getNetBalance() : BigDecimal.ZERO;
                BigDecimal reversed = "GAVE".equalsIgnoreCase(tx.getTransactionType())
                        ? current.subtract(tx.getAmount())
                        : current.add(tx.getAmount());
                party.setNetBalance(reversed);
                partyRepository.save(party);
            }
            transactionRepository.delete(tx);
            return true;
        }).orElse(false);
    }

    // ── Daybook ──────────────────────────────────────────────────────────────

    public List<KhataTransaction> getDaybook(LocalDate date) {
        Long userId = getUserId();
        if (date != null) {
            return transactionRepository.findByUserIdAndTransactionDateOrderByCreatedAtDesc(userId, date);
        }
        return transactionRepository.findByUserIdOrderByTransactionDateDescCreatedAtDesc(userId);
    }

    // ── Summary Overview ─────────────────────────────────────────────────────

    public Map<String, Object> getSummary() {
        Long userId = getUserId();
        List<KhataParty> parties = partyRepository.findByUserIdOrderByUpdatedAtDesc(userId);

        BigDecimal totalYouWillGet = BigDecimal.ZERO;
        BigDecimal totalYouWillGive = BigDecimal.ZERO;
        long customerCount = 0;
        long supplierCount = 0;

        for (KhataParty p : parties) {
            if ("CUSTOMER".equalsIgnoreCase(p.getPartyType())) customerCount++;
            if ("SUPPLIER".equalsIgnoreCase(p.getPartyType())) supplierCount++;

            BigDecimal bal = p.getNetBalance() != null ? p.getNetBalance() : BigDecimal.ZERO;
            if (bal.compareTo(BigDecimal.ZERO) > 0) {
                totalYouWillGet = totalYouWillGet.add(bal);
            } else if (bal.compareTo(BigDecimal.ZERO) < 0) {
                totalYouWillGive = totalYouWillGive.add(bal.abs());
            }
        }

        // Today's transaction flow
        LocalDate today = LocalDate.now();
        List<KhataTransaction> todayTx = transactionRepository.findByUserIdAndTransactionDateOrderByCreatedAtDesc(userId, today);
        BigDecimal todayGave = BigDecimal.ZERO;
        BigDecimal todayGot = BigDecimal.ZERO;

        for (KhataTransaction t : todayTx) {
            if ("GAVE".equalsIgnoreCase(t.getTransactionType())) {
                todayGave = todayGave.add(t.getAmount());
            } else {
                todayGot = todayGot.add(t.getAmount());
            }
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalYouWillGet", totalYouWillGet);
        summary.put("totalYouWillGive", totalYouWillGive);
        summary.put("netBalance", totalYouWillGet.subtract(totalYouWillGive));
        summary.put("totalCustomers", customerCount);
        summary.put("totalSuppliers", supplierCount);
        summary.put("todayGiven", todayGave);
        summary.put("todayGot", todayGot);
        summary.put("todayCount", todayTx.size());

        return summary;
    }
}
