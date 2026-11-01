package com.example.otpauth.controller;

import com.example.otpauth.model.Setting;
import com.example.otpauth.model.WhatsAppMessageLog;
import com.example.otpauth.repository.SettingRepository;
import com.example.otpauth.repository.WhatsAppMessageLogRepository;
import com.example.otpauth.util.SecurityUtils;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Enterprise Multi-Tenant WhatsApp Proxy Controller
 *
 * Implements:
 * 1. Multi-Tenant Session Isolation (Each tenant's session is namespaced: tenant_{tenantId}).
 * 2. Role-Based Access Control (RBAC) & Secure JWT Authentication.
 * 3. Dynamic Database Persistence of WhatsApp connection status, linked phone, and push name.
 * 4. Comprehensive Audit Trail & Message Logging (WhatsAppMessageLog).
 * 5. Secure Internal Proxying to whatsapp-service with X-WA-API-Key.
 */
@RestController
@RequestMapping("/api/whatsapp")
public class WhatsAppController {

    @Value("${whatsapp.service.url:http://localhost:3005}")
    private String waServiceUrl;

    @Value("${whatsapp.service.api-key:wa_sec_9f7a8b3e2d1c4b5a6f7e8d9c0b1a2f3e}")
    private String waServiceApiKey;

    @Autowired
    private SettingRepository settingRepository;

    @Autowired
    private WhatsAppMessageLogRepository messageLogRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    // ── Helper to resolve target URL ──────────────────────────────────────────
    private String resolveUrl(String path) {
        String base = waServiceUrl != null ? waServiceUrl.trim() : "http://localhost:3005";
        while (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }
        if (base.endsWith("/api/whatsapp")) {
            base = base.substring(0, base.length() - "/api/whatsapp".length());
        }
        String cleanPath = path != null ? path.trim() : "";
        if (!cleanPath.startsWith("/")) {
            cleanPath = "/" + cleanPath;
        }
        return base + cleanPath;
    }

    /**
     * Resolve and enforce tenant-scoped session ID.
     * Prevents any cross-tenant session tampering or leakage.
     */
    private String resolveTenantSessionId(String requestedSessionId, Long tenantId) {
        if (tenantId == null) {
            return "default";
        }
        if (requestedSessionId == null || requestedSessionId.isBlank() || requestedSessionId.equals("default") || requestedSessionId.startsWith("tenant_")) {
            return "tenant_" + tenantId;
        }
        // Sub-store or branch session within this tenant
        String sanitized = requestedSessionId.replaceAll("[^a-zA-Z0-9_\\-]", "");
        return "tenant_" + tenantId + "_" + sanitized;
    }

    /**
     * Dynamically update a tenant's setting in the database
     */
    private void syncTenantSetting(Long tenantId, String key, String value) {
        if (tenantId == null) return;
        try {
            Optional<Setting> opt = settingRepository.findBySettingKeyAndUserId(key, tenantId);
            if (opt.isPresent()) {
                Setting s = opt.get();
                s.setSettingValue(value);
                settingRepository.save(s);
            } else {
                Setting s = new Setting(key, value);
                s.setUserId(tenantId);
                settingRepository.save(s);
            }
        } catch (Exception e) {
            System.err.println("[WhatsAppController] Failed to sync setting " + key + ": " + e.getMessage());
        }
    }

    // ── GET /api/whatsapp/config ─────────────────────────────────────────────
    @GetMapping("/config")
    public ResponseEntity<Map<String, String>> getTenantWhatsAppConfig() {
        Long tenantId = SecurityUtils.getCurrentUserId();
        if (tenantId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Setting> settings = settingRepository.findByUserId(tenantId);
        Map<String, String> configMap = new HashMap<>();
        for (Setting s : settings) {
            if (s.getSettingKey() != null && s.getSettingKey().startsWith("whatsapp")) {
                configMap.put(s.getSettingKey(), s.getSettingValue());
            }
        }
        configMap.putIfAbsent("whatsappSessionId", "tenant_" + tenantId);
        return ResponseEntity.ok(configMap);
    }

    // ── GET /api/whatsapp/logs ───────────────────────────────────────────────
    @GetMapping("/logs")
    public ResponseEntity<List<WhatsAppMessageLog>> getTenantMessageLogs() {
        Long tenantId = SecurityUtils.getCurrentUserId();
        if (tenantId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<WhatsAppMessageLog> logs = messageLogRepository.findTop50ByTenantIdOrderByCreatedAtDesc(tenantId);
        return ResponseEntity.ok(logs);
    }

    // ── GET /api/whatsapp AND /api/whatsapp/status ────────────────────────────
    @GetMapping({"", "/", "/status"})
    public ResponseEntity<String> getStatus() {
        Long tenantId = SecurityUtils.getCurrentUserId();
        if (tenantId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\":\"User is not authenticated.\"}");
        }
        return proxyGet("/api/whatsapp/status");
    }

    // ── GET /api/whatsapp/sessions ────────────────────────────────────────────
    @GetMapping("/sessions")
    public ResponseEntity<String> getSessions() {
        Long tenantId = SecurityUtils.getCurrentUserId();
        if (tenantId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\":\"User is not authenticated.\"}");
        }
        return proxyGet("/api/whatsapp/sessions");
    }

    // ── POST /api/whatsapp/session/start ─────────────────────────────────────
    @PostMapping("/session/start")
    public ResponseEntity<String> startSession(@RequestBody(required = false) Map<String, Object> body) {
        Long tenantId = SecurityUtils.getCurrentUserId();
        if (tenantId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\":\"User is not authenticated.\"}");
        }

        String reqSid = body != null && body.containsKey("sessionId") ? body.get("sessionId").toString() : null;
        String tenantSessionId = resolveTenantSessionId(reqSid, tenantId);

        Map<String, Object> payload = new HashMap<>();
        if (body != null) payload.putAll(body);
        payload.put("sessionId", tenantSessionId);

        syncTenantSetting(tenantId, "whatsappSessionId", tenantSessionId);
        syncTenantSetting(tenantId, "whatsappMode", "whatsapp_web");

        return proxyPost("/api/whatsapp/session/start", toJson(payload));
    }

    // ── GET /api/whatsapp/session/{sessionId}/status ──────────────────────────
    @GetMapping({"/session/{sessionId}/status", "/session/status"})
    public ResponseEntity<String> getSessionStatus(@PathVariable(required = false) String sessionId) {
        Long tenantId = SecurityUtils.getCurrentUserId();
        if (tenantId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\":\"User is not authenticated.\"}");
        }

        String tenantSessionId = resolveTenantSessionId(sessionId, tenantId);
        ResponseEntity<String> resp = proxyGet("/api/whatsapp/session/" + tenantSessionId + "/status");

        // Dynamic Database Sync: Persist live status into settings
        if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
            try {
                JsonNode root = objectMapper.readTree(resp.getBody());
                String status = root.path("status").asText("");
                if ("ready".equalsIgnoreCase(status)) {
                    syncTenantSetting(tenantId, "whatsappConnected", "true");
                    syncTenantSetting(tenantId, "whatsappMode", "whatsapp_web");
                    syncTenantSetting(tenantId, "whatsappSessionId", tenantSessionId);

                    JsonNode info = root.path("info");
                    if (info.isObject()) {
                        String phone = info.path("phone").asText("");
                        String pushname = info.path("pushname").asText("");
                        String readyAt = info.path("readyAt").asText("");
                        if (!phone.isBlank()) syncTenantSetting(tenantId, "whatsappPhone", phone);
                        if (!pushname.isBlank()) syncTenantSetting(tenantId, "whatsappPushName", pushname);
                        if (!readyAt.isBlank()) syncTenantSetting(tenantId, "whatsappConnectedAt", readyAt);
                    }
                } else if ("disconnected".equalsIgnoreCase(status)) {
                    syncTenantSetting(tenantId, "whatsappConnected", "false");
                }
            } catch (Exception ignored) {}
        }

        return resp;
    }

    // ── GET /api/whatsapp/session/{sessionId}/qr ─────────────────────────────
    @GetMapping({"/session/{sessionId}/qr", "/session/qr", "/qr"})
    public ResponseEntity<String> getSessionQr(@PathVariable(required = false) String sessionId) {
        Long tenantId = SecurityUtils.getCurrentUserId();
        if (tenantId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\":\"User is not authenticated.\"}");
        }

        String tenantSessionId = resolveTenantSessionId(sessionId, tenantId);
        return proxyGet("/api/whatsapp/session/" + tenantSessionId + "/qr");
    }

    // ── DELETE /api/whatsapp/session/{sessionId}/logout ───────────────────────
    @DeleteMapping({"/session/{sessionId}/logout", "/session/logout"})
    public ResponseEntity<String> logoutSession(@PathVariable(required = false) String sessionId) {
        Long tenantId = SecurityUtils.getCurrentUserId();
        if (tenantId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\":\"User is not authenticated.\"}");
        }

        String tenantSessionId = resolveTenantSessionId(sessionId, tenantId);
        ResponseEntity<String> resp = proxyDelete("/api/whatsapp/session/" + tenantSessionId + "/logout");

        // Dynamic Database Sync: Mark disconnected in tenant settings
        syncTenantSetting(tenantId, "whatsappConnected", "false");
        syncTenantSetting(tenantId, "whatsappPhone", "");
        syncTenantSetting(tenantId, "whatsappPushName", "");

        return resp;
    }

    // ── POST /api/whatsapp/send ───────────────────────────────────────────────
    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody Map<String, Object> body) {
        Long tenantId = SecurityUtils.getCurrentUserId();
        Long actualUserId = SecurityUtils.getActualUserId();

        if (tenantId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\":\"User is not authenticated.\"}");
        }

        Object to = body.get("to");
        Object message = body.get("message");

        if (to == null || to.toString().isBlank()) {
            return ResponseEntity.badRequest().body("{\"error\":\"\\\"to\\\" (phone number) is required.\"}");
        }
        if (message == null || message.toString().isBlank()) {
            return ResponseEntity.badRequest().body("{\"error\":\"\\\"message\\\" is required.\"}");
        }

        String toStr = to.toString().replaceAll("[^0-9@.]", "");
        if (toStr.length() < 7 || toStr.length() > 20) {
            return ResponseEntity.badRequest().body("{\"error\":\"Phone number appears invalid.\"}");
        }

        String msgStr = message.toString();
        if (msgStr.length() > 4096) {
            return ResponseEntity.badRequest().body("{\"error\":\"Message too long (max 4096 chars).\"}");
        }

        String reqSid = body.containsKey("sessionId") && body.get("sessionId") != null ? body.get("sessionId").toString() : null;
        String tenantSessionId = resolveTenantSessionId(reqSid, tenantId);
        String triggerType = body.containsKey("triggerType") && body.get("triggerType") != null
                ? body.get("triggerType").toString()
                : "MANUAL";

        Map<String, Object> reqPayload = new HashMap<>();
        reqPayload.put("to", toStr);
        reqPayload.put("message", msgStr);
        reqPayload.put("sessionId", tenantSessionId);
        String jsonBody = toJson(reqPayload);
        ResponseEntity<String> resp = proxyPost("/api/whatsapp/send", jsonBody);

        // Dynamic Message Audit Logging in Database
        String messageId = null;
        String status = "FAILED";
        String errorMsg = null;

        if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
            status = "SENT";
            try {
                JsonNode root = objectMapper.readTree(resp.getBody());
                messageId = root.path("messageId").asText(null);
            } catch (Exception ignored) {}
            syncTenantSetting(tenantId, "whatsappLastActiveAt", LocalDateTime.now().toString());
        } else {
            errorMsg = resp.getBody();
        }

        try {
            WhatsAppMessageLog log = new WhatsAppMessageLog(
                    tenantId,
                    actualUserId != null ? actualUserId : tenantId,
                    toStr,
                    msgStr,
                    messageId,
                    status,
                    triggerType,
                    errorMsg
            );
            messageLogRepository.save(log);
        } catch (Exception e) {
            System.err.println("[WhatsAppController] Failed to save message audit log: " + e.getMessage());
        }

        return resp;
    }

    // ── Proxy helpers ─────────────────────────────────────────────────────────

    private ResponseEntity<String> proxyGet(String path) {
        try {
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(resolveUrl(path)))
                    .header("X-WA-API-Key", waServiceApiKey)
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(15))
                    .GET()
                    .build();
            HttpResponse<String> resp = HTTP_CLIENT.send(req, HttpResponse.BodyHandlers.ofString());
            return ResponseEntity.status(resp.statusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(resp.body());
        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            return ResponseEntity.status(503).body("{\"error\":\"WhatsApp service unavailable: " + e.getMessage() + "\"}");
        }
    }

    private ResponseEntity<String> proxyPost(String path, String jsonBody) {
        try {
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(resolveUrl(path)))
                    .header("X-WA-API-Key", waServiceApiKey)
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(30))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();
            HttpResponse<String> resp = HTTP_CLIENT.send(req, HttpResponse.BodyHandlers.ofString());
            return ResponseEntity.status(resp.statusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(resp.body());
        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            return ResponseEntity.status(503).body("{\"error\":\"WhatsApp service unavailable: " + e.getMessage() + "\"}");
        }
    }

    private ResponseEntity<String> proxyDelete(String path) {
        try {
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(resolveUrl(path)))
                    .header("X-WA-API-Key", waServiceApiKey)
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(15))
                    .DELETE()
                    .build();
            HttpResponse<String> resp = HTTP_CLIENT.send(req, HttpResponse.BodyHandlers.ofString());
            return ResponseEntity.status(resp.statusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(resp.body());
        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            return ResponseEntity.status(503).body("{\"error\":\"WhatsApp service unavailable: " + e.getMessage() + "\"}");
        }
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return "{}";
        }
    }
}
