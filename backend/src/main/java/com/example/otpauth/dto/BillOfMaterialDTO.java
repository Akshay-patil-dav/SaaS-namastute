package com.example.otpauth.dto;

import java.math.BigDecimal;
import java.util.List;

public class BillOfMaterialDTO {
    private Long id;
    private Long productId;
    private String name;
    private List<BomItemDTO> items;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<BomItemDTO> getItems() { return items; }
    public void setItems(List<BomItemDTO> items) { this.items = items; }

    public static class BomItemDTO {
        private Long id;
        private Long ingredientId;
        private BigDecimal quantityRequired;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getIngredientId() { return ingredientId; }
        public void setIngredientId(Long ingredientId) { this.ingredientId = ingredientId; }
        public BigDecimal getQuantityRequired() { return quantityRequired; }
        public void setQuantityRequired(BigDecimal quantityRequired) { this.quantityRequired = quantityRequired; }
    }
}
