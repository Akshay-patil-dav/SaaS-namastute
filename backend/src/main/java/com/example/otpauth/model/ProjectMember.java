package com.example.otpauth.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_members")
public class ProjectMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId; // Main User's ID (Project Owner)

    @Column(name = "member_user_id", nullable = false)
    private Long memberUserId; // The invited user's ID

    @Column(name = "permissions", columnDefinition = "TEXT")
    private String permissions; // JSON string of assigned permissions

    @Column(name = "joined_at", updatable = false)
    private LocalDateTime joinedAt = LocalDateTime.now();

    public ProjectMember() {}

    public ProjectMember(Long projectId, Long memberUserId, String permissions) {
        this.projectId = projectId;
        this.memberUserId = memberUserId;
        this.permissions = permissions;
        this.joinedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public Long getMemberUserId() { return memberUserId; }
    public void setMemberUserId(Long memberUserId) { this.memberUserId = memberUserId; }

    public String getPermissions() { return permissions; }
    public void setPermissions(String permissions) { this.permissions = permissions; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
}
