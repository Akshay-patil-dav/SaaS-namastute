package com.example.otpauth.repository;

import com.example.otpauth.model.WhatsAppMessageLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WhatsAppMessageLogRepository extends JpaRepository<WhatsAppMessageLog, Long> {
    List<WhatsAppMessageLog> findTop50ByTenantIdOrderByCreatedAtDesc(Long tenantId);
    long countByTenantIdAndStatus(Long tenantId, String status);
}

