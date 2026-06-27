package com.example.otpauth.dto;

import java.util.List;

public class AuthResponse {
    private String token;
    private String email;
    private String fullName;
    private List<String> roles;
    private String plan;
    private boolean emailVerified;
    private boolean phoneVerified;

    public AuthResponse(String token, String email, String fullName, List<String> roles, String plan, boolean emailVerified, boolean phoneVerified) {
        this.token = token;
        this.email = email;
        this.fullName = fullName;
        this.roles = roles;
        this.plan = plan;
        this.emailVerified = emailVerified;
        this.phoneVerified = phoneVerified;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }

    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public boolean isPhoneVerified() { return phoneVerified; }
    public void setPhoneVerified(boolean phoneVerified) { this.phoneVerified = phoneVerified; }
}
