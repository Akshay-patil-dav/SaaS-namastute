package com.example.otpauth.dto;

public class NoteRequest {
    private String content;
    private Long targetUserId;
    private boolean forAll;

    public NoteRequest() {}

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Long getTargetUserId() { return targetUserId; }
    public void setTargetUserId(Long targetUserId) { this.targetUserId = targetUserId; }

    public boolean isForAll() { return forAll; }
    public void setForAll(boolean forAll) { this.forAll = forAll; }
}
