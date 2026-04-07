package com.example.otpauth.dto;

import java.math.BigDecimal;

public class ProductRequest {
    private String name;
    private String slug;
    private String sku;
    private String description;
    private String store;
    private String warehouse;
    private String sellingType;
    private String category;
    private String subCategory;
    private String brand;
    private String unit;
    private String barcodeSymbology;
    private String itemBarcode;
    private Integer quantity;
    private BigDecimal price;
    private String productType;
    private String taxType;
    private String tax;
    private String discountType;
    private BigDecimal discountValue;
    private Integer quantityAlert;
    private String warranty;
    private String manufacturer;
    private String manufacturedDate;  // received as "yyyy-MM-dd"
    private String expiryDate;        // received as "yyyy-MM-dd"
    private String images;            // comma-separated URLs

    // ── Getters & Setters ──────────────────────────────────────────────────
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStore() { return store; }
    public void setStore(String store) { this.store = store; }
    public String getWarehouse() { return warehouse; }
    public void setWarehouse(String warehouse) { this.warehouse = warehouse; }
    public String getSellingType() { return sellingType; }
    public void setSellingType(String sellingType) { this.sellingType = sellingType; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSubCategory() { return subCategory; }
    public void setSubCategory(String subCategory) { this.subCategory = subCategory; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public String getBarcodeSymbology() { return barcodeSymbology; }
    public void setBarcodeSymbology(String barcodeSymbology) { this.barcodeSymbology = barcodeSymbology; }
    public String getItemBarcode() { return itemBarcode; }
    public void setItemBarcode(String itemBarcode) { this.itemBarcode = itemBarcode; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }
    public String getTaxType() { return taxType; }
    public void setTaxType(String taxType) { this.taxType = taxType; }
    public String getTax() { return tax; }
    public void setTax(String tax) { this.tax = tax; }
    public String getDiscountType() { return discountType; }
    public void setDiscountType(String discountType) { this.discountType = discountType; }
    public BigDecimal getDiscountValue() { return discountValue; }
    public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }
    public Integer getQuantityAlert() { return quantityAlert; }
    public void setQuantityAlert(Integer quantityAlert) { this.quantityAlert = quantityAlert; }
    public String getWarranty() { return warranty; }
    public void setWarranty(String warranty) { this.warranty = warranty; }
    public String getManufacturer() { return manufacturer; }
    public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }
    public String getManufacturedDate() { return manufacturedDate; }
    public void setManufacturedDate(String manufacturedDate) { this.manufacturedDate = manufacturedDate; }
    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }
    public String getImages() { return images; }
    public void setImages(String images) { this.images = images; }
}
