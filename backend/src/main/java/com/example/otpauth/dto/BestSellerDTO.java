package com.example.otpauth.dto;

public class BestSellerDTO {
    private String name;
    private String price;
    private Integer sales;

    public BestSellerDTO(String name, String price, Integer sales) {
        this.name = name;
        this.price = price;
        this.sales = sales;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public Integer getSales() {
        return sales;
    }

    public void setSales(Integer sales) {
        this.sales = sales;
    }
}
