package com.example.otpauth.exception;

public class DataLimitExceededException extends RuntimeException {
    private final long limit;
    private final long currentCount;

    public DataLimitExceededException(String message, long limit, long currentCount) {
        super(message);
        this.limit = limit;
        this.currentCount = currentCount;
    }

    public long getLimit() {
        return limit;
    }

    public long getCurrentCount() {
        return currentCount;
    }
}
