package com.example.otpauth.controller;

import com.example.otpauth.model.ProjectInvitation;
import com.example.otpauth.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invitations")
public class InvitationController {

    private final ProjectService projectService;

    public InvitationController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<ProjectInvitation>> getMyInvitations() {
        return ResponseEntity.ok(projectService.getMyInvitations());
    }

    @PostMapping("/{token}/accept")
    public ResponseEntity<?> accept(@PathVariable String token) {
        boolean ok = projectService.acceptInvitation(token);
        if (ok) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Invitation accepted successfully"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired invitation token"));
        }
    }

    @PostMapping("/{token}/reject")
    public ResponseEntity<?> reject(@PathVariable String token) {
        boolean ok = projectService.rejectInvitation(token);
        if (ok) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Invitation rejected"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to reject invitation"));
        }
    }
}
