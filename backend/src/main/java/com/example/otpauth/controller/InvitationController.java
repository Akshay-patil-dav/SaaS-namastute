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

    @GetMapping("/accepted")
    public ResponseEntity<?> getAcceptedProjects() {
        return ResponseEntity.ok(projectService.getAcceptedProjects());
    }

    @PostMapping("/{token}/accept")
    public ResponseEntity<?> acceptInvitation(@PathVariable String token) {
        if (projectService.acceptInvitation(token)) {
            return ResponseEntity.ok(Map.of("message", "Invitation accepted"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Failed to accept invitation"));
    }

    @PostMapping("/{token}/reject")
    public ResponseEntity<?> rejectInvitation(@PathVariable String token) {
        if (projectService.rejectInvitation(token)) {
            return ResponseEntity.ok(Map.of("message", "Invitation rejected"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Failed to reject invitation"));
    }

    @PostMapping("/switch-project/{projectId}")
    public ResponseEntity<?> switchProject(@PathVariable Long projectId) {
        try {
            // Passing 0 or matching actual userId switches back to personal workspace
            projectService.switchActiveProject(projectId == 0 ? null : projectId);
            return ResponseEntity.ok(Map.of("message", "Switched active project"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
