package com.facediscovery.controllers;

import com.facediscovery.models.AuditLog;
import com.facediscovery.models.User;
import com.facediscovery.services.AdminService;
import com.facediscovery.services.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final AuditService auditService;

    public AdminController(AdminService adminService, AuditService auditService) {
        this.adminService = adminService;
        this.auditService = auditService;
    }

    private String getAuthUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (String) auth.getPrincipal();
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(Map.of("success", true, "users", users));
    }

    @PatchMapping("/users/{userId}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable String userId, @RequestBody Map<String, Boolean> body) {
        try {
            String adminId = getAuthUserId();
            boolean isActive = body.getOrDefault("isActive", true);
            User updated = adminService.updateUserStatus(adminId, userId, isActive);
            return ResponseEntity.ok(Map.of("success", true, "user", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<?> getAuditLogs() {
        List<AuditLog> logs = auditService.getAuditLogs();
        return ResponseEntity.ok(Map.of("success", true, "auditLogs", logs));
    }
}
