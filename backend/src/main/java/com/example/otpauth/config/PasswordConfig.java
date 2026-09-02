package com.example.otpauth.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordConfig {

    /**
     * BCrypt cost factor (log2 rounds).
     * Strength 4  → ~1 ms  (fast; good for development)
     * Strength 10 → ~100 ms (OWASP minimum recommended for production)
     *
     * Override in environment: BCRYPT_STRENGTH=10
     */
    @Value("${security.bcrypt.strength:4}")
    private int bcryptStrength;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(bcryptStrength);
    }
}
