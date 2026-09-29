package com.facediscovery.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "Searches")
public class Search {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String status; // "PROCESSING", "COMPLETED", "FAILED"

    private String queryImageBase64;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime completedAt;

    private Long processingTimeMs;

    private LocalDateTime retentionExpiry;

    public Search() {
        this.id = UUID.randomUUID().toString();
    }

    public Search(String userId, String queryImageBase64) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.queryImageBase64 = queryImageBase64;
        this.status = "PROCESSING";
        this.createdAt = LocalDateTime.now();
        this.retentionExpiry = LocalDateTime.now().plusDays(7);
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getQueryImageBase64() { return queryImageBase64; }
    public void setQueryImageBase64(String queryImageBase64) { this.queryImageBase64 = queryImageBase64; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public Long getProcessingTimeMs() { return processingTimeMs; }
    public void setProcessingTimeMs(Long processingTimeMs) { this.processingTimeMs = processingTimeMs; }

    public LocalDateTime getRetentionExpiry() { return retentionExpiry; }
    public void setRetentionExpiry(LocalDateTime retentionExpiry) { this.retentionExpiry = retentionExpiry; }
}
