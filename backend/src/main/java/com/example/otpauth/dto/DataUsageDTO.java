package com.example.otpauth.dto;

import java.util.Map;

public class DataUsageDTO {
    private boolean isFreePlan;
    private String plan;
    private long totalUsed;
    private long limit;
    private long remaining;
    private double percentage;
    private String subscriptionEndDate;
    private Map<String, Long> breakdown;

    public DataUsageDTO() {}

    public DataUsageDTO(boolean isFreePlan, String plan, long totalUsed, long limit, long remaining, double percentage, String subscriptionEndDate, Map<String, Long> breakdown) {
        this.isFreePlan = isFreePlan;
        this.plan = plan;
        this.totalUsed = totalUsed;
        this.limit = limit;
        this.remaining = remaining;
        this.percentage = percentage;
        this.subscriptionEndDate = subscriptionEndDate;
        this.breakdown = breakdown;
    }

    public boolean isFreePlan() {
        return isFreePlan;
    }

    public void setFreePlan(boolean freePlan) {
        isFreePlan = freePlan;
    }

    public String getPlan() {
        return plan;
    }

    public void setPlan(String plan) {
        this.plan = plan;
    }

    public long getTotalUsed() {
        return totalUsed;
    }

    public void setTotalUsed(long totalUsed) {
        this.totalUsed = totalUsed;
    }

    public long getLimit() {
        return limit;
    }

    public void setLimit(long limit) {
        this.limit = limit;
    }

    public long getRemaining() {
        return remaining;
    }

    public void setRemaining(long remaining) {
        this.remaining = remaining;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }

    public String getSubscriptionEndDate() {
        return subscriptionEndDate;
    }

    public void setSubscriptionEndDate(String subscriptionEndDate) {
        this.subscriptionEndDate = subscriptionEndDate;
    }

    public Map<String, Long> getBreakdown() {
        return breakdown;
    }

    public void setBreakdown(Map<String, Long> breakdown) {
        this.breakdown = breakdown;
    }
}
