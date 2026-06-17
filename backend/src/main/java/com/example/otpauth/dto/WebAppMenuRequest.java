package com.example.otpauth.dto;

public class WebAppMenuRequest {
    private String name;
    private String itemsJson;

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getItemsJson() {
        return itemsJson;
    }
    public void setItemsJson(String itemsJson) {
        this.itemsJson = itemsJson;
    }
}
