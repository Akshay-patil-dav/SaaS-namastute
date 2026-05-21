package com.example.otpauth.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * One-time migration: drop the old bytea column {@code ai_api_key_bytes}
 * from {@code user_ai_settings} and ensure the new TEXT column
 * {@code ai_api_key_enc} exists.
 *
 * <p>This runner is idempotent — it checks whether the old column exists
 * before attempting the DROP, so it is safe to leave in place indefinitely.
 *
 * <p>After the migration the {@code user_ai_settings} table will have:
 * <ul>
 *   <li>{@code ai_api_key_enc} TEXT — AES-256-GCM encrypted Base64 string</li>
 * </ul>
 * No binary/bytea data remains in the database.
 */
@Component
public class AiKeyMigrationRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AiKeyMigrationRunner.class);

    private final JdbcTemplate jdbc;

    public AiKeyMigrationRunner(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void run(String... args) {
        dropLegacyBytesColumnIfExists();
    }

    /**
     * Drops the old {@code ai_api_key_bytes} bytea column if it still exists.
     * The new {@code ai_api_key_enc} TEXT column is created by Hibernate's
     * {@code ddl-auto: update} on startup.
     */
    private void dropLegacyBytesColumnIfExists() {
        try {
            boolean columnExists = Boolean.TRUE.equals(jdbc.queryForObject(
                "SELECT EXISTS (" +
                "  SELECT 1 FROM information_schema.columns " +
                "  WHERE table_name = 'user_ai_settings' " +
                "    AND column_name = 'ai_api_key_bytes'" +
                ")", Boolean.class));

            if (columnExists) {
                jdbc.execute("ALTER TABLE user_ai_settings DROP COLUMN ai_api_key_bytes");
                log.info("✅ Migration: dropped legacy 'ai_api_key_bytes' bytea column from user_ai_settings. " +
                         "Keys now stored as AES-256-GCM encrypted TEXT in 'ai_api_key_enc'.");
            } else {
                log.debug("Migration: 'ai_api_key_bytes' column not found — already migrated or fresh install.");
            }
        } catch (Exception e) {
            // Log but don't crash — the old column being present is harmless for operation
            log.warn("Migration: could not drop legacy 'ai_api_key_bytes' column: {}. " +
                     "It can be dropped manually: ALTER TABLE user_ai_settings DROP COLUMN ai_api_key_bytes;",
                     e.getMessage());
        }
    }
}
