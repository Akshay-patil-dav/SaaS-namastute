package com.example.otpauth.dto;

import java.math.BigDecimal;

public class KhataPartyRequest {
    private String name;
    private String phone;
    private String email;
    private String address;
    private String partyType; // "CUSTOMER" or "SUPPLIER"
    private BigDecimal openingBalance;
    private String openingBalanceType; // "YOU_WILL_GET" or "YOU_WILL_GIVE"

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPartyType() { return partyType; }
    public void setPartyType(String partyType) { this.partyType = partyType; }

    public BigDecimal getOpeningBalance() { return openingBalance; }
    public void setOpeningBalance(BigDecimal openingBalance) { this.openingBalance = openingBalance; }

    public String getOpeningBalanceType() { return openingBalanceType; }
    public void setOpeningBalanceType(String openingBalanceType) { this.openingBalanceType = openingBalanceType; }
}
