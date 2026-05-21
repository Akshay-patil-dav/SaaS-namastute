package com.example.otpauth.controller;

import com.example.otpauth.model.User;
import com.example.otpauth.model.UserAiSettings;
import com.example.otpauth.repository.UserAiSettingsRepository;
import com.example.otpauth.repository.UserRepository;
import com.example.otpauth.util.AiApiKeyEncryptor;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * AiController — Per-user AI Helper backend.
 *
 * Endpoints (all require valid JWT):
 *   GET    /api/ai/settings       — Return current user's AI config (key masked)
 *   POST   /api/ai/settings       — Save provider, model, and API key (AES-256 encrypted)
 *   DELETE /api/ai/settings/key   — Remove the stored API key
 *   GET    /api/ai/test           — Test the stored key with a live API call
 *   POST   /api/ai/chat           — Proxy chat to the configured AI provider
 *
 * The API key is AES-256-GCM encrypted and stored as a Base64 TEXT column.
 * No binary/bytea data in the database. Decryption happens server-side only,
 * the plaintext key never leaves the server or appears in browser logs.
 */
@RestController
@RequestMapping("/api/ai")
public class AiController {

    private static final Logger log = LoggerFactory.getLogger(AiController.class);

    @Autowired
    private UserAiSettingsRepository aiSettingsRepo;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AiApiKeyEncryptor encryptor;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // 30-second read timeout for AI calls
    private final RestTemplate restTemplate;

    public AiController() {
        org.springframework.http.client.SimpleClientHttpRequestFactory factory =
                new org.springframework.http.client.SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10_000);
        factory.setReadTimeout(45_000);
        this.restTemplate = new RestTemplate(factory);
    }

    // ── Helper: get authenticated user's email from JWT context ─────────────

    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            throw new RuntimeException("Not authenticated");
        }
        return auth.getName(); // Spring Security principal = email
    }

    // ────────────────────────────────────────────────────────────────────────
    // GET /api/ai/settings
    // ────────────────────────────────────────────────────────────────────────

    @GetMapping("/settings")
    public ResponseEntity<Map<String, Object>> getAiSettings() {
        String email = getCurrentUserEmail();
        Optional<UserAiSettings> opt = aiSettingsRepo.findByUserEmail(email);

        Map<String, Object> result = new HashMap<>();
        if (opt.isPresent()) {
            UserAiSettings s = opt.get();
            result.put("provider", s.getAiProvider());
            result.put("model",    s.getAiModel());
            result.put("hasKey",   s.hasKey());
            if (s.hasKey()) {
                try {
                    String key    = encryptor.decrypt(s.getAiApiKeyEnc());
                    int    len    = key.length();
                    String masked = "••••••••" + (len > 4 ? key.substring(len - 4) : key);
                    result.put("maskedKey", masked);
                } catch (Exception e) {
                    result.put("maskedKey", "••••••••");
                }
            } else {
                result.put("maskedKey", "");
            }
        } else {
            result.put("provider",  "openai");
            result.put("model",     "gpt-4o-mini");
            result.put("hasKey",    false);
            result.put("maskedKey", "");
        }
        return ResponseEntity.ok(result);
    }

    // ────────────────────────────────────────────────────────────────────────
    // POST /api/ai/settings
    // ────────────────────────────────────────────────────────────────────────

    @PostMapping("/settings")
    public ResponseEntity<Map<String, Object>> saveAiSettings(@RequestBody Map<String, String> body) {
        String email = getCurrentUserEmail();

        UserAiSettings settings = aiSettingsRepo.findByUserEmail(email).orElseGet(() -> {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            return new UserAiSettings(user);
        });

        if (body.containsKey("provider") && body.get("provider") != null && !body.get("provider").isBlank()) {
            settings.setAiProvider(body.get("provider").trim().toLowerCase());
        }
        if (body.containsKey("model") && body.get("model") != null && !body.get("model").isBlank()) {
            settings.setAiModel(body.get("model").trim());
        }

        String apiKey = body.get("apiKey");
        if (apiKey != null && !apiKey.isBlank()) {
            // 1. Sanitize: strip invisible/whitespace characters
            String cleanKey = sanitizeApiKey(apiKey);
            if (cleanKey.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "The API key appears to be empty after sanitization. Please paste a valid key."));
            }
            // 2. Encrypt with AES-256-GCM and store as Base64 TEXT (no binary columns)
            String encrypted = encryptor.encrypt(cleanKey);
            settings.setAiApiKeyEnc(encrypted);
            log.info("Saved encrypted AI API key for user: {} (provider: {}, model: {}, keyPrefix: {})",
                    email, settings.getAiProvider(), settings.getAiModel(),
                    cleanKey.length() > 8 ? cleanKey.substring(0, 8) + "..." : "***");
        }

        aiSettingsRepo.save(settings);

        Map<String, Object> result = new HashMap<>();
        result.put("success",  true);
        result.put("provider", settings.getAiProvider());
        result.put("model",    settings.getAiModel());
        result.put("hasKey",   settings.hasKey());
        return ResponseEntity.ok(result);
    }

    /**
     * Sanitize an API key by stripping ALL whitespace (spaces, tabs, newlines,
     * carriage returns) and non-printable / zero-width Unicode characters.
     * This handles copy-paste artifacts from browsers and password managers.
     */
    private String sanitizeApiKey(String raw) {
        if (raw == null) return "";
        // Remove all Unicode whitespace and control chars (including zero-width spaces,
        // BOM, non-breaking spaces, etc.) keeping only printable ASCII 0x21–0x7E
        return raw.chars()
                .filter(c -> c >= 0x21 && c <= 0x7E)  // printable ASCII only
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
    }

    // ────────────────────────────────────────────────────────────────────────
    // DELETE /api/ai/settings/key
    // ────────────────────────────────────────────────────────────────────────

    @DeleteMapping("/settings/key")
    public ResponseEntity<Map<String, Object>> removeApiKey() {
        String email = getCurrentUserEmail();
        aiSettingsRepo.findByUserEmail(email).ifPresent(s -> {
            s.setAiApiKeyEnc(null);
            aiSettingsRepo.save(s);
            log.info("Removed AI API key for user: {}", email);
        });
        return ResponseEntity.ok(Map.of("success", true, "hasKey", false));
    }

    // ────────────────────────────────────────────────────────────────────────
    // GET /api/ai/test  —  verify stored key with a lightweight real request
    // ────────────────────────────────────────────────────────────────────────

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testApiKey() {
        String email = getCurrentUserEmail();
        Optional<UserAiSettings> opt = aiSettingsRepo.findByUserEmail(email);

        if (opt.isEmpty() || !opt.get().hasKey()) {
            return ResponseEntity.ok(Map.of(
                "ok",       false,
                "message",  "No API key saved. Please add your API key in Settings → AI Settings."
            ));
        }

        UserAiSettings settings = opt.get();
        String apiKey;
        try {
            apiKey = sanitizeApiKey(encryptor.decrypt(settings.getAiApiKeyEnc()));
        } catch (Exception e) {
            log.error("Failed to decrypt API key for user: {}: {}", email, e.getMessage());
            return ResponseEntity.ok(Map.of(
                "ok", false,
                "message", "Stored key is corrupted or encryption secret changed. Please re-enter it in Settings → AI Settings."
            ));
        }

        String provider = Optional.ofNullable(settings.getAiProvider()).orElse("openai").toLowerCase().trim();
        String model    = Optional.ofNullable(settings.getAiModel()).orElse("gpt-4o-mini").trim();

        log.info("Testing AI key for user: {}, provider: {}, model: {}, keyLen: {}, keyPrefix: {}",
                email, provider, model, apiKey.length(),
                apiKey.length() > 8 ? apiKey.substring(0, 8) + "..." : "***");

        if (apiKey.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "ok", false,
                "message", "Stored key is empty after decryption. Please re-enter it in Settings."
            ));
        }

        // Send a minimal test message
        List<Map<String, String>> testMessages = List.of(
            Map.of("role", "user", "content", "Say the word OK only.")
        );

        try {
            String reply = switch (provider) {
                case "gemini", "google", "google-ai-studio" -> callGemini(apiKey, model, testMessages);
                case "claude", "anthropic"                  -> callClaude(apiKey, model, testMessages);
                case "deepseek"                             -> callDeepSeek(apiKey, model, testMessages);
                case "groq"                                 -> callGroq(apiKey, model, testMessages);
                case "mistral"                              -> callMistral(apiKey, model, testMessages);
                case "openrouter"                           -> callOpenRouter(apiKey, model, testMessages);
                default                                     -> callOpenAI(apiKey, model, testMessages);
            };
            log.info("AI key test PASSED for user: {}, provider: {}, reply: {}", email, provider, reply);
            return ResponseEntity.ok(Map.of(
                "ok",       true,
                "provider", provider,
                "model",    model,
                "message",  "✅ Connection successful! AI Helper is working correctly.",
                "reply",    reply
            ));
        } catch (HttpClientErrorException e) {
            String errBody = e.getResponseBodyAsString();
            log.error("AI key test FAILED for user: {}, provider: {}, status: {}, body: {}",
                    email, provider, e.getStatusCode(), errBody);
            String friendly = parseFriendlyError(errBody, provider, e.getStatusCode().value());
            return ResponseEntity.ok(Map.of(
                "ok",       false,
                "provider", provider,
                "model",    model,
                "status",   e.getStatusCode().value(),
                "message",  friendly
            ));
        } catch (Exception e) {
            log.error("AI key test error for user: {}, provider: {}: {}", email, provider, e.getMessage());
            return ResponseEntity.ok(Map.of(
                "ok",      false,
                "provider", provider,
                "model",    model,
                "message", "Connection error: " + e.getMessage()
            ));
        }
    }

    // ────────────────────────────────────────────────────────────────────────
    // POST /api/ai/chat
    // ────────────────────────────────────────────────────────────────────────

    /**
     * Chat proxy endpoint.
     *
     * Request body:
     *   { "messages": [ { "role": "user"|"assistant"|"system", "content": "..." } ] }
     *
     * Response body (success):
     *   { "reply": "..." }
     *
     * Response body (error):
     *   { "error": "..." }
     */
    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, Object> body) {
        String email = getCurrentUserEmail();

        // 1. Load user's AI settings
        UserAiSettings settings = aiSettingsRepo.findByUserEmail(email).orElse(null);
        if (settings == null || !settings.hasKey()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "No API key configured. Go to Settings → AI Settings → AI Helper to add your key."
            ));
        }

        // 2. Decrypt AES-256-GCM encrypted key and sanitize
        String apiKey;
        try {
            apiKey = sanitizeApiKey(encryptor.decrypt(settings.getAiApiKeyEnc()));
        } catch (Exception e) {
            log.error("Failed to decrypt API key for user {}: {}", email, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Stored API key is corrupted. Please re-enter it in Settings → AI Settings."
            ));
        }
        if (apiKey.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Stored API key appears empty after decryption. Please re-enter it in Settings → AI Settings."
            ));
        }

        String provider = Optional.ofNullable(settings.getAiProvider()).orElse("openai").toLowerCase().trim();
        String model    = Optional.ofNullable(settings.getAiModel()).orElse("gpt-4o-mini").trim();

        log.debug("Chat request for user: {}, provider: {}, model: {}, keyPrefix: {}",
                email, provider, model,
                apiKey.length() > 8 ? apiKey.substring(0, 8) + "..." : "***");

        // 3. Extract messages
        @SuppressWarnings("unchecked")
        List<Map<String, String>> messages = (List<Map<String, String>>) body.get("messages");
        if (messages == null || messages.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No messages provided."));
        }

        // 4. Call the AI provider
        try {
            String reply = switch (provider) {
                case "gemini", "google", "google-ai-studio" -> callGemini(apiKey, model, messages);
                case "claude", "anthropic"                  -> callClaude(apiKey, model, messages);
                case "deepseek"                             -> callDeepSeek(apiKey, model, messages);
                case "groq"                                 -> callGroq(apiKey, model, messages);
                case "mistral"                              -> callMistral(apiKey, model, messages);
                case "openrouter"                           -> callOpenRouter(apiKey, model, messages);
                default                                     -> callOpenAI(apiKey, model, messages);
            };
            return ResponseEntity.ok(Map.of("reply", reply));

        } catch (HttpClientErrorException e) {
            String body2 = e.getResponseBodyAsString();
            log.error("AI API client error for user {}: {} — {}", email, e.getStatusCode(), body2);

            // Parse a friendly error from the AI provider's response
            String friendly = parseFriendlyError(body2, provider, e.getStatusCode().value());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("error", friendly));

        } catch (Exception e) {
            log.error("AI API error for user {}: {}", email, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("error", "AI API error: " + e.getMessage()));
        }
    }

    // ── Parse friendly error from AI provider response ────────────────────

    private String parseFriendlyError(String body, String provider, int status) {
        try {
            JsonNode root    = objectMapper.readTree(body);
            JsonNode errNode = root.path("error");
            String   msg     = errNode.path("message").asText("");
            String   errStatus = errNode.path("status").asText("");

            // Handle Gemini quota / rate-limit (429 RESOURCE_EXHAUSTED)
            if (("gemini".equals(provider) || provider.contains("google"))
                    && (status == 429 || "RESOURCE_EXHAUSTED".equals(errStatus))) {

                // Try to extract retry-after from retryDelay
                String retryIn = "";
                JsonNode details = errNode.path("details");
                if (details.isArray()) {
                    for (JsonNode detail : details) {
                        String retryDelay = detail.path("retryDelay").asText("");
                        if (!retryDelay.isBlank()) {
                            retryIn = " Retry in " + retryDelay + ".";
                            break;
                        }
                    }
                }

                // Check if it's a free-tier limit=0 issue
                boolean freeTierExhausted = msg.contains("free_tier") || msg.contains("Free Tier");
                if (freeTierExhausted) {
                    return "Gemini free-tier quota exhausted for this model (limit = 0 per day).\n"
                         + "→ Switch to 'gemini-1.5-flash' (has 1,500 free requests/day) in Settings → AI Settings.\n"
                         + "→ Or enable billing at console.cloud.google.com to unlock full quota." + retryIn;
                }
                return "Gemini API rate limit reached." + retryIn
                     + " Try switching to 'gemini-1.5-flash' which has a more generous free tier.";
            }

            // Handle 402 Payment Required / Insufficient Balance (DeepSeek, OpenAI)
            if (status == 402 || msg.toLowerCase().contains("insufficient balance")
                               || msg.toLowerCase().contains("insufficient_quota")) {
                if ("deepseek".equals(provider)) {
                    return "DeepSeek account has insufficient balance.\n"
                         + "→ Top up credits at: https://platform.deepseek.com/top_up\n"
                         + "→ Or switch to Google Gemini (free tier) or Claude in Settings → AI Settings.";
                }
                if ("openai".equals(provider)) {
                    return "OpenAI account has exceeded its billing limit or has no credits.\n"
                         + "→ Add credits at: https://platform.openai.com/account/billing\n"
                         + "→ Or switch to Google Gemini (free tier) in Settings → AI Settings.";
                }
                return "API account has insufficient balance or credits. Please top up your account.";
            }

            // Generic provider error messages
            if (!msg.isBlank()) {
                String prefix = switch (provider) {
                    case "gemini", "google", "google-ai-studio" -> "Gemini";
                    case "claude", "anthropic"                   -> "Claude";
                    case "deepseek"                              -> "DeepSeek";
                    default                                      -> "OpenAI";
                };
                return prefix + " error: " + msg;
            }
        } catch (Exception ignored) {}

        if (status == 401) return "Invalid API key. Please check your key in Settings → AI Settings.";
        if (status == 402) return "Insufficient balance. Please top up your AI provider account.";
        if (status == 429) return "Rate limit reached. Please wait a moment and try again, or switch to a different model.";
        if (status == 403) return "API key does not have permission for this model.";
        return "AI provider returned an error (HTTP " + status + "). Please check your API key and model.";
    }

    // ── OpenAI ────────────────────────────────────────────────────────────

    private String callOpenAI(String apiKey, String model, List<Map<String, String>> messages) throws Exception {
        String url = "https://api.openai.com/v1/chat/completions";

        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.put("model", model);
        requestBody.put("max_tokens", 2048);
        requestBody.put("temperature", 0.7);

        ArrayNode msgArray = requestBody.putArray("messages");
        for (Map<String, String> msg : messages) {
            String role    = msg.getOrDefault("role", "user");
            String content = msg.getOrDefault("content", "");
            if (content.isBlank()) continue;
            ObjectNode msgNode = objectMapper.createObjectNode();
            msgNode.put("role",    role);
            msgNode.put("content", content);
            msgArray.add(msgNode);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        JsonNode root = objectMapper.readTree(response.getBody());
        String reply = root.path("choices").get(0).path("message").path("content").asText("").trim();
        if (reply.isEmpty()) throw new RuntimeException("Empty response from OpenAI");
        return reply;
    }

    // ── Google Gemini ─────────────────────────────────────────────────────
    //
    // Uses v1 (stable) REST endpoint.
    // systemInstruction is NOT universally supported across models/versions,
    // so we prepend the system content as the first user turn instead.

    private String callGemini(String apiKey, String model, List<Map<String, String>> messages) throws Exception {
        // Default to gemini-1.5-flash — has a real free tier (1,500 req/day, 15 RPM)
        // gemini-2.0-flash free-tier limit is 0 on many projects
        String geminiModel = (model == null || model.isBlank()) ? "gemini-1.5-flash" : model.trim();

        // URL-encode the API key to handle any special characters safely
        String encodedKey;
        try {
            encodedKey = java.net.URLEncoder.encode(apiKey, "UTF-8");
        } catch (Exception e) {
            encodedKey = apiKey;
        }
        String url = "https://generativelanguage.googleapis.com/v1/models/"
                + geminiModel + ":generateContent?key=" + encodedKey;

        log.debug("Gemini request: model={}, keyLength={}, keyPrefix={}",
                geminiModel, apiKey.length(),
                apiKey.length() > 8 ? apiKey.substring(0, 8) + "..." : "***");

        ObjectNode requestBody = objectMapper.createObjectNode();
        ArrayNode  contents    = requestBody.putArray("contents");

        // Extract system message — prepend it as the first user turn (most compatible approach)
        String systemContent = messages.stream()
                .filter(m -> "system".equals(m.get("role")))
                .map(m -> m.getOrDefault("content", ""))
                .filter(c -> !c.isBlank())
                .findFirst().orElse(null);

        if (systemContent != null) {
            // Add as a user turn so Gemini accepts it without systemInstruction field
            ObjectNode sysNode = objectMapper.createObjectNode();
            sysNode.put("role", "user");
            ObjectNode sysPart = objectMapper.createObjectNode();
            sysPart.put("text", "[System instructions]: " + systemContent);
            sysNode.putArray("parts").add(sysPart);
            contents.add(sysNode);

            // Gemini requires alternating roles, so add a dummy model ack
            ObjectNode ackNode = objectMapper.createObjectNode();
            ackNode.put("role", "model");
            ObjectNode ackPart = objectMapper.createObjectNode();
            ackPart.put("text", "Understood. I'll follow those instructions.");
            ackNode.putArray("parts").add(ackPart);
            contents.add(ackNode);
        }

        // Build conversation turns — must strictly alternate user / model
        String lastRole = systemContent != null ? "model" : null;
        StringBuilder mergedContent = null;
        String        mergedRole    = null;

        for (Map<String, String> msg : messages) {
            String role    = msg.getOrDefault("role", "user");
            String content = msg.getOrDefault("content", "");
            if ("system".equals(role) || content.isBlank()) continue;

            String geminiRole = "assistant".equals(role) ? "model" : "user";

            if (geminiRole.equals(lastRole)) {
                // Merge consecutive same-role messages
                if (mergedContent != null) mergedContent.append("\n").append(content);
                continue;
            }

            // Flush the buffered message
            if (mergedContent != null && mergedRole != null) {
                ObjectNode node = objectMapper.createObjectNode();
                node.put("role", mergedRole);
                ObjectNode part = objectMapper.createObjectNode();
                part.put("text", mergedContent.toString());
                node.putArray("parts").add(part);
                contents.add(node);
            }

            mergedContent = new StringBuilder(content);
            mergedRole    = geminiRole;
            lastRole      = geminiRole;
        }

        // Flush the last buffered message
        if (mergedContent != null && mergedRole != null) {
            ObjectNode node = objectMapper.createObjectNode();
            node.put("role", mergedRole);
            ObjectNode part = objectMapper.createObjectNode();
            part.put("text", mergedContent.toString());
            node.putArray("parts").add(part);
            contents.add(node);
        }

        if (contents.isEmpty()) {
            throw new RuntimeException("No valid messages to send to Gemini.");
        }

        // Gemini requires the last turn to be 'user'
        String finalRole = contents.get(contents.size() - 1).path("role").asText("");
        if (!"user".equals(finalRole)) {
            throw new RuntimeException("Gemini requires the conversation to end with a user message.");
        }

        // Generation config
        ObjectNode genConfig = objectMapper.createObjectNode();
        genConfig.put("maxOutputTokens", 2048);
        genConfig.put("temperature", 0.7);
        requestBody.set("generationConfig", genConfig);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        log.debug("Calling Gemini v1: model={}", geminiModel);
        HttpEntity<String>       request  = new HttpEntity<>(requestBody.toString(), headers);
        ResponseEntity<String>   response = restTemplate.postForEntity(url, request, String.class);

        JsonNode root       = objectMapper.readTree(response.getBody());
        JsonNode candidates = root.path("candidates");
        if (!candidates.isArray() || candidates.isEmpty()) {
            log.error("Gemini empty candidates. Raw response: {}", response.getBody());
            throw new RuntimeException("Gemini returned no response. The model may have blocked the content.");
        }
        String reply = candidates.get(0).path("content").path("parts").get(0).path("text").asText("").trim();
        if (reply.isEmpty()) throw new RuntimeException("Empty text in Gemini response.");
        return reply;
    }


    // ── Anthropic Claude ──────────────────────────────────────────────────

    private String callClaude(String apiKey, String model, List<Map<String, String>> messages) throws Exception {
        String url         = "https://api.anthropic.com/v1/messages";
        String claudeModel = model.isBlank() ? "claude-3-haiku-20240307" : model;

        // Extract system message
        String systemMsg = messages.stream()
                .filter(m -> "system".equals(m.get("role")))
                .map(m -> m.get("content"))
                .filter(c -> c != null && !c.isBlank())
                .findFirst()
                .orElse("You are a helpful AI assistant for a SaaS business management platform called Namastute POS.");

        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.put("model",      claudeModel);
        requestBody.put("max_tokens", 2048);
        requestBody.put("system",     systemMsg);

        // Build messages — Claude requires strict user/assistant alternation
        ArrayNode msgArray = requestBody.putArray("messages");
        String    lastRole = null;
        for (Map<String, String> msg : messages) {
            String role    = msg.getOrDefault("role", "user");
            String content = msg.getOrDefault("content", "");
            if ("system".equals(role) || content.isBlank()) continue;

            // Normalize role
            String claudeRole = "assistant".equals(role) ? "assistant" : "user";
            // Skip same consecutive role
            if (claudeRole.equals(lastRole)) continue;
            lastRole = claudeRole;

            ObjectNode msgNode = objectMapper.createObjectNode();
            msgNode.put("role",    claudeRole);
            msgNode.put("content", content);
            msgArray.add(msgNode);
        }

        // Claude requires the last message to be from user
        if (!"user".equals(lastRole)) {
            throw new RuntimeException("Claude requires the last message to be from the user.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-api-key",            apiKey);
        headers.set("anthropic-version",     "2023-06-01");

        HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        JsonNode root  = objectMapper.readTree(response.getBody());
        String   reply = root.path("content").get(0).path("text").asText("").trim();
        if (reply.isEmpty()) throw new RuntimeException("Empty response from Claude");
        return reply;
    }

    // ── DeepSeek (OpenAI-compatible) ──────────────────────────────────────
    //
    // DeepSeek's API mirrors the OpenAI Chat Completions spec exactly —
    // same JSON structure, just a different base URL and model names.
    // Models: deepseek-chat (V3, fast), deepseek-reasoner (R1, reasoning)

    private String callDeepSeek(String apiKey, String model, List<Map<String, String>> messages) throws Exception {
        String url       = "https://api.deepseek.com/v1/chat/completions";
        String deepModel = (model == null || model.isBlank()) ? "deepseek-chat" : model.trim();

        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.put("model",       deepModel);
        requestBody.put("max_tokens",  2048);
        requestBody.put("temperature", 0.7);

        ArrayNode msgArray = requestBody.putArray("messages");
        for (Map<String, String> msg : messages) {
            String role    = msg.getOrDefault("role", "user");
            String content = msg.getOrDefault("content", "");
            if (content.isBlank()) continue;
            ObjectNode msgNode = objectMapper.createObjectNode();
            msgNode.put("role",    role);
            msgNode.put("content", content);
            msgArray.add(msgNode);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        log.debug("Calling DeepSeek API: model={}", deepModel);
        HttpEntity<String>     request  = new HttpEntity<>(requestBody.toString(), headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        JsonNode root  = objectMapper.readTree(response.getBody());
        String   reply = root.path("choices").get(0).path("message").path("content").asText("").trim();
        if (reply.isEmpty()) throw new RuntimeException("Empty response from DeepSeek");
        return reply;
    }

    // ────────────────────────────────────────────────────────────────────────
    // Free AI Providers (all OpenAI-compatible)
    // ────────────────────────────────────────────────────────────────────────

    /**
     * Shared helper for all OpenAI-compatible APIs.
     * Groq, Mistral, and OpenRouter all use the same request/response format.
     */
    private String callOpenAiCompatible(String apiKey, String model, String baseUrl,
                                        String providerName,
                                        List<Map<String, String>> messages,
                                        Map<String, String> extraHeaders) throws Exception {
        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.put("model",       model);
        requestBody.put("max_tokens",  2048);
        requestBody.put("temperature", 0.7);

        ArrayNode msgArray = requestBody.putArray("messages");
        for (Map<String, String> msg : messages) {
            String role    = msg.getOrDefault("role", "user");
            String content = msg.getOrDefault("content", "");
            if (content.isBlank()) continue;
            ObjectNode msgNode = objectMapper.createObjectNode();
            msgNode.put("role",    role);
            msgNode.put("content", content);
            msgArray.add(msgNode);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        if (extraHeaders != null) {
            extraHeaders.forEach(headers::set);
        }

        log.debug("Calling {} API: model={}", providerName, model);
        HttpEntity<String>     request  = new HttpEntity<>(requestBody.toString(), headers);
        ResponseEntity<String> response = restTemplate.postForEntity(baseUrl, request, String.class);

        JsonNode root  = objectMapper.readTree(response.getBody());
        JsonNode choices = root.path("choices");
        if (!choices.isArray() || choices.isEmpty()) {
            throw new RuntimeException(providerName + " returned no choices. Response: " + response.getBody());
        }
        String reply = choices.get(0).path("message").path("content").asText("").trim();
        if (reply.isEmpty()) throw new RuntimeException("Empty response from " + providerName);
        return reply;
    }

    // ── Groq (100% Free, OpenAI-compatible) ─────────────────────────────────────────
    // No credit card required. Get key at console.groq.com/keys
    // Models: llama-3.3-70b-versatile, mixtral-8x7b-32768, gemma2-9b-it, etc.

    private String callGroq(String apiKey, String model, List<Map<String, String>> messages) throws Exception {
        String groqModel = (model == null || model.isBlank()) ? "llama-3.3-70b-versatile" : model.trim();
        return callOpenAiCompatible(
                apiKey, groqModel,
                "https://api.groq.com/openai/v1/chat/completions",
                "Groq", messages, null);
    }

    // ── Mistral AI (Free trial tier) ─────────────────────────────────────────
    // Get key at console.mistral.ai

    private String callMistral(String apiKey, String model, List<Map<String, String>> messages) throws Exception {
        String mistralModel = (model == null || model.isBlank()) ? "mistral-small-latest" : model.trim();
        return callOpenAiCompatible(
                apiKey, mistralModel,
                "https://api.mistral.ai/v1/chat/completions",
                "Mistral", messages, null);
    }

    // ── OpenRouter (Many free models) ───────────────────────────────────────
    // Get key at openrouter.ai/keys — many models have :free suffix (zero cost)

    private String callOpenRouter(String apiKey, String model, List<Map<String, String>> messages) throws Exception {
        String routerModel = (model == null || model.isBlank())
                ? "meta-llama/llama-3.3-70b-instruct:free" : model.trim();
        // OpenRouter requires HTTP-Referer and X-Title headers
        return callOpenAiCompatible(
                apiKey, routerModel,
                "https://openrouter.ai/api/v1/chat/completions",
                "OpenRouter", messages,
                Map.of(
                    "HTTP-Referer", "https://namastute.app",
                    "X-Title",      "Namastute POS AI Helper"
                ));
    }
}
