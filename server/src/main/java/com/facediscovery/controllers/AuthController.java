package com.facediscovery.controllers;

import com.facediscovery.models.User;
import com.facediscovery.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        try {
            String name = body.get("name");
            String email = body.get("email");
            String password = body.get("password");

            Map<String, Object> result = authService.register(name, email, password);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage(),
                "code", "REGISTRATION_FAILED"
            ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String password = body.get("password");

            Map<String, Object> result = authService.login(email, password);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of(
                "success", false,
                "message", e.getMessage(),
                "code", "INVALID_CREDENTIALS"
            ));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("success", true, "message", "Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Unauthorized"));
        }

        String userId = (String) auth.getPrincipal();
        User user = authService.getUserById(userId);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "user", Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "isActive", user.isActive()
            )
        ));
    }
}
