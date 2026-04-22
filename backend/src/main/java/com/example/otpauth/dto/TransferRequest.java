package com.example.otpauth.dto;

import java.util.List;

public class TransferRequest {
    private String from; // Maps to fromWarehouse or warehouseFrom
    private String warehouseFrom; // Frontend AddTransferModal uses warehouseFrom
    private String to; // Maps to toWarehouse or warehouseTo
    private String warehouseTo; // Frontend AddTransferModal uses warehouseTo
    private String referenceNo;
    private String notes;
    private String status;
    private String shipping;
    private String description;
    private List<TransferProduct> products;

    public static class TransferProduct {
        private Long productId;
        private String name;
        private String sku;
        private String category;
        private String img;
        private Integer quantity;

        // Getters and setters
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getSku() { return sku; }
        public void setSku(String sku) { this.sku = sku; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public String getImg() { return img; }
        public void setImg(String img) { this.img = img; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    // Resolvers for inconsistent frontend naming
    public String getResolvedFrom() {
        return warehouseFrom != null ? warehouseFrom : from;
    }

    public String getResolvedTo() {
        return warehouseTo != null ? warehouseTo : to;
    }

    // Getters and setters
    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }
    public String getWarehouseFrom() { return warehouseFrom; }
    public void setWarehouseFrom(String warehouseFrom) { this.warehouseFrom = warehouseFrom; }
    
    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }
    public String getWarehouseTo() { return warehouseTo; }
    public void setWarehouseTo(String warehouseTo) { this.warehouseTo = warehouseTo; }
    
    public String getReferenceNo() { return referenceNo; }
    public void setReferenceNo(String referenceNo) { this.referenceNo = referenceNo; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getShipping() { return shipping; }
    public void setShipping(String shipping) { this.shipping = shipping; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<TransferProduct> getProducts() { return products; }
    public void setProducts(List<TransferProduct> products) { this.products = products; }
}
