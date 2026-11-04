package com.example.otpauth.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import jakarta.annotation.PreDestroy;
import java.io.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Enterprise Process Supervisor & Auto-Launcher for the local WhatsApp Web.js microservice.
 *
 * Automatically detects whether port 3005 is online. If offline in local/dev mode,
 * spawns `whatsapp-service/src/index.js` seamlessly so that the pairing QR code
 * and headless browser engine load immediately without requiring manual terminal commands.
 */
@Service
public class WhatsAppServiceLauncher {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppServiceLauncher.class);

    @Value("${whatsapp.service.url:http://localhost:3005}")
    private String waServiceUrl;

    @Value("${whatsapp.service.auto-start:true}")
    private boolean autoStart;

    private Process processInstance;
    private final AtomicBoolean isStarting = new AtomicBoolean(false);
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofMillis(800))
            .build();

    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {
        if (!autoStart) {
            return;
        }
        // Run health check and auto-start asynchronously so Spring Boot finishes booting immediately
        CompletableFuture.runAsync(() -> {
            try {
                if (isLocalhost(waServiceUrl)) {
                    ensureRunning();
                }
            } catch (Exception e) {
                log.debug("[WhatsAppServiceLauncher] Background startup check completed: {}", e.getMessage());
            }
        });
    }

    /**
     * Checks if the WhatsApp microservice is currently responding with 200 OK
     */
    public boolean isHealthy() {
        try {
            String baseUrl = cleanBaseUrl(waServiceUrl);
            String healthUrl = baseUrl + "/health";
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(healthUrl))
                    .timeout(Duration.ofMillis(1200))
                    .GET()
                    .build();

            HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
            return resp.statusCode() == 200;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Ensure WhatsApp microservice is running. If not, attempts to spawn it.
     * Thread-safe and returns immediately if already healthy or already running.
     */
    public synchronized boolean ensureRunning() {
        if (isHealthy()) {
            return true;
        }

        if (!autoStart || !isLocalhost(waServiceUrl)) {
            return false;
        }

        if (isStarting.get()) {
            // Already an active startup attempt in progress, wait briefly
            return waitForHealth(3000);
        }

        isStarting.set(true);
        try {
            File waDir = resolveWhatsAppServiceDir();
            if (waDir == null || !waDir.exists()) {
                log.warn("[WhatsAppServiceLauncher] Cannot auto-start: 'whatsapp-service' directory not found.");
                return false;
            }

            String nodeCmd = resolveNodeExecutable();
            File indexJs = new File(waDir, "src/index.js");
            if (!indexJs.exists()) {
                indexJs = new File(waDir, "index.js");
            }

            if (!indexJs.exists()) {
                log.warn("[WhatsAppServiceLauncher] Cannot find entry point in {}", waDir.getAbsolutePath());
                return false;
            }

            log.info("[WhatsAppServiceLauncher] Starting local WhatsApp microservice from: {}", waDir.getAbsolutePath());

            ProcessBuilder pb = new ProcessBuilder(nodeCmd, indexJs.getAbsolutePath());
            pb.directory(waDir);
            pb.redirectErrorStream(true);

            // Inherit system environment
            pb.environment().putAll(System.getenv());
            pb.environment().putIfAbsent("PORT", "3005");

            Process proc = pb.start();
            this.processInstance = proc;

            // Stream logs asynchronously to backend logger
            Thread logReader = new Thread(() -> {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(proc.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        log.info("[WhatsApp-Service] {}", line);
                    }
                } catch (IOException ignored) {}
            }, "whatsapp-service-logger");
            logReader.setDaemon(true);
            logReader.start();

            // Register JVM shutdown hook to cleanly terminate the microservice
            Runtime.getRuntime().addShutdownHook(new Thread(this::stopService, "whatsapp-service-shutdown"));

            boolean healthy = waitForHealth(5000);
            if (healthy) {
                log.info("[WhatsAppServiceLauncher] Local WhatsApp engine successfully started and online on port 3005!");
                return true;
            } else {
                log.warn("[WhatsAppServiceLauncher] WhatsApp service was spawned but did not respond to /health in time.");
                return false;
            }

        } catch (Exception e) {
            log.error("[WhatsAppServiceLauncher] Failed to launch WhatsApp microservice: {}", e.getMessage());
            return false;
        } finally {
            isStarting.set(false);
        }
    }

    private boolean waitForHealth(int maxWaitMs) {
        long start = System.currentTimeMillis();
        while (System.currentTimeMillis() - start < maxWaitMs) {
            if (isHealthy()) {
                return true;
            }
            try {
                Thread.sleep(250);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return false;
            }
        }
        return isHealthy();
    }

    private File resolveWhatsAppServiceDir() {
        String customDir = System.getenv("WHATSAPP_SERVICE_DIR");
        if (customDir != null && !customDir.isBlank()) {
            File f = new File(customDir);
            if (f.exists() && f.isDirectory()) return f;
        }

        String userDir = System.getProperty("user.dir", ".");
        File current = new File(userDir);

        File[] candidates = new File[] {
                new File(current, "whatsapp-service"),
                new File(current, "../whatsapp-service"),
                new File(current.getParentFile(), "whatsapp-service"),
                new File(current, "../../whatsapp-service")
        };

        for (File candidate : candidates) {
            try {
                if (candidate.exists() && candidate.isDirectory() && new File(candidate, "package.json").exists()) {
                    return candidate.getCanonicalFile();
                }
            } catch (Exception ignored) {}
        }
        return null;
    }

    private String resolveNodeExecutable() {
        String[] common = new String[] {
                "node",
                "C:\\Program Files\\nodejs\\node.exe",
                "C:\\Program Files (x86)\\nodejs\\node.exe",
                "/usr/bin/node",
                "/usr/local/bin/node"
        };
        for (String c : common) {
            try {
                Process p = new ProcessBuilder(c, "-v").start();
                if (p.waitFor() == 0) {
                    return c;
                }
            } catch (Exception ignored) {}
        }
        return "node";
    }

    private boolean isLocalhost(String url) {
        if (url == null) return false;
        String lower = url.toLowerCase();
        return lower.contains("localhost") || lower.contains("127.0.0.1") || lower.contains("0.0.0.0");
    }

    private String cleanBaseUrl(String url) {
        if (url == null) return "http://localhost:3005";
        String base = url.trim();
        while (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }
        if (base.endsWith("/api/whatsapp")) {
            base = base.substring(0, base.length() - "/api/whatsapp".length());
        }
        return base;
    }

    @PreDestroy
    public void stopService() {
        if (processInstance != null && processInstance.isAlive()) {
            try {
                log.info("[WhatsAppServiceLauncher] Gracefully terminating WhatsApp microservice process...");
                processInstance.destroy();
                processInstance.waitFor(java.util.concurrent.TimeUnit.SECONDS.toMillis(2), java.util.concurrent.TimeUnit.MILLISECONDS);
                if (processInstance.isAlive()) {
                    processInstance.destroyForcibly();
                }
            } catch (Exception ignored) {}
        }
    }
}

