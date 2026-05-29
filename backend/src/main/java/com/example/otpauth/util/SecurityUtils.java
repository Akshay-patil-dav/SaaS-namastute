package com.example.otpauth.util;

import com.example.otpauth.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

public class SecurityUtils {

    public static Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null; // Or throw an exception like AccessDeniedException
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof com.example.otpauth.config.UserDetailsImpl) {
            return ((com.example.otpauth.config.UserDetailsImpl) principal).getUser().getId();
        }

        // If you're using a custom UserDetails object that exposes getId()
        // we might need to cast to it here. Let's look for user details.
        
        return null;
    }
}
