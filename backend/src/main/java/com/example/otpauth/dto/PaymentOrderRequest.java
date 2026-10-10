package com.example.otpauth.dto;

public class PaymentOrderRequest {
    private String plan;
    private Double amount;
    private String currency;
    private String billingCycle;

    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getBillingCycle() { return billingCycle; }
    public void setBillingCycle(String billingCycle) { this.billingCycle = billingCycle; }
}
