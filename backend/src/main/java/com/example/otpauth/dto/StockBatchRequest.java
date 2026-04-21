package com.example.otpauth.dto;

import java.util.List;

public class StockBatchRequest {
    private String warehouse;
    private String store;
    private String responsiblePerson;
    private List<StockItemRequest> products;

    public static class StockItemRequest {
        private Long productId;
        private Integer quantity;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    public String getWarehouse() { return warehouse; }
    public void setWarehouse(String warehouse) { this.warehouse = warehouse; }
    public String getStore() { return store; }
    public void setStore(String store) { this.store = store; }
    public String getResponsiblePerson() { return responsiblePerson; }
    public void setResponsiblePerson(String responsiblePerson) { this.responsiblePerson = responsiblePerson; }
    public List<StockItemRequest> getProducts() { return products; }
    public void setProducts(List<StockItemRequest> products) { this.products = products; }
}
