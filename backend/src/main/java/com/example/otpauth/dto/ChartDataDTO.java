package com.example.otpauth.dto;

import java.math.BigDecimal;

public class ChartDataDTO {
    private String name;
    private BigDecimal uv;

    public ChartDataDTO(String name, BigDecimal uv) {
        this.name = name;
        this.uv = uv;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getUv() {
        return uv;
    }

    public void setUv(BigDecimal uv) {
        this.uv = uv;
    }
}
