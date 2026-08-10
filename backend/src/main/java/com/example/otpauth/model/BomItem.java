package com.example.otpauth.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "bom_items")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class BomItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bom_id", nullable = false)
    @JsonIgnore
    private BillOfMaterial billOfMaterial;

    // The raw material / ingredient
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ingredient_product_id", nullable = false)
    private Product ingredient;

    @Column(nullable = false, precision = 10, scale = 4)
    private BigDecimal quantityRequired = BigDecimal.ZERO;

    // Getters and Setters
    public Long getId() { return id; }
    public BillOfMaterial getBillOfMaterial() { return billOfMaterial; }
    public void setBillOfMaterial(BillOfMaterial billOfMaterial) { this.billOfMaterial = billOfMaterial; }
    public Product getIngredient() { return ingredient; }
    public void setIngredient(Product ingredient) { this.ingredient = ingredient; }
    public BigDecimal getQuantityRequired() { return quantityRequired; }
    public void setQuantityRequired(BigDecimal quantityRequired) { this.quantityRequired = quantityRequired; }
}
