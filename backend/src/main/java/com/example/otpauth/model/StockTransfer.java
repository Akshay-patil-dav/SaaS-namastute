package com.example.otpauth.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "stock_transfers")
public class StockTransfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    private String fromWarehouse;
    private String toWarehouse;
    private String referenceNo;
    
    @Column(columnDefinition = "TEXT")
    private String notes;

    private String shipping;
    private String status;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String productsJson; // Stores the JSON string of transferred products

    private Integer noOfProducts;
    private Integer quantityTransferred;

    private LocalDate date;
    private String formattedDate;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (date == null) {
            date = LocalDate.now();
        }
        if (formattedDate == null) {
            formattedDate = date.format(DateTimeFormatter.ofPattern("dd MMM yyyy"));
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getFromWarehouse() { return fromWarehouse; }
    public void setFromWarehouse(String fromWarehouse) { this.fromWarehouse = fromWarehouse; }
    
    public String getToWarehouse() { return toWarehouse; }
    public void setToWarehouse(String toWarehouse) { this.toWarehouse = toWarehouse; }
    
    public String getReferenceNo() { return referenceNo; }
    public void setReferenceNo(String referenceNo) { this.referenceNo = referenceNo; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public String getShipping() { return shipping; }
    public void setShipping(String shipping) { this.shipping = shipping; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getProductsJson() { return productsJson; }
    public void setProductsJson(String productsJson) { this.productsJson = productsJson; }
    
    public Integer getNoOfProducts() { return noOfProducts; }
    public void setNoOfProducts(Integer noOfProducts) { this.noOfProducts = noOfProducts; }
    
    public Integer getQuantityTransferred() { return quantityTransferred; }
    public void setQuantityTransferred(Integer quantityTransferred) { this.quantityTransferred = quantityTransferred; }
    
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    
    public String getFormattedDate() { return formattedDate; }
    public void setFormattedDate(String formattedDate) { this.formattedDate = formattedDate; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
}
