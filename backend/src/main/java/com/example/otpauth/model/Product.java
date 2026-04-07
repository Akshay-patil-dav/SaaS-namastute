package com.example.otpauth.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Product Information ───────────────────────────────────────────────────
    @Column(nullable = false, length = 255)
    private String name;

    @Column(unique = true, length = 255)
    private String slug;

    @Column(unique = true, length = 100)
    private String sku;

    @Column(columnDefinition = "TEXT")
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

    // ── Pricing & Stock ───────────────────────────────────────────────────────
    @Column(nullable = false)
    private Integer quantity = 0;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price = BigDecimal.ZERO;

    private String productType;   // SINGLE | VARIABLE
    private String taxType;
    private String tax;
    private String discountType;

    @Column(precision = 10, scale = 2)
    private BigDecimal discountValue;

    private Integer quantityAlert;

    // ── Custom Fields ─────────────────────────────────────────────────────────
    private String warranty;
    private String manufacturer;
    private LocalDate manufacturedDate;
    private LocalDate expiryDate;

    // ── Images (comma-separated URLs) ─────────────────────────────────────────
    @Column(columnDefinition = "TEXT")
    private String images;

    // ── Audit ─────────────────────────────────────────────────────────────────
    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ── Getters & Setters ────────────────────────────────────────────────────
    public Long getId() { return id; }
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
    public LocalDate getManufacturedDate() { return manufacturedDate; }
    public void setManufacturedDate(LocalDate manufacturedDate) { this.manufacturedDate = manufacturedDate; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    public String getImages() { return images; }
    public void setImages(String images) { this.images = images; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
