package com.example.otpauth.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.List;

/**
 * Manages Server-Sent Event emitters keyed by user email.
 * One user can have multiple browser tabs open, so we maintain a list per email.
 */
@Service
public class NotificationEmitterService {

    // email -> list of active SSE emitters (one per open tab)
    private final Map<String, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

    /**
     * Subscribe a new SSE stream for the given user email.
     */
    public SseEmitter subscribe(String email) {
        // Timeout set to 5 minutes; browser will reconnect automatically
        SseEmitter emitter = new SseEmitter(5 * 60 * 1000L);

        emitters.computeIfAbsent(email, k -> new CopyOnWriteArrayList<>()).add(emitter);

        Runnable cleanup = () -> {
            List<SseEmitter> list = emitters.get(email);
            if (list != null) {
                list.remove(emitter);
                if (list.isEmpty()) {
                    emitters.remove(email);
                }
            }
        };

        emitter.onCompletion(cleanup);
        emitter.onTimeout(cleanup);
        emitter.onError(e -> cleanup.run());

        // Send an initial "connected" heartbeat so the browser confirms the stream
        try {
            emitter.send(SseEmitter.event().name("connected").data("ok"));
        } catch (IOException ignored) {
            cleanup.run();
        }

        return emitter;
    }

    /**
     * Push a real-time invitation notification to the target email.
     * Called by BuilderService whenever a new invitation is generated.
     */
    public void pushInvitation(String targetEmail, Map<String, Object> payload) {
        List<SseEmitter> targets = emitters.get(targetEmail);
        if (targets == null || targets.isEmpty()) return;

        // Convert payload to JSON manually to avoid Jackson dependency issues
        String json = buildJson(payload);

        List<SseEmitter> dead = new CopyOnWriteArrayList<>();
        for (SseEmitter emitter : targets) {
            try {
                emitter.send(SseEmitter.event().name("invitation").data(json));
            } catch (IOException e) {
                dead.add(emitter);
            }
        }
        targets.removeAll(dead);
    }

    /**
     * Broadcast a workspace change event to a specific list of user emails.
     * Called when folders/pages are created, deleted, renamed, or moved.
     * eventType: e.g., "workspace_change"
     * payload: JSON string describing what changed
     */
    public void broadcastWorkspaceChange(java.util.Collection<String> userEmails, String eventType, Map<String, Object> payload) {
        if (userEmails == null || userEmails.isEmpty()) return;
        String json = buildJson(payload);
        for (String email : userEmails) {
            List<SseEmitter> targets = emitters.get(email);
            if (targets == null || targets.isEmpty()) continue;
            List<SseEmitter> dead = new CopyOnWriteArrayList<>();
            for (SseEmitter emitter : targets) {
                try {
                    emitter.send(SseEmitter.event().name(eventType).data(json));
                } catch (IOException e) {
                    dead.add(emitter);
                }
            }
            targets.removeAll(dead);
        }
    }

    /**
     * Push a heartbeat to keep all connections alive.
     * Runs every 25 seconds to prevent proxy/browser timeout (typically 30-120s).
     */
    @Scheduled(fixedDelay = 25000)
    public void heartbeat() {
        emitters.forEach((email, list) -> {
            List<SseEmitter> dead = new CopyOnWriteArrayList<>();
            for (SseEmitter emitter : list) {
                try {
                    emitter.send(SseEmitter.event().name("heartbeat").data("ping"));
                } catch (IOException e) {
                    dead.add(emitter);
                }
            }
            list.removeAll(dead);
        });
    }

    private String buildJson(Map<String, Object> map) {
        StringBuilder sb = new StringBuilder("{");
        map.forEach((k, v) -> {
            if (sb.length() > 1) sb.append(",");
            sb.append("\"").append(k).append("\":");
            if (v instanceof String) {
                sb.append("\"").append(v.toString().replace("\"", "\\\"")).append("\"");
            } else {
                sb.append(v);
            }
        });
        sb.append("}");
        return sb.toString();
    }
}
