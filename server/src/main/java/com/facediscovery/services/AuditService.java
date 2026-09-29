package com.facediscovery.services;

import com.facediscovery.models.AuditLog;
import com.facediscovery.repositories.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(String userId, String action, String outcome, boolean isSecurityEvent) {
        AuditLog audit = new AuditLog(userId, action, outcome, isSecurityEvent);
        auditLogRepository.save(audit);
    }

    public List<AuditLog> getAuditLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }
}
