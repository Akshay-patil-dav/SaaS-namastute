package com.example.otpauth.dto;

public class SubCategoryRequest {
    private String name;
    private Long categoryId;
    private String categoryCode;
    private String description;
    private Boolean status;
    private String image;

    // Getters & Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getCategoryCode() { return categoryCode; }
    public void setCategoryCode(String categoryCode) { this.categoryCode = categoryCode; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Boolean getStatus() { return status; }
    public void setStatus(Boolean status) { this.status = status; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}
