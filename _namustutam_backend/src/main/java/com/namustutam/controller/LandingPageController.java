package com.namustutam.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/landing-page")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.PUT, RequestMethod.POST, RequestMethod.OPTIONS})
public class LandingPageController {

    private static final String STORAGE_FILE = "landing_page_data.json";
    private Map<String, Object> inMemoryCache = new HashMap<>();

    public LandingPageController() {
        // Attempt to load from local file on startup
        try {
            File file = new File(STORAGE_FILE);
            if (file.exists()) {
                String content = Files.readString(file.toPath(), StandardCharsets.UTF_8);
                // Simple JSON indicator check
                if (content != null && !content.trim().isEmpty()) {
                    inMemoryCache.put("rawJson", content);
                }
            }
        } catch (Exception ignored) {
        }
    }

    @GetMapping
    public ResponseEntity<?> getLandingPageConfig() {
        try {
            File file = new File(STORAGE_FILE);
            if (file.exists()) {
                String content = Files.readString(file.toPath(), StandardCharsets.UTF_8);
                return ResponseEntity.ok()
                        .header("Content-Type", "application/json")
                        .body(content);
            }
        } catch (Exception e) {
            // Fallback to cache or empty
        }

        if (inMemoryCache.containsKey("data")) {
            return ResponseEntity.ok(inMemoryCache.get("data"));
        }

        return ResponseEntity.ok(Map.of("message", "No remote configuration set, using frontend defaults"));
    }

    @PutMapping
    public ResponseEntity<?> saveLandingPageConfig(@RequestBody Map<String, Object> payload) {
        try {
            inMemoryCache.put("data", payload);

            // Serialize simply or via Jackson if on classpath
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(payload);
            Files.writeString(new File(STORAGE_FILE).toPath(), json, StandardCharsets.UTF_8);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Landing page configuration successfully saved to server");
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            inMemoryCache.put("data", payload);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Saved to in-memory state: " + e.getMessage()
            ));
        }
    }
}
