package com.example.otpauth.model;

import jakarta.persistence.*;

/**
 * Stores per-user AI Helper configuration.
 *
 * <p>The API key is persisted as an AES-256-GCM encrypted Base64 string in the
 * {@code ai_api_key_enc} column (TEXT / VARCHAR).  This replaces the old
 * {@code ai_api_key_bytes} bytea column — no binary data in the database.
 *
 * <p>Encryption/decryption is handled by {@link com.example.otpauth.util.AiApiKeyEncryptor}.
 * The encryption key lives in {@code ai.encryption-secret} (application.yml / env var).
 */
@Entity
@Table(name = "user_ai_settings")
public class UserAiSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The user this configuration belongs to — strictly 1-to-1. */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    /**
     * AES-256-GCM encrypted API key stored as a Base64 TEXT string.
     * Format: Base64( IV[12 bytes] || CipherText+AuthTag )
     * No binary / bytea columns — fully readable VARCHAR in the DB.
     */
    @Column(name = "ai_api_key_enc", columnDefinition = "TEXT")
    private String aiApiKeyEnc;

    /** AI provider identifier, e.g. "openai", "gemini", "claude", "groq" */
    @Column(name = "ai_provider", length = 50)
    private String aiProvider = "openai";

    /** Model name, e.g. "gpt-4o-mini", "gemini-1.5-flash", "llama-3.3-70b-versatile" */
    @Column(name = "ai_model", length = 150)
    private String aiModel = "gpt-4o-mini";

    public UserAiSettings() {}

    public UserAiSettings(User user) {
        this.user = user;
    }

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    /** Encrypted Base64 API key string (safe to store in VARCHAR/TEXT). */
    public String getAiApiKeyEnc() { return aiApiKeyEnc; }
    public void setAiApiKeyEnc(String aiApiKeyEnc) { this.aiApiKeyEnc = aiApiKeyEnc; }

    public String getAiProvider() { return aiProvider; }
    public void setAiProvider(String aiProvider) { this.aiProvider = aiProvider; }

    public String getAiModel() { return aiModel; }
    public void setAiModel(String aiModel) { this.aiModel = aiModel; }

    /** True when the user has saved an API key. */
    public boolean hasKey() {
        return aiApiKeyEnc != null && !aiApiKeyEnc.isBlank();
    }
}
