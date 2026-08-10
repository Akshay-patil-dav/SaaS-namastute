package com.example.otpauth.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "work_orders")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class WorkOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, unique = true, length = 100)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bom_id", nullable = false)
    private BillOfMaterial billOfMaterial;

    @Column(nullable = false, precision = 10, scale = 4)
    private BigDecimal quantityToProduce = BigDecimal.ONE;

    @Column(nullable = false, length = 50)
    private String status = "DRAFT"; // DRAFT, IN_PROGRESS, COMPLETED, CANCELLED

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public BillOfMaterial getBillOfMaterial() { return billOfMaterial; }
    public void setBillOfMaterial(BillOfMaterial billOfMaterial) { this.billOfMaterial = billOfMaterial; }
    public BigDecimal getQuantityToProduce() { return quantityToProduce; }
    public void setQuantityToProduce(BigDecimal quantityToProduce) { this.quantityToProduce = quantityToProduce; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
