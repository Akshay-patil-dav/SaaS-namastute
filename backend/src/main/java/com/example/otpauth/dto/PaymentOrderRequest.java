package com.example.otpauth.dto;

public class PaymentOrderRequest {
    private String plan;
    private int amount;
    private String currency;

    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }
    public int getAmount() { return amount; }
    public void setAmount(int amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}
