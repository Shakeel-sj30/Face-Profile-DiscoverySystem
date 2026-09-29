package com.facediscovery.services;

import com.facediscovery.models.User;
import com.facediscovery.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final AuditService auditService;

    public AdminService(UserRepository userRepository, AuditService auditService) {
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserStatus(String adminUserId, String targetUserId, boolean isActive) {
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new NoSuchElementException("Target user not found."));

        user.setActive(isActive);
        user.setUpdatedAt(LocalDateTime.now());
        User updated = userRepository.save(user);

        auditService.log(adminUserId, "ADMIN_USER_STATUS_CHANGE", "USER_" + targetUserId + "_ACTIVE_" + isActive, true);

        return updated;
    }
}
