package com.example.otpauth.dto;

public class BankAccountRequest {
    private String bankName;
    private String accountName;
    private String accountNumber;
    private String branchIfsc;

    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }

    public String getAccountName() { return accountName; }
    public void setAccountName(String accountName) { this.accountName = accountName; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getBranchIfsc() { return branchIfsc; }
    public void setBranchIfsc(String branchIfsc) { this.branchIfsc = branchIfsc; }
}
