package com.example.otpauth.dto;

public class StockUpdateRequest {
    private String warehouse;
    private String store;
    private String responsiblePerson;
    private Integer quantity;
    private Long productId;
    private String productName;
    private String productSku;
    private String productCategory;
    private String productImg;

    public String getWarehouse() { return warehouse; }
    public void setWarehouse(String warehouse) { this.warehouse = warehouse; }
    public String getStore() { return store; }
    public void setStore(String store) { this.store = store; }
    public String getResponsiblePerson() { return responsiblePerson; }
    public void setResponsiblePerson(String responsiblePerson) { this.responsiblePerson = responsiblePerson; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getProductSku() { return productSku; }
    public void setProductSku(String productSku) { this.productSku = productSku; }
    public String getProductCategory() { return productCategory; }
    public void setProductCategory(String productCategory) { this.productCategory = productCategory; }
    public String getProductImg() { return productImg; }
    public void setProductImg(String productImg) { this.productImg = productImg; }
}
