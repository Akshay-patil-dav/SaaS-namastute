package com.example.otpauth.dto;

public class BrandRequest {
    private String name;
    private String desc;
    private String img;
    private Boolean status;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDesc() { return desc; }
    public void setDesc(String desc) { this.desc = desc; }

    public String getImg() { return img; }
    public void setImg(String img) { this.img = img; }

    public Boolean getStatus() { return status; }
    public void setStatus(Boolean status) { this.status = status; }
}
