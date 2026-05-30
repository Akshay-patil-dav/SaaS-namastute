package com.example.otpauth.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardDTO {
    private BigDecimal weeklyEarnings;
    private Double percentageIncrease;
    private Long totalOrders;
    private Long totalCustomers;
    private List<BestSellerDTO> bestSellers;
    private List<RecentTransactionDTO> recentTransactions;
    private List<ChartDataDTO> chartData;

    // Getters and Setters

    public BigDecimal getWeeklyEarnings() {
        return weeklyEarnings;
    }

    public void setWeeklyEarnings(BigDecimal weeklyEarnings) {
        this.weeklyEarnings = weeklyEarnings;
    }

    public Double getPercentageIncrease() {
        return percentageIncrease;
    }

    public void setPercentageIncrease(Double percentageIncrease) {
        this.percentageIncrease = percentageIncrease;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(Long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public List<BestSellerDTO> getBestSellers() {
        return bestSellers;
    }

    public void setBestSellers(List<BestSellerDTO> bestSellers) {
        this.bestSellers = bestSellers;
    }

    public List<RecentTransactionDTO> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<RecentTransactionDTO> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }

    public List<ChartDataDTO> getChartData() {
        return chartData;
    }

    public void setChartData(List<ChartDataDTO> chartData) {
        this.chartData = chartData;
    }
}
