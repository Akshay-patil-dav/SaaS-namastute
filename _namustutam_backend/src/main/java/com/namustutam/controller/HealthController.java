package com.namustutam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Autowired(required = false)
    private DataSource dataSource;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "namustutam-backend");
        response.put("timestamp", System.currentTimeMillis());

        Map<String, Object> dbInfo = new HashMap<>();
        if (dataSource != null) {
            try (Connection conn = dataSource.getConnection()) {
                DatabaseMetaData meta = conn.getMetaData();
                dbInfo.put("status", "CONNECTED");
                dbInfo.put("databaseProduct", meta.getDatabaseProductName());
                dbInfo.put("databaseVersion", meta.getDatabaseProductVersion());
                dbInfo.put("driverName", meta.getDriverName());
                dbInfo.put("catalog", conn.getCatalog());
            } catch (Exception e) {
                dbInfo.put("status", "DISCONNECTED");
                dbInfo.put("error", e.getMessage());
                response.put("database", dbInfo);
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
            }
        } else {
            dbInfo.put("status", "NO_DATASOURCE");
        }

        response.put("database", dbInfo);
        return ResponseEntity.ok(response);
    }
}
