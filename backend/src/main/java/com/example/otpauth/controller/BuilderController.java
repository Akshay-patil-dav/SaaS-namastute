package com.example.otpauth.controller;

import com.example.otpauth.dto.BuilderDto.*;
import com.example.otpauth.service.BuilderService;
import com.example.otpauth.service.NotificationEmitterService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/builder")
public class BuilderController {

    private final BuilderService builderService;
    private final NotificationEmitterService emitterService;

    public BuilderController(BuilderService builderService, NotificationEmitterService emitterService) {
        this.builderService = builderService;
        this.emitterService = emitterService;
    }

    // --- SSE: Real-time notification stream ---
    @GetMapping(value = "/notifications/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamNotifications(Authentication auth) {
        return emitterService.subscribe(auth.getName());
    }


    @GetMapping("/data")
    public ResponseEntity<BuilderDataResponse> getData(Authentication auth) {
        return ResponseEntity.ok(builderService.getBuilderData(auth.getName()));
    }

    @PostMapping("/folders")
    public ResponseEntity<FolderDto> createFolder(@RequestBody CreateFolderRequest request, Authentication auth) {
        return ResponseEntity.ok(builderService.createFolder(auth.getName(), request));
    }

    @PostMapping("/pages")
    public ResponseEntity<PageDto> createPage(@RequestBody CreatePageRequest request, Authentication auth) {
        return ResponseEntity.ok(builderService.createPage(auth.getName(), request));
    }

    @PutMapping("/pages/{pageId}/move")
    public ResponseEntity<?> movePage(
            @PathVariable String pageId,
            @RequestBody java.util.Map<String, String> body,
            Authentication auth) {
        try {
            String targetFolderId = body.get("folderId"); // e.g., "f7"
            builderService.movePage(auth.getName(), "p" + pageId, targetFolderId);
            return ResponseEntity.ok(java.util.Map.of("message", "Page moved"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/pages/{pageId}/blocks")
    public ResponseEntity<List<PageBlockDto>> getPageBlocks(@PathVariable String pageId, Authentication auth) {
        return ResponseEntity.ok(builderService.getPageBlocks(auth.getName(), pageId));
    }

    @PutMapping("/pages/{pageId}/blocks")
    public ResponseEntity<?> savePageBlocks(@PathVariable String pageId, @RequestBody List<PageBlockDto> blocks, Authentication auth) {
        builderService.savePageBlocks(auth.getName(), pageId, blocks);
        return ResponseEntity.ok().build();
    }

    // --- COLLABORATION APIs ---

    @PostMapping("/folders/{folderId}/invite")
    public ResponseEntity<?> sendInvite(@PathVariable String folderId, @RequestBody java.util.Map<String, String> payload, Authentication auth) {
        String targetEmail = payload.get("email");
        String token = builderService.generateInviteToken(auth.getName(), folderId, targetEmail);
        return ResponseEntity.ok(java.util.Map.of("message", "Invitation generated", "token", token));
    }

    @PostMapping("/invite/accept/{token}")
    public ResponseEntity<?> acceptInvite(@PathVariable String token, Authentication auth) {
        builderService.acceptInvite(auth.getName(), token);
        return ResponseEntity.ok().build();
    }

    // --- NOTIFICATION CENTER ---

    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(Authentication auth) {
        return ResponseEntity.ok(builderService.getNotifications(auth.getName()));
    }

    @PostMapping("/notifications/{id}/accept")
    public ResponseEntity<?> acceptNotification(@PathVariable Long id, Authentication auth) {
        builderService.acceptInviteById(auth.getName(), id);
        return ResponseEntity.ok(java.util.Map.of("message", "Accepted"));
    }

    @PostMapping("/notifications/{id}/reject")
    public ResponseEntity<?> rejectNotification(@PathVariable Long id, Authentication auth) {
        builderService.rejectInvite(auth.getName(), id);
        return ResponseEntity.ok(java.util.Map.of("message", "Rejected"));
    }

    // --- ICON UPDATE ENDPOINTS ---

    @PutMapping("/folders/{folderId}/icon")
    public ResponseEntity<?> updateFolderIcon(@PathVariable String folderId, @RequestBody UpdateIconRequest request, Authentication auth) {
        try {
            builderService.updateFolderIcon(auth.getName(), "f" + folderId, request.icon);
            return ResponseEntity.ok(java.util.Map.of("message", "Folder icon updated", "icon", request.icon));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/pages/{pageId}/icon")
    public ResponseEntity<?> updatePageIcon(@PathVariable String pageId, @RequestBody UpdateIconRequest request, Authentication auth) {
        try {
            builderService.updatePageIcon(auth.getName(), "p" + pageId, request.icon);
            return ResponseEntity.ok(java.util.Map.of("message", "Page icon updated", "icon", request.icon));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(java.util.Map.of("error", e.getMessage()));
        }
    }

    // --- DELETE ---

    @DeleteMapping("/folders/{folderId}")
    public ResponseEntity<?> deleteFolder(@PathVariable String folderId, Authentication auth) {
        try {
            builderService.deleteFolder(auth.getName(), "f" + folderId);
            return ResponseEntity.ok(java.util.Map.of("message", "Folder deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/pages/{pageId}")
    public ResponseEntity<?> deletePage(@PathVariable String pageId, Authentication auth) {
        try {
            builderService.deletePage(auth.getName(), "p" + pageId);
            return ResponseEntity.ok(java.util.Map.of("message", "Page deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(java.util.Map.of("error", e.getMessage()));
        }
    }
}
