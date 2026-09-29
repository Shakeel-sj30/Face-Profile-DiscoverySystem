package com.facediscovery.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "AuditLogs")
public class AuditLog {

    @Id
    private String id;

    private String userId;

    private String action;

    private LocalDateTime timestamp = LocalDateTime.now();

    private String requestId;

    private String outcome;

    private boolean securityEvent;

    public AuditLog() {
        this.id = UUID.randomUUID().toString();
    }

    public AuditLog(String userId, String action, String outcome, boolean securityEvent) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.action = action;
        this.outcome = outcome;
        this.securityEvent = securityEvent;
        this.timestamp = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public String getOutcome() { return outcome; }
    public void setOutcome(String outcome) { this.outcome = outcome; }

    public boolean isSecurityEvent() { return securityEvent; }
    public void setSecurityEvent(boolean securityEvent) { this.securityEvent = securityEvent; }
}
