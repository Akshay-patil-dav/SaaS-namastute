package com.example.otpauth.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class KhataTransactionRequest {
    private Long partyId;
    private String transactionType; // "GAVE" or "GOT"
    private BigDecimal amount;
    private String paymentMode; // "CASH", "UPI", "BANK_TRANSFER", "CHEQUE", "OTHER"
    private String referenceNumber;
    private String notes;
    private LocalDate transactionDate;

    // Getters and Setters
    public Long getPartyId() { return partyId; }
    public void setPartyId(Long partyId) { this.partyId = partyId; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }

    public String getReferenceNumber() { return referenceNumber; }
    public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }
}
