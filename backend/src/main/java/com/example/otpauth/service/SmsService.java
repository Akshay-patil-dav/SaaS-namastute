package com.example.otpauth.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class SmsService {
    private static final Logger logger = LoggerFactory.getLogger(SmsService.class);

    public void sendOtpSms(String toPhone, String otpCode) {
        // Dummy implementation logging to console

        String maskedPhone = (toPhone != null && toPhone.length() > 4) ? "*".repeat(toPhone.length() - 4) + toPhone.substring(toPhone.length() - 4) : "****";
        logger.info("SMS OTP dispatched to registered phone: {}", maskedPhone);

    }
}
