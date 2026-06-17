package com.example.otpauth.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bill_of_materials")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class BillOfMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    // The finished good that this BOM creates
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, length = 255)
    private String name;

    @OneToMany(mappedBy = "billOfMaterial", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BomItem> items = new ArrayList<>();

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

    // Getters and Setters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<BomItem> getItems() { return items; }
    public void setItems(List<BomItem> items) { this.items = items; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void addItem(BomItem item) {
        items.add(item);
        item.setBillOfMaterial(this);
    }

    public void removeItem(BomItem item) {
        items.remove(item);
        item.setBillOfMaterial(null);
    }
}
