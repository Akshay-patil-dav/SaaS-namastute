package com.example.otpauth.dto;

public class VerificationRequest {
    private String email;
    private String otp;
    private String type; // EMAIL or PHONE

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
