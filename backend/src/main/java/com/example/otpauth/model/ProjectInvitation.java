package com.example.otpauth.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_invitations")
public class ProjectInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "inviter_id", nullable = false)
    private Long inviterId; // Main User's ID (Project Owner)

    @Column(name = "invitee_email", nullable = false)
    private String inviteeEmail;

    @Column(name = "permissions", columnDefinition = "TEXT")
    private String permissions; // JSON string of assigned permissions

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ProjectInvitation() {}

    public ProjectInvitation(Long inviterId, String inviteeEmail, String permissions, String token) {
        this.inviterId = inviterId;
        this.inviteeEmail = inviteeEmail;
        this.permissions = permissions;
        this.token = token;
        this.status = "PENDING";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getInviterId() { return inviterId; }
    public void setInviterId(Long inviterId) { this.inviterId = inviterId; }

    public String getInviteeEmail() { return inviteeEmail; }
    public void setInviteeEmail(String inviteeEmail) { this.inviteeEmail = inviteeEmail; }

    public String getPermissions() { return permissions; }
    public void setPermissions(String permissions) { this.permissions = permissions; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
