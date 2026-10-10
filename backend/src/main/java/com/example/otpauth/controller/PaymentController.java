package com.example.otpauth.controller;

import com.example.otpauth.dto.PaymentOrderRequest;
import com.example.otpauth.dto.PaymentVerifyRequest;
import com.example.otpauth.model.SubscriptionPlan;
import com.example.otpauth.model.SubscriptionTransaction;
import com.example.otpauth.model.User;
import com.example.otpauth.repository.SubscriptionTransactionRepository;
import com.example.otpauth.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;

    private final UserRepository userRepository;
    private final SubscriptionTransactionRepository transactionRepository;

    public PaymentController(UserRepository userRepository, SubscriptionTransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    /**
     * Creates a Razorpay order for the selected plan.
     * Returns orderId, amount, currency, and the public key so the frontend
     * can open the Razorpay checkout modal.
     */
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentOrderRequest request,
                                         Authentication authentication) {
        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            // Razorpay amount is in paise (1 INR = 100 paise)
            int amountInPaise = (int) Math.round(request.getAmount() * 100);
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", request.getCurrency() != null ? request.getCurrency() : "INR");
            orderRequest.put("receipt", "receipt_" + authentication.getName().hashCode());
            orderRequest.put("payment_capture", 1);

            Order order = razorpayClient.orders.create(orderRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.get("id"));
            response.put("amount", request.getAmount());
            response.put("currency", request.getCurrency() != null ? request.getCurrency() : "INR");
            response.put("razorpayKeyId", razorpayKeyId);
            response.put("billingCycle", request.getBillingCycle() != null ? request.getBillingCycle() : "monthly");

            return ResponseEntity.ok(response);

        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body("Failed to create payment order: " + e.getMessage());
        }
    }

    /**
     * Verifies the payment signature returned by Razorpay.
     * If valid, activates the user's subscription plan.
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerifyRequest request,
                                           Authentication authentication) {
        try {
            // Verify HMAC SHA256 signature
            String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
            String expectedSignature = hmacSHA256(payload, razorpayKeySecret);

            if (!expectedSignature.equals(request.getRazorpaySignature())) {
                return ResponseEntity.badRequest().body("Payment verification failed: invalid signature");
            }

            // Signature verified — activate the plan
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            SubscriptionPlan plan;
            try {
                plan = SubscriptionPlan.valueOf(request.getPlan().toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid plan type");
            }

            int days = "yearly".equalsIgnoreCase(request.getBillingCycle()) ? 365 : 30;

            LocalDateTime currentEndDate = user.getSubscriptionEndDate();
            LocalDateTime now = LocalDateTime.now();

            if (currentEndDate != null && currentEndDate.isAfter(now)) {
                // Active subscription exists — stack or queue
                if (user.getPlan() == plan) {
                    // Same plan: extend current end date
                    user.setSubscriptionEndDate(currentEndDate.plusDays(days));
                } else {
                    // Different plan: queue it. If something already queued, add days to its end date.
                    LocalDateTime queueBase = (user.getNextSubscriptionEndDate() != null)
                            ? user.getNextSubscriptionEndDate()
                            : currentEndDate; // queued plan starts when current one ends
                    user.setNextPlan(plan);
                    user.setNextSubscriptionEndDate(queueBase.plusDays(days));
                }
            } else {
                // No active subscription — start immediately
                user.setPlan(plan);
                user.setSubscriptionEndDate(now.plusDays(days));
                user.setNextPlan(null);
                user.setNextSubscriptionEndDate(null);
            }
            
            userRepository.save(user);

            // Record the transaction
            SubscriptionTransaction tx = new SubscriptionTransaction();
            tx.setUserEmail(email);
            tx.setPlan(plan.name());
            tx.setBillingCycle(request.getBillingCycle());
            tx.setRazorpayOrderId(request.getRazorpayOrderId());
            tx.setRazorpayPaymentId(request.getRazorpayPaymentId());
            tx.setAmount(request.getAmount() != null ? request.getAmount() : 0.0);
            tx.setStatus("SUCCESS");
            transactionRepository.save(tx);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Payment verified and plan activated successfully");
            response.put("plan", plan.name());
            response.put("subscriptionEndDate", user.getSubscriptionEndDate().toString());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Payment verification error: " + e.getMessage());
        }
    }

    @PostMapping("/record-status")
    public ResponseEntity<?> recordStatus(@RequestBody Map<String, Object> payload, Authentication authentication) {
        try {
            String email = authentication.getName();
            SubscriptionTransaction tx = new SubscriptionTransaction();
            tx.setUserEmail(email);
            tx.setPlan(String.valueOf(payload.getOrDefault("plan", "STARTER")));
            tx.setBillingCycle(String.valueOf(payload.getOrDefault("billingCycle", "monthly")));
            tx.setRazorpayOrderId((String) payload.get("orderId"));
            tx.setRazorpayPaymentId((String) payload.get("paymentId"));
            Object amt = payload.get("amount");
            tx.setAmount(amt != null ? Double.parseDouble(amt.toString()) : 0.0);
            tx.setStatus(String.valueOf(payload.getOrDefault("status", "CANCELLED")));
            transactionRepository.save(tx);
            return ResponseEntity.ok(Map.of("message", "Status recorded successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to record status: " + e.getMessage());
        }
    }

    private String hmacSHA256(String data, String key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return HexFormat.of().formatHex(hash);
    }

    @GetMapping("/history")
    public ResponseEntity<?> getPaymentHistory(Authentication authentication) {
        String email = authentication.getName();
        java.util.List<SubscriptionTransaction> history = transactionRepository.findByUserEmailOrderByTransactionDateDesc(email);
        return ResponseEntity.ok(history);
    }
}
