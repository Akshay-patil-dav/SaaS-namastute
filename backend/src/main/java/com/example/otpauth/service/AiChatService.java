package com.example.otpauth.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * AiChatService — Central service for executing and testing AI completions
 * across multiple AI providers (Groq, Google Gemini, OpenAI, Claude, Mistral, OpenRouter, DeepSeek).
 *
 * Used by both:
 *  1. LandingPageController (/api/landing-page/chat, /api/landing-page/test-ai)
 *  2. AiController (/api/ai/chat, /api/ai/test)
 */
@Service
public class AiChatService {

    private static final Logger log = LoggerFactory.getLogger(AiChatService.class);

    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    public AiChatService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10_000);
        factory.setReadTimeout(45_000);
        this.restTemplate = new RestTemplate(factory);
    }

    /**
     * Sanitize an API key by stripping ALL whitespace and invisible control characters.
     */
    public String sanitizeApiKey(String raw) {
        if (raw == null) return "";
        return raw.chars()
                .filter(c -> c >= 0x21 && c <= 0x7E)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
    }

    /**
     * Dispatch a chat completion to the appropriate AI provider.
     */
    public String callProvider(String provider, String model, String rawApiKey, List<Map<String, String>> messages) throws Exception {
        String apiKey = sanitizeApiKey(rawApiKey);
        if (apiKey.isEmpty()) {
            throw new IllegalArgumentException("API key is empty or invalid after sanitization.");
        }

        String p = (provider == null || provider.isBlank()) ? "groq" : provider.trim().toLowerCase();
        String m = (model == null || model.isBlank()) ? getDefaultModelForProvider(p) : model.trim();

        log.info("Dispatching AI call to provider: '{}', model: '{}', keyPrefix: '{}...'",
                p, m, apiKey.length() > 6 ? apiKey.substring(0, 6) : "***");

        return switch (p) {
            case "gemini", "google", "google-ai-studio" -> callGemini(apiKey, m, messages);
            case "claude", "anthropic"                  -> callClaude(apiKey, m, messages);
            case "deepseek"                             -> callDeepSeek(apiKey, m, messages);
            case "groq"                                 -> callGroq(apiKey, m, messages);
            case "mistral"                              -> callMistral(apiKey, m, messages);
            case "openrouter"                           -> callOpenRouter(apiKey, m, messages);
            default                                     -> callOpenAI(apiKey, m, messages);
        };
    }

    /**
     * Lightweight test connection to verify if the provided API key and model work.
     */
    public Map<String, Object> testConnection(String provider, String model, String rawApiKey) {
        String apiKey = sanitizeApiKey(rawApiKey);
        String p = (provider == null || provider.isBlank()) ? "groq" : provider.trim().toLowerCase();
        String m = (model == null || model.isBlank()) ? getDefaultModelForProvider(p) : model.trim();

        if (apiKey.isEmpty()) {
            return Map.of(
                "ok", false,
                "provider", p,
                "model", m,
                "message", "API key is required. Please paste your " + p.toUpperCase() + " API key."
            );
        }

        List<Map<String, String>> testMessages = List.of(
            Map.of("role", "user", "content", "Reply with only the word OK.")
        );

        long start = System.currentTimeMillis();
        try {
            String reply = callProvider(p, m, apiKey, testMessages);
            long duration = System.currentTimeMillis() - start;
            log.info("AI Test Connection PASSED: provider={}, model={}, time={}ms, reply='{}'", p, m, duration, reply);

            return Map.of(
                "ok", true,
                "provider", p,
                "model", m,
                "latencyMs", duration,
                "reply", reply,
                "message", "✅ Connection successful! " + p.toUpperCase() + " (" + m + ") is working properly (" + duration + "ms)."
            );
        } catch (HttpClientErrorException e) {
            String errBody = e.getResponseBodyAsString();
            log.error("AI Test FAILED: provider={}, status={}, body={}", p, e.getStatusCode(), errBody);
            String friendly = parseFriendlyError(errBody, p, e.getStatusCode().value());
            return Map.of(
                "ok", false,
                "provider", p,
                "model", m,
                "status", e.getStatusCode().value(),
                "message", friendly
            );
        } catch (Exception e) {
            log.error("AI Test Error: provider={}, error={}", p, e.getMessage());
            return Map.of(
                "ok", false,
                "provider", p,
                "model", m,
                "message", "Connection error: " + e.getMessage()
            );
        }
    }

    public String getDefaultModelForProvider(String provider) {
        if (provider == null) return "openai/gpt-oss-120b";
        return switch (provider.toLowerCase().trim()) {
            case "gemini", "google", "google-ai-studio" -> "gemini-1.5-flash";
            case "claude", "anthropic"                  -> "claude-3-haiku-20240307";
            case "deepseek"                             -> "deepseek-chat";
            case "mistral"                              -> "mistral-small-latest";
            case "openrouter"                           -> "meta-llama/llama-3.3-70b-instruct:free";
            case "openai"                               -> "gpt-4o-mini";
            default                                     -> "openai/gpt-oss-120b";
        };
    }

    // ── Groq ─────────────────────────────────────────────────────────────────
    private String callGroq(String apiKey, String model, List<Map<String, String>> messages) throws Exception {
        String groqModel = (model == null || model.isBlank()) ? "openai/gpt-oss-120b" : model.trim();
        try {
            return callOpenAiCompatible(apiKey, groqModel, "https://api.groq.com/openai/v1/chat/completions", "Groq", messages, null);
        } catch (HttpClientErrorException e) {
            String errBody = e.getResponseBodyAsString();
            if (errBody != null && (errBody.contains("does not exist") || errBody.contains("model_not_found") || e.getStatusCode().value() == 404)) {
                log.warn("[AiChatService] Groq model '{}' not active on this key. Auto-recovering with 'openai/gpt-oss-120b'...", groqModel);
                return callOpenAiCompatible(apiKey, "openai/gpt-oss-120b", "https://api.groq.com/openai/v1/chat/completions", "Groq", messages, null);
            }
            throw e;
        }
    }

    // ── Google Gemini ────────────────────────────────────────────────────────
    private String callGemini(String apiKey, String model, List<Map<String, String>> messages) throws Exception {
        String geminiModel = (model == null || model.isBlank()) ? "gemini-1.5-flash" : model.trim();
        String encodedKey = URLEncoder.encode(apiKey, StandardCharsets.UTF_8);
        String url = "https://generativelanguage.googleapis.com/v1/models/" + geminiModel + ":generateContent?key=" + encodedKey;

        ObjectNode requestBody = objectMapper.createObjectNode();
        ArrayNode contents = requestBody.putArray("contents");

        // Extract system message
        String systemContent = messages.stream()
                .filter(m -> "system".equals(m.get("role")))
                .map(m -> m.getOrDefault("content", ""))
                .filter(c -> !c.isBlank())
                .findFirst().orElse(null);

        if (systemContent != null) {
            ObjectNode sysNode = objectMapper.createObjectNode();
            sysNode.put("role", "user");
            ObjectNode sysPart = objectMapper.createObjectNode();
            sysPart.put("text", "[System instructions]: " + systemContent);
            sysNode.putArray("parts").add(sysPart);
            contents.add(sysNode);

            ObjectNode ackNode = objectMapper.createObjectNode();
            ackNode.put("role", "model");
            ObjectNode ackPart = objectMapper.createObjectNode();
            ackPart.put("text", "Understood. I will follow these instructions as the AI assistant.");
            ackNode.putArray("parts").add(ackPart);
            contents.add(ackNode);
        }

        // Build alternating conversation turns
        String lastRole = systemContent != null ? "model" : null;
        StringBuilder mergedContent = null;
        String mergedRole = null;

        for (Map<String, String> msg : messages) {
            String role = msg.getOrDefault("role", "user");
            String content = msg.getOrDefault("content", "");
            if ("system".equals(role) || content.isBlank()) continue;

            String geminiRole = "assistant".equals(role) ? "model" : "user";
            if (geminiRole.equals(lastRole)) {
                if (mergedContent != null) mergedContent.append("\n").append(content);
                continue;
            }

            if (mergedContent != null && mergedRole != null) {
                ObjectNode node = objectMapper.createObjectNode();
                node.put("role", mergedRole);
                ObjectNode part = objectMapper.createObjectNode();
                part.put("text", mergedContent.toString());
                node.putArray("parts").add(part);
                contents.add(node);
            }

            mergedContent = new StringBuilder(content);
            mergedRole = geminiRole;
            lastRole = geminiRole;
        }

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

        // Gemini requires the conversation to end with a user message
        String finalRole = contents.get(contents.size() - 1).path("role").asText("");
        if (!"user".equals(finalRole)) {
            ObjectNode uNode = objectMapper.createObjectNode();
            uNode.put("role", "user");
            ObjectNode uPart = objectMapper.createObjectNode();
            uPart.put("text", "Please assist me.");
            uNode.putArray("parts").add(uPart);
            contents.add(uNode);
        }

        ObjectNode genConfig = objectMapper.createObjectNode();
        genConfig.put("maxOutputTokens", 2048);
        genConfig.put("temperature", 0.7);
        requestBody.set("generationConfig", genConfig);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        JsonNode root = objectMapper.readTree(response.getBody());
        JsonNode candidates = root.path("candidates");
        if (!candidates.isArray() || candidates.isEmpty()) {
            throw new RuntimeException("Gemini returned no response choices.");
        }
        String reply = candidates.get(0).path("content").path("parts").get(0).path("text").asText("").trim();
        if (reply.isEmpty()) throw new RuntimeException("Empty response received from Gemini.");
        return reply;
    }

    // ── OpenAI ───────────────────────────────────────────────────────────────
    private String callOpenAI(String apiKey, String model, List<Map<String, String>> messages) throws Exception {
        String openAiModel = (model == null || model.isBlank()) ? "gpt-4o-mini" : model.trim();
        return callOpenAiCompatible(apiKey, openAiModel, "https://api.openai.com/v1/chat/completions", "OpenAI", messages, null);
    }

    // ── Anthropic Claude ─────────────────────────────────────────────────────
    private String callClaude(String apiKey, String model, List<Map<String, String>> messages) throws Exception {
        String url = "https://api.anthropic.com/v1/messages";
        String claudeModel = (model == null || model.isBlank()) ? "claude-3-haiku-20240307" : model.trim();

        String systemMsg = messages.stream()
                .filter(m -> "system".equals(m.get("role")))
                .map(m -> m.get("content"))
                .filter(c -> c != null && !c.isBlank())
                .findFirst()
                .orElse("You are a helpful AI assistant.");

        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.put("model", claudeModel);
        requestBody.put("max_tokens", 2048);
        requestBody.put("system", systemMsg);

        ArrayNode msgArray = requestBody.putArray("messages");
        String lastRole = null;
        for (Map<String, String> msg : messages) {
            String role = msg.getOrDefault("role", "user");
            String content = msg.getOrDefault("content", "");
            if ("system".equals(role) || content.isBlank()) continue;

            String claudeRole = "assistant".equals(role) ? "assistant" : "user";
            if (claudeRole.equals(lastRole)) continue;
            lastRole = claudeRole;

            ObjectNode msgNode = objectMapper.createObjectNode();
            msgNode.put("role", claudeRole);
            msgNode.put("content", content);
            msgArray.add(msgNode);
        }

        if (!"user".equals(lastRole)) {
            ObjectNode uNode = objectMapper.createObjectNode();
            uNode.put("role", "user");
            uNode.put("content", "Please proceed.");
            msgArray.add(uNode);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-api-key", apiKey);
        headers.set("anthropic-version", "2023-06-01");

        HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        JsonNode root = objectMapper.readTree(response.getBody());
        String reply = root.path("content").get(0).path("text").asText("").trim();
        if (reply.isEmpty()) throw new RuntimeException("Empty response from Claude.");
        return reply;
    }

    // ── Mistral AI ───────────────────────────────────────────────────────────
    private String callMistral(String apiKey, String model, List<Map<String, String>> messages) throws Exception {
        String mistralModel = (model == null || model.isBlank()) ? "mistral-small-latest" : model.trim();
        return callOpenAiCompatible(apiKey, mistralModel, "https://api.mistral.ai/v1/chat/completions", "Mistral", messages, null);
    }

    // ── OpenRouter ───────────────────────────────────────────────────────────
    private String callOpenRouter(String apiKey, String model, List<Map<String, String>> messages) throws Exception {
        String routerModel = (model == null || model.isBlank()) ? "meta-llama/llama-3.3-70b-instruct:free" : model.trim();
        return callOpenAiCompatible(
                apiKey, routerModel,
                "https://openrouter.ai/api/v1/chat/completions",
                "OpenRouter", messages,
                Map.of("HTTP-Referer", "https://namustutam.com", "X-Title", "Namustutam AI")
        );
    }

    // ── DeepSeek ─────────────────────────────────────────────────────────────
    private String callDeepSeek(String apiKey, String model, List<Map<String, String>> messages) throws Exception {
        String deepModel = (model == null || model.isBlank()) ? "deepseek-chat" : model.trim();
        return callOpenAiCompatible(apiKey, deepModel, "https://api.deepseek.com/v1/chat/completions", "DeepSeek", messages, null);
    }

    // ── Shared OpenAI-compatible executor ─────────────────────────────────────
    private String callOpenAiCompatible(String apiKey, String model, String baseUrl,
                                        String providerName,
                                        List<Map<String, String>> messages,
                                        Map<String, String> extraHeaders) throws Exception {
        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.put("model", model);
        requestBody.put("max_tokens", 2048);
        requestBody.put("temperature", 0.7);

        ArrayNode msgArray = requestBody.putArray("messages");
        for (Map<String, String> msg : messages) {
            String role = msg.getOrDefault("role", "user");
            String content = msg.getOrDefault("content", "");
            if (content.isBlank()) continue;

            ObjectNode msgNode = objectMapper.createObjectNode();
            msgNode.put("role", role);
            msgNode.put("content", content);
            msgArray.add(msgNode);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        if (extraHeaders != null) {
            extraHeaders.forEach(headers::set);
        }

        HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);
        ResponseEntity<String> response = restTemplate.postForEntity(baseUrl, request, String.class);

        JsonNode root = objectMapper.readTree(response.getBody());
        JsonNode choices = root.path("choices");
        if (!choices.isArray() || choices.isEmpty()) {
            throw new RuntimeException(providerName + " returned no choices. Response: " + response.getBody());
        }
        String reply = choices.get(0).path("message").path("content").asText("").trim();
        if (reply.isEmpty()) throw new RuntimeException("Empty response from " + providerName);
        return reply;
    }

    /**
     * User-friendly error message parser for provider errors.
     */
    public String parseFriendlyError(String body, String provider, int status) {
        try {
            JsonNode root = objectMapper.readTree(body);
            JsonNode errNode = root.path("error");
            String msg = errNode.path("message").asText("");
            String errStatus = errNode.path("status").asText("");

            if (status == 401) {
                return "Invalid " + provider.toUpperCase() + " API key. Please verify your API key in Admin Studio -> AI Chatbot.";
            }

            if (status == 429) {
                return "Rate limit reached on " + provider.toUpperCase() + ". Please wait a moment or switch models in Admin Studio.";
            }

            if (!msg.isBlank()) {
                return provider.toUpperCase() + " error: " + msg;
            }
        } catch (Exception ignored) {}

        return "AI provider (" + provider + ") returned error HTTP " + status + ". Please check your API key and model.";
    }
}
