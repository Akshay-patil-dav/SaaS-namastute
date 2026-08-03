package com.example.otpauth.dto;

import java.time.LocalDateTime;

public class NoteDto {
    private Long id;
    private String content;
    private Long targetUserId;
    private String targetUserName;
    private boolean forAll;
    private LocalDateTime createdAt;

    public NoteDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Long getTargetUserId() { return targetUserId; }
    public void setTargetUserId(Long targetUserId) { this.targetUserId = targetUserId; }

    public String getTargetUserName() { return targetUserName; }
    public void setTargetUserName(String targetUserName) { this.targetUserName = targetUserName; }

    public boolean isForAll() { return forAll; }
    public void setForAll(boolean forAll) { this.forAll = forAll; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
