package com.example.otpauth.dto;

import java.util.List;

public class AuthResponse {
    private String token;
    private String email;
    private String fullName;
    private String firstName;
    private String lastName;
    private String username;
    private String businessType;
    private List<String> roles;
    private String plan;
    private boolean emailVerified;
    private boolean phoneVerified;

    public AuthResponse(String token, String email, String fullName, String firstName, String lastName, String username, String businessType, List<String> roles, String plan, boolean emailVerified, boolean phoneVerified) {
        this.token = token;
        this.email = email;
        this.fullName = fullName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.businessType = businessType;
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

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getBusinessType() { return businessType; }
    public void setBusinessType(String businessType) { this.businessType = businessType; }

    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }

    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public boolean isPhoneVerified() { return phoneVerified; }
    public void setPhoneVerified(boolean phoneVerified) { this.phoneVerified = phoneVerified; }
}
