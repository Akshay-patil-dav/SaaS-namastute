package com.example.otpauth.dto;

import java.math.BigDecimal;

public class WorkOrderDTO {
    private Long id;
    private Long productId;
    private Long bomId;
    private BigDecimal quantityToProduce;
    private String status;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public Long getBomId() { return bomId; }
    public void setBomId(Long bomId) { this.bomId = bomId; }
    public BigDecimal getQuantityToProduce() { return quantityToProduce; }
    public void setQuantityToProduce(BigDecimal quantityToProduce) { this.quantityToProduce = quantityToProduce; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
