package com.example.otpauth.service;

import com.example.otpauth.dto.VerificationRequest;
import com.example.otpauth.model.User;
import com.example.otpauth.repository.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Random;

@Service
public class VerificationService {

    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    
    // In-memory store for OTPs: key = email_type, value = OTP
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();

    public VerificationService(UserRepository userRepository, JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.mailSender = mailSender;
    }

    public String generateAndSendOtp(String email, String type) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        String key = email + "_" + type;
        otpStorage.put(key, otp);
        
        if ("EMAIL".equalsIgnoreCase(type)) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(email);
                message.setSubject("Your Verification Code - Namustutam");
                message.setText("Your OTP code is: " + otp + "\n\nPlease enter this code to verify your account.");
                mailSender.send(message);
                System.out.println("Sent Email OTP to " + email);
            } catch (Exception e) {
                System.err.println("Failed to send Email OTP: " + e.getMessage());
                throw new RuntimeException("Failed to send Email OTP. Check server mail configuration: " + e.getMessage());
            }
        } else {
            // SMS logic goes here
            System.out.println("Generated OTP for " + email + " (" + type + "): " + otp);
        }
        
        return otp;
    }

    public boolean verifyOtp(VerificationRequest request) {
        String key = request.getEmail() + "_" + request.getType();
        String storedOtp = otpStorage.get(key);
        
        if (storedOtp != null && storedOtp.equals(request.getOtp())) {
            // Update user status
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            if ("EMAIL".equalsIgnoreCase(request.getType())) {
                user.setEmailVerified(true);
            } else if ("PHONE".equalsIgnoreCase(request.getType())) {
                user.setPhoneVerified(true);
            }
            userRepository.save(user);
            
            // Remove OTP after successful verification
            otpStorage.remove(key);
            return true;
        }
        return false;
    }
}
