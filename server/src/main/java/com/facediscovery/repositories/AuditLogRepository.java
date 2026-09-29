package com.facediscovery.repositories;

import com.facediscovery.models.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AuditLogRepository extends MongoRepository<AuditLog, String> {
    List<AuditLog> findAllByOrderByTimestampDesc();
}
