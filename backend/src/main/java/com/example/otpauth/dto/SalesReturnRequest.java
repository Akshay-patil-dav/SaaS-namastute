package com.example.otpauth.dto;

import java.math.BigDecimal;
import java.util.List;

public class SalesReturnRequest {

    private String customerName;
    private String date;          // ISO date string e.g. "2024-12-24"
    private String status;        // Received | Pending | Cancelled
    private String paymentStatus; // Paid | Unpaid | Overdue

    private BigDecimal orderTax;
    private BigDecimal discount;
    private BigDecimal shipping;
    private BigDecimal paidAmount;

    private String biller;
    private String notes;

    private List<ReturnProduct> products;

    public static class ReturnProduct {
        private Long productId;
        private String name;
        private String sku;
        private String img;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal discount;
        private BigDecimal taxPercent;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getSku() { return sku; }
        public void setSku(String sku) { this.sku = sku; }

        public String getImg() { return img; }
        public void setImg(String img) { this.img = img; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

        public BigDecimal getDiscount() { return discount; }
        public void setDiscount(BigDecimal discount) { this.discount = discount; }

        public BigDecimal getTaxPercent() { return taxPercent; }
        public void setTaxPercent(BigDecimal taxPercent) { this.taxPercent = taxPercent; }
    }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

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

    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }

    public String getBiller() { return biller; }
    public void setBiller(String biller) { this.biller = biller; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<ReturnProduct> getProducts() { return products; }
    public void setProducts(List<ReturnProduct> products) { this.products = products; }
}
