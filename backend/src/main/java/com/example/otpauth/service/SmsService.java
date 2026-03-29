package com.example.otpauth.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class SmsService {
    private static final Logger logger = LoggerFactory.getLogger(SmsService.class);

    public void sendOtpSms(String toPhone, String otpCode) {
        // Dummy implementation logging to console
        logger.info("===========================================");
        logger.info("Sending DUMMY SMS to: {}", toPhone);
        logger.info("Your OTP is: {}", otpCode);
        logger.info("===========================================");
    }
}
