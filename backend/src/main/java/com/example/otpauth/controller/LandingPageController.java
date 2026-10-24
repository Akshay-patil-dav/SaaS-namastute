package com.example.otpauth.controller;

import com.example.otpauth.model.LandingPageConfig;
import com.example.otpauth.repository.LandingPageConfigRepository;
import com.example.otpauth.service.AiChatService;
import com.example.otpauth.service.DatabaseConnectionService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/landing-page")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {
        RequestMethod.GET, RequestMethod.PUT, RequestMethod.POST, RequestMethod.OPTIONS
})
public class LandingPageController {

    private static final Logger log = LoggerFactory.getLogger(LandingPageController.class);
    private static final String CONFIG_KEY = "landing_page";
    private static final String BACKUP_FILE = "landing_page_data_backup.json";

    private final LandingPageConfigRepository landingPageConfigRepository;
    private final DatabaseConnectionService databaseConnectionService;
    private final ObjectMapper objectMapper;
    private final AiChatService aiChatService;

    // Fast in-memory cache as additional resilience layer
    private final Map<String, Object> memoryCache = new HashMap<>();

    public LandingPageController(
            LandingPageConfigRepository landingPageConfigRepository,
            DatabaseConnectionService databaseConnectionService,
            ObjectMapper objectMapper,
            AiChatService aiChatService) {
        this.landingPageConfigRepository = landingPageConfigRepository;
        this.databaseConnectionService = databaseConnectionService;
        this.objectMapper = objectMapper;
        this.aiChatService = aiChatService;
    }

    /**
     * GET /api/landing-page
     * Returns the dynamic landing page configuration. Reads from DB first,
     * seeds from backup JSON if DB record is missing, and falls back gracefully.
     */
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getLandingPageConfig() {
        // 1. Try fetching from Database
        try {
            Optional<LandingPageConfig> record = landingPageConfigRepository.findByConfigKey(CONFIG_KEY);
            if (record.isPresent() && record.get().getContentJson() != null && !record.get().getContentJson().isBlank()) {
                String json = record.get().getContentJson();
                if (json.contains("https://namustutam.com") || json.contains("http://namustutam.com")) {
                    json = json.replace("https://namustutam.com", "http://localhost:4000")
                               .replace("http://namustutam.com", "http://localhost:4000");
                    try {
                        LandingPageConfig cfg = record.get();
                        cfg.setContentJson(json);
                        landingPageConfigRepository.save(cfg);
                    } catch (Exception ignored) {}
                }
                return ResponseEntity.ok()
                        .header("X-Source", "PostgreSQL-Database")
                        .body(json);
            }
        } catch (Exception e) {
            log.warn("[LandingPageController] Database read error, checking backup file: {}", e.getMessage());
        }

        // 2. Try loading from local persistent backup JSON file
        try {
            File backup = new File(BACKUP_FILE);
            if (backup.exists()) {
                String fileContent = Files.readString(backup.toPath(), StandardCharsets.UTF_8);
                if (fileContent != null && !fileContent.isBlank()) {
                    // Seed database asynchronously or synchronously so next reads hit DB
                    try {
                        LandingPageConfig seed = new LandingPageConfig(CONFIG_KEY, fileContent, "AUTO_SEED_BACKUP");
                        landingPageConfigRepository.save(seed);
                        log.info("🌱 [LandingPageController] Auto-seeded database from backup file.");
                    } catch (Exception dbErr) {
                        log.debug("[LandingPageController] Could not seed database from backup: {}", dbErr.getMessage());
                    }

                    return ResponseEntity.ok()
                            .header("X-Source", "Backup-File-Seed")
                            .body(fileContent);
                }
            }
        } catch (Exception e) {
            log.warn("[LandingPageController] Error reading backup file: {}", e.getMessage());
        }

        // 3. Fallback to memory cache
        if (memoryCache.containsKey("data")) {
            return ResponseEntity.ok()
                    .header("X-Source", "Memory-Cache")
                    .body(memoryCache.get("data"));
        }

        // 4. Default message
        return ResponseEntity.ok(Map.of(
                "status", "EMPTY",
                "message", "No server configuration found. UI will use its built-in defaults."
        ));
    }

    /**
     * PUT /api/landing-page or POST /api/landing-page
     * Saves landing page configuration to PostgreSQL database and backup file.
     */
    @RequestMapping(method = {RequestMethod.PUT, RequestMethod.POST})
    public ResponseEntity<?> saveLandingPageConfig(@RequestBody Map<String, Object> payload) {
        Map<String, Object> response = new HashMap<>();
        boolean dbSaved = false;
        boolean fileSaved = false;

        memoryCache.put("data", payload);

        // 1. Serialize payload to JSON
        String jsonPayload = null;
        try {
            jsonPayload = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(payload);
        } catch (Exception e) {
            log.error("[LandingPageController] JSON serialization error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid JSON payload: " + e.getMessage()));
        }

        // 2. Save to PostgreSQL database
        try {
            Optional<LandingPageConfig> existing = landingPageConfigRepository.findByConfigKey(CONFIG_KEY);
            LandingPageConfig config = existing.orElseGet(() -> new LandingPageConfig(CONFIG_KEY, "", "ADMIN"));
            config.setContentJson(jsonPayload);
            config.setUpdatedAt(LocalDateTime.now());
            config.setUpdatedBy("ADMIN_PANEL");
            landingPageConfigRepository.save(config);
            dbSaved = true;
            log.info("💾 [LandingPageController] Landing page configuration saved to PostgreSQL database.");
        } catch (Exception dbEx) {
            log.warn("[LandingPageController] Failed to save to database: {}", dbEx.getMessage());
        }

        // 3. Always save to persistent backup file
        try {
            Files.writeString(new File(BACKUP_FILE).toPath(), jsonPayload, StandardCharsets.UTF_8);
            fileSaved = true;
            log.info("📁 [LandingPageController] Saved backup JSON to: {}", BACKUP_FILE);
        } catch (Exception fileEx) {
            log.warn("[LandingPageController] Failed to write backup file: {}", fileEx.getMessage());
        }

        response.put("success", true);
        response.put("databaseSaved", dbSaved);
        response.put("fileSaved", fileSaved);
        response.put("message", dbSaved
                ? "Configuration successfully saved to PostgreSQL database and backup file!"
                : "Configuration saved to local backup file (Database currently offline).");
        response.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/landing-page/db-status
     * Returns live database connection status and diagnostics for the Admin Panel.
     */
    @GetMapping("/db-status")
    public ResponseEntity<?> getDatabaseStatus() {
        Map<String, Object> health = databaseConnectionService.getDatabaseHealth();
        health.put("backupFileExists", new File(BACKUP_FILE).exists());
        health.put("memoryCached", memoryCache.containsKey("data"));
        return ResponseEntity.ok(health);
    }

    /**
     * POST /api/landing-page/ensure-db
     * Explicit trigger to probe and auto-create the database.
     */
    @PostMapping("/ensure-db")
    public ResponseEntity<?> triggerDatabaseAutoCreate() {
        boolean created = databaseConnectionService.verifyAndCreateDatabase();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "verifiedOrCreated", created,
                "message", created ? "Database verified / created successfully" : "Could not auto-create database"
        ));
    }

    /**
     * Helper to read the current saved chatbot configuration from DB or backup file.
     */
    private Map<String, Object> getSavedChatbotConfig() {
        try {
            Optional<LandingPageConfig> record = landingPageConfigRepository.findByConfigKey(CONFIG_KEY);
            String json = null;
            if (record.isPresent() && record.get().getContentJson() != null && !record.get().getContentJson().isBlank()) {
                json = record.get().getContentJson();
            } else {
                File backup = new File(BACKUP_FILE);
                if (backup.exists()) {
                    json = Files.readString(backup.toPath(), StandardCharsets.UTF_8);
                }
            }
            if (json != null && !json.isBlank()) {
                JsonNode root = objectMapper.readTree(json);
                JsonNode chatbotNode = root.path("chatbot");
                if (chatbotNode.isObject()) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> map = objectMapper.convertValue(chatbotNode, Map.class);
                    return map;
                }
            }
        } catch (Exception e) {
            log.warn("[LandingPageController] Error reading chatbot config: {}", e.getMessage());
        }
        return Collections.emptyMap();
    }

    /**
     * POST /api/landing-page/chat
     * Public proxy endpoint for the website chatbot. Reads the admin-configured
     * provider, model, and API key dynamically so no keys are hardcoded in the frontend.
     */
    @PostMapping("/chat")
    public ResponseEntity<?> handleChatbotMessage(@RequestBody Map<String, Object> payload) {
        Map<String, Object> savedBot = getSavedChatbotConfig();

        String provider = (String) payload.getOrDefault("provider", (String) savedBot.getOrDefault("provider", "groq"));
        String model = (String) payload.getOrDefault("model", (String) savedBot.getOrDefault("model", "openai/gpt-oss-120b"));
        String apiKey = (String) payload.getOrDefault("apiKey", (String) savedBot.getOrDefault("apiKey", ""));
        String systemPrompt = (String) payload.getOrDefault("systemPrompt", (String) savedBot.getOrDefault("systemPrompt", ""));

        if (apiKey == null || apiKey.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "No AI API key is configured. Please enter your API key in the Admin Panel (Admin Studio → AI Chatbot)."
            ));
        }

        @SuppressWarnings("unchecked")
        List<Map<String, String>> rawMessages = (List<Map<String, String>>) payload.get("messages");
        if (rawMessages == null || rawMessages.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No messages provided."));
        }

        List<Map<String, String>> messages = new ArrayList<>();
        boolean hasSystem = rawMessages.stream().anyMatch(m -> "system".equals(m.get("role")));
        if (!hasSystem && systemPrompt != null && !systemPrompt.trim().isEmpty()) {
            messages.add(Map.of("role", "system", "content", systemPrompt.trim()));
        }
        messages.addAll(rawMessages);

        try {
            String reply = aiChatService.callProvider(provider, model, apiKey, messages);
            return ResponseEntity.ok(Map.of(
                "reply", reply,
                "provider", provider,
                "model", model
            ));
        } catch (HttpClientErrorException e) {
            String friendly = aiChatService.parseFriendlyError(e.getResponseBodyAsString(), provider, e.getStatusCode().value());
            log.error("[LandingPageController] AI Chat client error: {}", friendly);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("error", friendly));
        } catch (Exception e) {
            log.error("[LandingPageController] AI Chat error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("error", "AI Error: " + e.getMessage()));
        }
    }

    /**
     * POST /api/landing-page/test-ai
     * Live test connection for the Admin Panel AI configuration tab.
     */
    @PostMapping("/test-ai")
    public ResponseEntity<?> testAiConnection(@RequestBody(required = false) Map<String, String> payload) {
        Map<String, Object> savedBot = getSavedChatbotConfig();

        String provider = payload != null && payload.containsKey("provider") && !payload.get("provider").isBlank()
                ? payload.get("provider")
                : (String) savedBot.getOrDefault("provider", "groq");

        String model = payload != null && payload.containsKey("model") && !payload.get("model").isBlank()
                ? payload.get("model")
                : (String) savedBot.getOrDefault("model", "openai/gpt-oss-120b");

        String apiKey = payload != null && payload.containsKey("apiKey") && !payload.get("apiKey").isBlank()
                ? payload.get("apiKey")
                : (String) savedBot.getOrDefault("apiKey", "");

        Map<String, Object> result = aiChatService.testConnection(provider, model, apiKey);
        return ResponseEntity.ok(result);
    }
}

