package com.example.otpauth.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(org.springframework.web.bind.MethodArgumentNotValidException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Bad Request");
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(org.springframework.validation.FieldError::getDefaultMessage)
                .findFirst()
                .orElse("Validation failed");
        response.put("message", errorMessage);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(com.example.otpauth.exception.DataLimitExceededException.class)
    public ResponseEntity<Map<String, Object>> handleDataLimitExceededException(com.example.otpauth.exception.DataLimitExceededException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", ex.getMessage());
        response.put("message", ex.getMessage());
        response.put("limitExceeded", true);
        response.put("limit", ex.getLimit());
        response.put("currentCount", ex.getCurrentCount());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleAllExceptions(Exception ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Internal Server Error");
        response.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
