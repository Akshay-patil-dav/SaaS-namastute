package com.example.otpauth.dto;

public class RecentTransactionDTO {
    private Long id;
    private String name;
    private String time;
    private String payment;
    private String tid;
    private String status;
    private String stClass;
    private String amount;

    public RecentTransactionDTO(Long id, String name, String time, String payment, String tid, String status, String stClass, String amount) {
        this.id = id;
        this.name = name;
        this.time = time;
        this.payment = payment;
        this.tid = tid;
        this.status = status;
        this.stClass = stClass;
        this.amount = amount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getPayment() {
        return payment;
    }

    public void setPayment(String payment) {
        this.payment = payment;
    }

    public String getTid() {
        return tid;
    }

    public void setTid(String tid) {
        this.tid = tid;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStClass() {
        return stClass;
    }

    public void setStClass(String stClass) {
        this.stClass = stClass;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }
}
