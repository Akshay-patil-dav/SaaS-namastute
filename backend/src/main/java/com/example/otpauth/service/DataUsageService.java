package com.example.otpauth.service;

import com.example.otpauth.dto.DataUsageDTO;
import com.example.otpauth.exception.DataLimitExceededException;
import com.example.otpauth.model.RoleName;
import com.example.otpauth.model.SubscriptionPlan;
import com.example.otpauth.model.User;
import com.example.otpauth.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class DataUsageService {

    public static final long FREE_PLAN_LIMIT = 50L;
    public static final long STARTER_PLAN_LIMIT = 1000L;

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final KhataPartyRepository khataPartyRepository;
    private final KhataTransactionRepository khataTransactionRepository;
    private final PosOrderRepository posOrderRepository;
    private final SaleOrderRepository saleOrderRepository;
    private final PurchaseRepository purchaseRepository;
    private final CustomerRepository customerRepository;

    public DataUsageService(UserRepository userRepository,
                            ProductRepository productRepository,
                            KhataPartyRepository khataPartyRepository,
                            KhataTransactionRepository khataTransactionRepository,
                            PosOrderRepository posOrderRepository,
                            SaleOrderRepository saleOrderRepository,
                            PurchaseRepository purchaseRepository,
                            CustomerRepository customerRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.khataPartyRepository = khataPartyRepository;
        this.khataTransactionRepository = khataTransactionRepository;
        this.posOrderRepository = posOrderRepository;
        this.saleOrderRepository = saleOrderRepository;
        this.purchaseRepository = purchaseRepository;
        this.customerRepository = customerRepository;
    }

    public boolean isSuperAdmin(User user) {
        if (user == null || user.getRoles() == null) return false;
        return user.getRoles().stream()
                .anyMatch(r -> r.getName() == RoleName.SUPER_ADMIN);
    }

    public boolean isFreeUser(User user) {
        if (user == null) return true;
        if (isSuperAdmin(user)) return false;

        SubscriptionPlan plan = user.getPlan();
        if (plan == null || plan == SubscriptionPlan.NONE) {
            return true;
        }

        if (user.getSubscriptionEndDate() != null && user.getSubscriptionEndDate().isBefore(LocalDateTime.now())) {
            return true;
        }

        return false;
    }

    public Map<String, Long> getDataBreakdown(Long userId) {
        Map<String, Long> breakdown = new LinkedHashMap<>();
        if (userId == null) return breakdown;

        breakdown.put("products", productRepository.countByUserId(userId));
        breakdown.put("khataParties", khataPartyRepository.countByUserId(userId));
        breakdown.put("khataTransactions", khataTransactionRepository.countByUserId(userId));
        breakdown.put("posOrders", posOrderRepository.countByUserId(userId));
        breakdown.put("saleOrders", saleOrderRepository.countByUserId(userId));
        breakdown.put("purchases", purchaseRepository.countByUserId(userId));
        breakdown.put("customers", customerRepository.countByUserId(userId));

        return breakdown;
    }

    public long getTotalDataCount(Long userId) {
        if (userId == null) return 0L;
        Map<String, Long> breakdown = getDataBreakdown(userId);
        return breakdown.values().stream().mapToLong(Long::longValue).sum();
    }

    public void checkDataLimit(Long userId) {
        if (userId == null) return;
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        if (isFreeUser(user)) {
            long totalUsed = getTotalDataCount(userId);
            if (totalUsed >= FREE_PLAN_LIMIT) {
                throw new DataLimitExceededException(
                    "Free plan limit reached! You have stored " + totalUsed + " of " + FREE_PLAN_LIMIT + " data records. Please upgrade to a paid plan to add more data.",
                    FREE_PLAN_LIMIT,
                    totalUsed
                );
            }
        }
    }

    public DataUsageDTO getUsageSummary(Long userId) {
        if (userId == null) {
            return new DataUsageDTO(true, "NONE", 0, FREE_PLAN_LIMIT, FREE_PLAN_LIMIT, 0.0, null, Map.of());
        }

        User user = userRepository.findById(userId).orElse(null);
        boolean free = isFreeUser(user);
        Map<String, Long> breakdown = getDataBreakdown(userId);
        long totalUsed = breakdown.values().stream().mapToLong(Long::longValue).sum();

        String planName = (user != null && user.getPlan() != null) ? user.getPlan().name() : "NONE";
        String endDate = (user != null && user.getSubscriptionEndDate() != null) ? user.getSubscriptionEndDate().toString() : null;

        long limit;
        long remaining;
        double percentage;

        if (free) {
            limit = FREE_PLAN_LIMIT;
            remaining = Math.max(0, limit - totalUsed);
            percentage = Math.min(100.0, (totalUsed / (double) limit) * 100.0);
        } else if (user != null && user.getPlan() == SubscriptionPlan.STARTER) {
            limit = STARTER_PLAN_LIMIT;
            remaining = Math.max(0, limit - totalUsed);
            percentage = Math.min(100.0, (totalUsed / (double) limit) * 100.0);
        } else {
            // Unlimited plans (GROWTH, PREMIUM, SUPER_ADMIN)
            limit = -1;
            remaining = -1;
            percentage = 0.0;
        }

        return new DataUsageDTO(free, planName, totalUsed, limit, remaining, percentage, endDate, breakdown);
    }
}
