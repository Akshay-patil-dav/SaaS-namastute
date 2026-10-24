package com.example.otpauth.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 * Automatically creates the database (e.g. 'namustute_db_pos') before Spring Boot
 * initializes HikariCP DataSource if the database does not already exist.
 * Uses a separate administrative maintenance connection with credential fallback.
 */
@Component
public class DatabaseAutoCreator implements BeanFactoryPostProcessor, EnvironmentAware {

    private static final Logger log = LoggerFactory.getLogger(DatabaseAutoCreator.class);
    private Environment environment;

    @Override
    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        try {
            ensureDatabaseExists();
        } catch (Exception e) {
            log.warn("[DatabaseAutoCreator] Could not auto-create database (proceeding normally): {}", e.getMessage());
        }
    }

    private void ensureDatabaseExists() {
        if (environment == null) return;

        String rawUrl = environment.getProperty("spring.datasource.url", "jdbc:postgresql://localhost:5432/namustute_db_pos");
        String username = environment.getProperty("spring.datasource.username", "postgres");
        String password = environment.getProperty("spring.datasource.password", "root");
        String driverClassName = environment.getProperty("spring.datasource.driver-class-name", "org.postgresql.Driver");

        if (rawUrl == null || (!rawUrl.startsWith("jdbc:postgresql:") && !rawUrl.startsWith("jdbc:mysql:"))) {
            return;
        }

        try {
            Class.forName(driverClassName);
        } catch (ClassNotFoundException e) {
            log.debug("[DatabaseAutoCreator] Driver class not loaded: {}", driverClassName);
            return;
        }

        // 1. Test if target database is directly accessible
        try (Connection testConn = DriverManager.getConnection(rawUrl, username, password)) {
            log.info("✅ [DatabaseAutoCreator] Target database is already available and connected: {}", rawUrl);
            return;
        } catch (Exception connEx) {
            log.info("⚠️ [DatabaseAutoCreator] Target database not directly accessible, initiating auto-creation. Reason: {}", connEx.getMessage());
        }

        // 2. Provision target database via administrative connection
        if (rawUrl.startsWith("jdbc:postgresql:")) {
            provisionPostgreSql(rawUrl, username, password);
        } else if (rawUrl.startsWith("jdbc:mysql:")) {
            provisionMySql(rawUrl, username, password);
        }
    }

    private void provisionPostgreSql(String rawUrl, String username, String password) {
        int slashIdx = rawUrl.indexOf("//");
        if (slashIdx == -1) return;

        int pathStart = rawUrl.indexOf('/', slashIdx + 2);
        if (pathStart == -1) return;

        String hostAndPort = rawUrl.substring(0, pathStart);
        String dbAndParams = rawUrl.substring(pathStart + 1);

        String dbName = dbAndParams;
        String queryParams = "";
        int qIdx = dbAndParams.indexOf('?');
        if (qIdx != -1) {
            dbName = dbAndParams.substring(0, qIdx);
            queryParams = dbAndParams.substring(qIdx);
        }

        if (dbName.isBlank()) return;

        String[] maintenanceDbs = {"postgres", "template1"};
        String[][] credentialOptions = {
                {username, password},
                {"postgres", "root"},
                {"postgres", "postgres"},
                {"postgres", "admin"},
                {"postgres", ""}
        };

        boolean createdOrExists = false;

        for (String maintDb : maintenanceDbs) {
            if (createdOrExists) break;
            String maintenanceUrl = hostAndPort + "/" + maintDb + queryParams;

            for (String[] creds : credentialOptions) {
                try (Connection conn = DriverManager.getConnection(maintenanceUrl, creds[0], creds[1])) {
                    conn.setAutoCommit(true);

                    // Check if database exists
                    boolean exists = false;
                    try (Statement stmt = conn.createStatement();
                         ResultSet rs = stmt.executeQuery("SELECT 1 FROM pg_database WHERE datname = '" + dbName.replace("'", "''") + "'")) {
                        if (rs.next()) {
                            exists = true;
                        }
                    }

                    if (!exists) {
                        try (Statement stmt = conn.createStatement()) {
                            stmt.executeUpdate("CREATE DATABASE \"" + dbName.replace("\"", "\"\"") + "\" WITH ENCODING 'UTF8'");
                            log.info("🎉 [DatabaseAutoCreator] Successfully created PostgreSQL database: \"{}\"", dbName);
                            createdOrExists = true;
                            break;
                        }
                    } else {
                        log.info("ℹ️ [DatabaseAutoCreator] PostgreSQL database \"{}\" already exists in pg_database.", dbName);
                        createdOrExists = true;
                        break;
                    }
                } catch (Exception ex) {
                    log.debug("[DatabaseAutoCreator] Administrative connection via '{}/{}' failed: {}", maintDb, creds[0], ex.getMessage());
                }
            }
        }

        if (!createdOrExists) {
            log.warn("⚠️ [DatabaseAutoCreator] Could not auto-create database \"{}\" via maintenance databases. Verify PostgreSQL is running on host.", dbName);
        }
    }

    private void provisionMySql(String rawUrl, String username, String password) {
        int slashIdx = rawUrl.indexOf("//");
        if (slashIdx == -1) return;

        int pathStart = rawUrl.indexOf('/', slashIdx + 2);
        if (pathStart == -1) return;

        String hostAndPort = rawUrl.substring(0, pathStart);
        String dbAndParams = rawUrl.substring(pathStart + 1);

        String dbName = dbAndParams;
        String queryParams = "";
        int qIdx = dbAndParams.indexOf('?');
        if (qIdx != -1) {
            dbName = dbAndParams.substring(0, qIdx);
            queryParams = dbAndParams.substring(qIdx);
        }

        if (dbName.isBlank()) return;

        String maintenanceUrl = hostAndPort + "/mysql" + queryParams;
        try (Connection conn = DriverManager.getConnection(maintenanceUrl, username, password)) {
            try (Statement stmt = conn.createStatement()) {
                stmt.executeUpdate("CREATE DATABASE IF NOT EXISTS `" + dbName.replace("`", "``") + "`");
                log.info("[DatabaseAutoCreator] Successfully verified/created MySQL database: `{}`", dbName);
            }
        } catch (Exception ex) {
            log.warn("[DatabaseAutoCreator] MySQL auto-creation failed: {}", ex.getMessage());
        }
    }
}
