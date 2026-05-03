package com.example.otpauth.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PurchaseReturnRequest {

    private String reference;
    private String supplier;
    private LocalDate date;
    private String status;
    private String paymentStatus;
    private BigDecimal orderTax;
    private BigDecimal discount;
    private BigDecimal shipping;
    private BigDecimal total;
    private BigDecimal paid;
    private BigDecimal due;
    private String productsJson;
    private String notes;

    // Getters and Setters
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public String getSupplier() { return supplier; }
    public void setSupplier(String supplier) { this.supplier = supplier; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public BigDecimal getOrderTax() { return orderTax; }
    public void setOrderTax(BigDecimal orderTax) { this.orderTax = orderTax; }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }

    public BigDecimal getShipping() { return shipping; }
    public void setShipping(BigDecimal shipping) { this.shipping = shipping; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public BigDecimal getPaid() { return paid; }
    public void setPaid(BigDecimal paid) { this.paid = paid; }

    public BigDecimal getDue() { return due; }
    public void setDue(BigDecimal due) { this.due = due; }

    public String getProductsJson() { return productsJson; }
    public void setProductsJson(String productsJson) { this.productsJson = productsJson; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
