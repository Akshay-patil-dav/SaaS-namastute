package com.example.otpauth.dto;

public class CustomerOverviewDTO {
    private long lossTime;
    private long active;
    private long returns;
    private double lossTimePercentage;
    private double returnPercentage;
    private double activePercentage;

    public CustomerOverviewDTO() {}

    public CustomerOverviewDTO(long lossTime, long active, long returns, double lossTimePercentage, double returnPercentage, double activePercentage) {
        this.lossTime = lossTime;
        this.active = active;
        this.returns = returns;
        this.lossTimePercentage = lossTimePercentage;
        this.returnPercentage = returnPercentage;
        this.activePercentage = activePercentage;
    }

    public long getLossTime() { return lossTime; }
    public void setLossTime(long lossTime) { this.lossTime = lossTime; }

    public long getActive() { return active; }
    public void setActive(long active) { this.active = active; }

    public long getReturns() { return returns; }
    public void setReturns(long returns) { this.returns = returns; }

    public double getLossTimePercentage() { return lossTimePercentage; }
    public void setLossTimePercentage(double lossTimePercentage) { this.lossTimePercentage = lossTimePercentage; }

    public double getReturnPercentage() { return returnPercentage; }
    public void setReturnPercentage(double returnPercentage) { this.returnPercentage = returnPercentage; }

    public double getActivePercentage() { return activePercentage; }
    public void setActivePercentage(double activePercentage) { this.activePercentage = activePercentage; }
}
