package com.example.otpauth.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "whatsapp_message_logs", indexes = {
    @Index(name = "idx_wa_tenant", columnList = "tenant_id"),
    @Index(name = "idx_wa_created", columnList = "created_at"),
    @Index(name = "idx_wa_recipient", columnList = "recipient_phone")
})
public class WhatsAppMessageLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(name = "sender_user_id")
    private Long senderUserId;

    @Column(name = "recipient_phone", nullable = false, length = 32)
    private String recipientPhone;

    @Column(name = "message_body", columnDefinition = "TEXT")
    private String messageBody;

    @Column(name = "message_id", length = 128)
    private String messageId;

    @Column(name = "status", nullable = false, length = 32) // "SENT", "FAILED"
    private String status;

    @Column(name = "trigger_type", length = 64) // "POS_RECEIPT", "INVOICE", "KHATA_REMINDER", "TEST_MESSAGE", "MANUAL"
    private String triggerType;

    @Column(name = "error_message", length = 1024)
    private String errorMessage;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public WhatsAppMessageLog() {}

    public WhatsAppMessageLog(Long tenantId, Long senderUserId, String recipientPhone, String messageBody,
                              String messageId, String status, String triggerType, String errorMessage) {
        this.tenantId = tenantId;
        this.senderUserId = senderUserId;
        this.recipientPhone = recipientPhone;
        this.messageBody = messageBody;
        this.messageId = messageId;
        this.status = status;
        this.triggerType = triggerType != null ? triggerType : "MANUAL";
        this.errorMessage = errorMessage;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTenantId() { return tenantId; }
    public void setTenantId(Long tenantId) { this.tenantId = tenantId; }

    public Long getSenderUserId() { return senderUserId; }
    public void setSenderUserId(Long senderUserId) { this.senderUserId = senderUserId; }

    public String getRecipientPhone() { return recipientPhone; }
    public void setRecipientPhone(String recipientPhone) { this.recipientPhone = recipientPhone; }

    public String getMessageBody() { return messageBody; }
    public void setMessageBody(String messageBody) { this.messageBody = messageBody; }

    public String getMessageId() { return messageId; }
    public void setMessageId(String messageId) { this.messageId = messageId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTriggerType() { return triggerType; }
    public void setTriggerType(String triggerType) { this.triggerType = triggerType; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

