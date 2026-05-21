package com.example.otpauth.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;

/**
 * AES-256-GCM encryption utility for storing API keys securely.
 *
 * <p>Why AES-256-GCM and not BCrypt?
 * <ul>
 *   <li>BCrypt is one-way — once hashed the original value is gone forever.</li>
 *   <li>API keys must be retrieved (to proxy requests to Groq, Gemini, etc.),
 *       so we need symmetric (reversible) encryption.</li>
 *   <li>AES-256-GCM is authenticated encryption — it both encrypts AND detects
 *       any tampering (integrity check built-in).</li>
 * </ul>
 *
 * <p>Storage format: Base64( IV[12 bytes] || CipherText+AuthTag )
 * <p>Stored in DB as a plain VARCHAR — no bytea / binary columns.
 */
@Component
public class AiApiKeyEncryptor {

    private static final String ALGORITHM   = "AES/GCM/NoPadding";
    private static final int    IV_LENGTH   = 12;   // 96-bit IV — GCM recommended
    private static final int    TAG_BITS    = 128;  // 128-bit auth tag

    private final SecretKey secretKey;

    /**
     * The encryption secret is a 64-character hex string (= 32 bytes = 256 bits).
     * Injected from application.yml → ai.encryption-secret or env AI_ENCRYPTION_SECRET.
     */
    public AiApiKeyEncryptor(
            @Value("${ai.encryption-secret:0000000000000000000000000000000000000000000000000000000000000000}")
            String hexSecret) {

        byte[] keyBytes = HexFormat.of().parseHex(hexSecret);
        if (keyBytes.length != 32) {
            throw new IllegalStateException(
                "ai.encryption-secret must be exactly 64 hex characters (32 bytes / 256 bits). "
                + "Got " + keyBytes.length + " bytes.");
        }
        this.secretKey = new SecretKeySpec(keyBytes, "AES");
    }

    // ── Encrypt ───────────────────────────────────────────────────────────────

    /**
     * Encrypts a plaintext API key and returns a Base64-encoded string
     * safe to store in a VARCHAR/TEXT column.
     *
     * @param plaintext the raw API key (e.g. "gsk_abc123…")
     * @return Base64( IV || CipherText+AuthTag )
     */
    public String encrypt(String plaintext) {
        if (plaintext == null || plaintext.isBlank()) return "";
        try {
            byte[] iv = new byte[IV_LENGTH];
            new SecureRandom().nextBytes(iv);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, new GCMParameterSpec(TAG_BITS, iv));

            byte[] cipherText = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));

            // Prepend IV so we can recover it during decryption
            byte[] combined = new byte[IV_LENGTH + cipherText.length];
            System.arraycopy(iv,         0, combined, 0,         IV_LENGTH);
            System.arraycopy(cipherText, 0, combined, IV_LENGTH, cipherText.length);

            return Base64.getEncoder().encodeToString(combined);
        } catch (Exception e) {
            throw new RuntimeException("Failed to encrypt API key", e);
        }
    }

    // ── Decrypt ───────────────────────────────────────────────────────────────

    /**
     * Decrypts a Base64-encoded encrypted key back to the original plaintext.
     *
     * @param encoded the Base64 string previously produced by {@link #encrypt}
     * @return original plaintext API key
     */
    public String decrypt(String encoded) {
        if (encoded == null || encoded.isBlank()) return "";
        try {
            byte[] combined = Base64.getDecoder().decode(encoded);

            byte[] iv         = new byte[IV_LENGTH];
            byte[] cipherText = new byte[combined.length - IV_LENGTH];
            System.arraycopy(combined, 0,         iv,         0, IV_LENGTH);
            System.arraycopy(combined, IV_LENGTH, cipherText, 0, cipherText.length);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, new GCMParameterSpec(TAG_BITS, iv));

            byte[] plain = cipher.doFinal(cipherText);
            return new String(plain, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Failed to decrypt API key — the key may be corrupted or the encryption secret changed.", e);
        }
    }

    // ── Utility ───────────────────────────────────────────────────────────────

    /** True if the stored value looks like an AES-GCM encrypted blob (not legacy bytea). */
    public boolean isEncrypted(String stored) {
        if (stored == null || stored.isBlank()) return false;
        try {
            byte[] decoded = Base64.getDecoder().decode(stored);
            return decoded.length > IV_LENGTH; // must have at least IV + some ciphertext
        } catch (Exception e) {
            return false;
        }
    }
}
