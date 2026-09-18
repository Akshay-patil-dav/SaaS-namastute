package com.example.otpauth.controller;

import com.example.otpauth.dto.PaymentOrderRequest;
import com.example.otpauth.dto.PaymentVerifyRequest;
import com.example.otpauth.model.SubscriptionPlan;
import com.example.otpauth.model.User;
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

    public PaymentController(UserRepository userRepository) {
        this.userRepository = userRepository;
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
            orderRequest.put("amount", request.getAmount() * 100);
            orderRequest.put("currency", request.getCurrency() != null ? request.getCurrency() : "INR");
            orderRequest.put("receipt", "receipt_" + authentication.getName().hashCode());
            orderRequest.put("payment_capture", 1);

            Order order = razorpayClient.orders.create(orderRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.get("id"));
            response.put("amount", request.getAmount());
            response.put("currency", request.getCurrency() != null ? request.getCurrency() : "INR");
            response.put("razorpayKeyId", razorpayKeyId);

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

            user.setPlan(plan);
            user.setSubscriptionEndDate(LocalDateTime.now().plusDays(30));
            userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Payment verified and plan activated successfully");
            response.put("plan", plan.name());
            response.put("subscriptionEndDate", user.getSubscriptionEndDate().toString());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Payment verification error: " + e.getMessage());
        }
    }

    private String hmacSHA256(String data, String key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return HexFormat.of().formatHex(hash);
    }
}
