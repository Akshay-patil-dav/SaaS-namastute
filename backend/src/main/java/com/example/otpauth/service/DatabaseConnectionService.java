package com.example.otpauth.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

/**
 * Service to manage and inspect database connections, auto-create missing databases,
 * and provide live connection diagnostics for the Admin Panel.
 */
@Service
public class DatabaseConnectionService {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConnectionService.class);

    private final DataSource dataSource;

    @Value("${spring.datasource.url:jdbc:postgresql://localhost:5432/namustute_db_pos}")
    private String datasourceUrl;

    @Value("${spring.datasource.username:postgres}")
    private String datasourceUsername;

    @Value("${spring.datasource.password:root}")
    private String datasourcePassword;

    public DatabaseConnectionService(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    /**
     * Checks the live health of the primary datasource and returns metadata.
     */
    public Map<String, Object> getDatabaseHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("timestamp", System.currentTimeMillis());
        status.put("url", maskUrl(datasourceUrl));
        status.put("username", datasourceUsername);

        try (Connection conn = dataSource.getConnection()) {
            DatabaseMetaData metaData = conn.getMetaData();
            status.put("connected", true);
            status.put("status", "HEALTHY");
            status.put("databaseProductName", metaData.getDatabaseProductName());
            status.put("databaseProductVersion", metaData.getDatabaseProductVersion());
            status.put("driverName", metaData.getDriverName());
            status.put("catalog", conn.getCatalog());

            // Count tables
            try (Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(
                         "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'")) {
                if (rs.next()) {
                    status.put("tableCount", rs.getInt(1));
                }
            }
        } catch (Exception e) {
            status.put("connected", false);
            status.put("status", "DISCONNECTED");
            status.put("error", e.getMessage());
            log.warn("[DatabaseConnectionService] Primary connection failed: {}", e.getMessage());
        }

        return status;
    }

    /**
     * Probe and auto-create target database using secondary administrative connection.
     */
    public boolean verifyAndCreateDatabase() {
        if (!datasourceUrl.startsWith("jdbc:postgresql:")) {
            return false;
        }

        int slashIdx = datasourceUrl.indexOf("//");
        if (slashIdx == -1) return false;
        int pathStart = datasourceUrl.indexOf('/', slashIdx + 2);
        if (pathStart == -1) return false;

        String hostAndPort = datasourceUrl.substring(0, pathStart);
        String dbAndParams = datasourceUrl.substring(pathStart + 1);
        String targetDb = dbAndParams;
        if (targetDb.contains("?")) {
            targetDb = targetDb.substring(0, targetDb.indexOf("?"));
        }

        String[] maintenanceDbs = {"postgres", "template1"};
        String[][] credentials = {
                {datasourceUsername, datasourcePassword},
                {"postgres", "root"},
                {"postgres", "postgres"},
                {"postgres", "admin"},
                {"postgres", ""}
        };

        for (String maintDb : maintenanceDbs) {
            String adminUrl = hostAndPort + "/" + maintDb;
            for (String[] creds : credentials) {
                try (Connection conn = DriverManager.getConnection(adminUrl, creds[0], creds[1])) {
                    conn.setAutoCommit(true);

                    // Check existence
                    boolean exists = false;
                    try (Statement stmt = conn.createStatement();
                         ResultSet rs = stmt.executeQuery(
                                 "SELECT 1 FROM pg_database WHERE datname = '" + targetDb.replace("'", "''") + "'")) {
                        if (rs.next()) {
                            exists = true;
                        }
                    }

                    if (!exists) {
                        try (Statement stmt = conn.createStatement()) {
                            stmt.executeUpdate("CREATE DATABASE \"" + targetDb.replace("\"", "\"\"") + "\" WITH ENCODING 'UTF8'");
                            log.info("[DatabaseConnectionService] Successfully created database: \"{}\"", targetDb);
                            return true;
                        }
                    } else {
                        log.info("[DatabaseConnectionService] Database \"{}\" already exists.", targetDb);
                        return true;
                    }
                } catch (Exception ignored) {
                    // Try next credential combination
                }
            }
        }

        return false;
    }

    private String maskUrl(String url) {
        if (url == null) return "";
        return url.replaceAll("(?<=://)[^@]+(?=@)", "****");
    }
}
