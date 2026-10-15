package com.example.otpauth.controller;

import com.example.otpauth.model.ProjectInvitation;
import com.example.otpauth.model.ProjectMember;
import com.example.otpauth.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/project")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping("/invite")
    public ResponseEntity<?> inviteUser(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String permissions = request.get("permissions"); // JSON string
            if (email == null || permissions == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email and permissions are required"));
            }
            ProjectInvitation inv = projectService.inviteUser(email, permissions);
            return ResponseEntity.ok(inv);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/invitations")
    public ResponseEntity<List<ProjectInvitation>> getInvitations() {
        return ResponseEntity.ok(projectService.getPendingInvitationsForProject());
    }

    @DeleteMapping("/invitations/{id}")
    public ResponseEntity<?> cancelInvitation(@PathVariable Long id) {
        projectService.cancelInvitation(id);
        return ResponseEntity.ok(Map.of("message", "Invitation cancelled"));
    }

    @GetMapping("/members")
    public ResponseEntity<?> getMembers() {
        return ResponseEntity.ok(projectService.getProjectMembers());
    }

    @PostMapping("/staff")
    public ResponseEntity<?> createStaff(@RequestBody com.example.otpauth.dto.StaffRequest request) {
        try {
            return ResponseEntity.ok(projectService.createStaffMember(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/members/{id}")
    public ResponseEntity<?> updateMember(@PathVariable Long id, @RequestBody com.example.otpauth.dto.StaffRequest request) {
        try {
            return ResponseEntity.ok(projectService.updateStaffMember(id, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/members/{id}/status")
    public ResponseEntity<?> toggleMemberStatus(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(projectService.toggleMemberStatus(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/members/{id}/permissions")
    public ResponseEntity<?> updatePermissions(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String permissions = request.get("permissions");
            if (permissions == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Permissions are required"));
            }
            projectService.updateMemberPermissions(id, permissions);
            return ResponseEntity.ok(Map.of("message", "Permissions updated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/members/{id}")
    public ResponseEntity<?> removeMember(@PathVariable Long id) {
        projectService.removeMember(id);
        return ResponseEntity.ok(Map.of("message", "Member removed"));
    }

    @GetMapping("/invitations/me")
    public ResponseEntity<List<ProjectInvitation>> getMyInvitations() {
        return ResponseEntity.ok(projectService.getMyInvitations());
    }

    @PostMapping("/invite/accept/{token}")
    public ResponseEntity<?> acceptInvitation(@PathVariable String token) {
        boolean ok = projectService.acceptInvitation(token);
        if (ok) {
            return ResponseEntity.ok(Map.of("message", "Invitation accepted successfully", "success", true));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid, expired, or unauthorized invitation link"));
        }
    }

    @PostMapping("/invite/reject/{token}")
    public ResponseEntity<?> rejectInvitation(@PathVariable String token) {
        boolean ok = projectService.rejectInvitation(token);
        if (ok) {
            return ResponseEntity.ok(Map.of("message", "Invitation rejected", "success", true));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to reject invitation"));
        }
    }

    @GetMapping("/my-workspaces")
    public ResponseEntity<?> getMyWorkspaces() {
        return ResponseEntity.ok(projectService.getAcceptedProjects());
    }

    @PostMapping("/switch/{projectId}")
    public ResponseEntity<?> switchActiveWorkspace(@PathVariable Long projectId) {
        try {
            projectService.switchActiveProject(projectId);
            return ResponseEntity.ok(Map.of("message", "Switched active workspace successfully", "activeProjectId", projectId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
