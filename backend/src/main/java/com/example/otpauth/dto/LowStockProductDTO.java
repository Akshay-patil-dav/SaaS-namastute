package com.example.otpauth.dto;

public class LowStockProductDTO {
    private String name;
    private String sku;
    private Integer stock;

    public LowStockProductDTO(String name, String sku, Integer stock) {
        this.name = name;
        this.sku = sku;
        this.stock = stock;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
}
