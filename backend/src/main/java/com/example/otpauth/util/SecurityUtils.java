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
            return null;
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof com.example.otpauth.config.UserDetailsImpl) {
            User user = ((com.example.otpauth.config.UserDetailsImpl) principal).getUser();
            return user.getActiveProjectId() != null ? user.getActiveProjectId() : user.getId();
        }

        return null;
    }

    public static Long getActualUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof com.example.otpauth.config.UserDetailsImpl) {
            return ((com.example.otpauth.config.UserDetailsImpl) principal).getUser().getId();
        }

        return null;
    }
}
