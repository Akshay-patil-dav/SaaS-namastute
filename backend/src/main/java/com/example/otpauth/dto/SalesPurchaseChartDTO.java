package com.example.otpauth.dto;

import java.math.BigDecimal;

public class SalesPurchaseChartDTO {
    private String name;
    private BigDecimal purchase;
    private BigDecimal sales;

    public SalesPurchaseChartDTO() {}

    public SalesPurchaseChartDTO(String name, BigDecimal purchase, BigDecimal sales) {
        this.name = name;
        this.purchase = purchase;
        this.sales = sales;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPurchase() {
        return purchase;
    }

    public void setPurchase(BigDecimal purchase) {
        this.purchase = purchase;
    }

    public BigDecimal getSales() {
        return sales;
    }

    public void setSales(BigDecimal sales) {
        this.sales = sales;
    }
}
