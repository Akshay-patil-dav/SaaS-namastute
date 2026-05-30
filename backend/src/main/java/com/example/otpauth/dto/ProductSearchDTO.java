package com.example.otpauth.dto;

import java.math.BigDecimal;

public class ProductSearchDTO {
    private Long id;
    private String name;
    private String sku;
    private String itemBarcode;
    private String category;
    private BigDecimal price;
    private Integer quantity;
    private String images;
    private String productType;

    public ProductSearchDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getItemBarcode() { return itemBarcode; }
    public void setItemBarcode(String itemBarcode) { this.itemBarcode = itemBarcode; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getImages() { return images; }
    public void setImages(String images) { this.images = images; }

    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }
}
