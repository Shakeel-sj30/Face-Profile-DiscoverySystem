package com.facediscovery.services;

import com.facediscovery.models.User;
import com.facediscovery.repositories.UserRepository;
import com.facediscovery.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuditService auditService;

    public AuthService(UserRepository userRepository, 
                       PasswordEncoder passwordEncoder, 
                       JwtTokenProvider jwtTokenProvider,
                       AuditService auditService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.auditService = auditService;
        
        // Seed default Admin & User if database is empty
        initDefaultUsers();
    }

    private void initDefaultUsers() {
        if (!userRepository.existsByEmail("admin@facediscovery.org")) {
            User admin = new User("System Administrator", "admin@facediscovery.org", passwordEncoder.encode("admin123"), "ADMIN");
            userRepository.save(admin);
        }
        if (!userRepository.existsByEmail("demo@facediscovery.org")) {
            User demo = new User("Demo Researcher", "demo@facediscovery.org", passwordEncoder.encode("demo123"), "USER");
            userRepository.save(demo);
        }
    }

    public Map<String, Object> register(String name, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("User with email '" + email + "' already exists.");
        }

        User newUser = new User(name, email, passwordEncoder.encode(password), "USER");
        userRepository.save(newUser);

        auditService.log(newUser.getId(), "USER_REGISTER", "SUCCESS", false);

        String token = jwtTokenProvider.generateToken(newUser.getId(), newUser.getEmail(), newUser.getRole());

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("token", token);
        resp.put("user", Map.of(
            "id", newUser.getId(),
            "name", newUser.getName(),
            "email", newUser.getEmail(),
            "role", newUser.getRole()
        ));
        return resp;
    }

    public Map<String, Object> login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPasswordHash())) {
            auditService.log(null, "USER_LOGIN_FAILED", "INVALID_CREDENTIALS", true);
            throw new IllegalArgumentException("Invalid email or password.");
        }

        User user = userOpt.get();
        if (!user.isActive()) {
            auditService.log(user.getId(), "USER_LOGIN_BLOCKED", "ACCOUNT_DISABLED", true);
            throw new IllegalStateException("Your account has been deactivated. Contact admin.");
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
        auditService.log(user.getId(), "USER_LOGIN", "SUCCESS", false);

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("token", token);
        resp.put("user", Map.of(
            "id", user.getId(),
            "name", user.getName(),
            "email", user.getEmail(),
            "role", user.getRole()
        ));
        return resp;
    }

    public User getUserById(String id) {
        return userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
