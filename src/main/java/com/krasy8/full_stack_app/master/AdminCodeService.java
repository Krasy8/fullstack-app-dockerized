package com.krasy8.full_stack_app.master;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AdminCodeService {

    private final AdminCodeRepository adminCodeRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminCodeService(AdminCodeRepository adminCodeRepository, PasswordEncoder passwordEncoder) {
        this.adminCodeRepository = adminCodeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<AdminCode> getAllAdminCodes() {
        return adminCodeRepository.findAll();
    }

    // Validate an admin code
    public Optional<AdminCode> validateAdminCode(String code) {
        String hashedCode = passwordEncoder.encode(code);
        return adminCodeRepository.findByCodeAndExpirationDateAfter(hashedCode, LocalDateTime.now());
    }

    // Assign an admin code to a user
    public void assignAdminCodeToUser(AdminCode adminCode, Long userId) {
        adminCode.setUserId(userId);
        adminCode.setUsedAt(LocalDateTime.now());
        adminCodeRepository.save(adminCode);
    }

    // Cleanup expired codes
    public void cleanupExpiredCodes() {
        adminCodeRepository.deleteByExpirationDateBefore(LocalDateTime.now());
    }

    // Create a new admin code
    public String generateAdminCode() {
        final String uuid = UUID.randomUUID().toString();
        final String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        final String code = uuid + "-" + timestamp;
        AdminCode adminCode = new AdminCode();
        adminCode.setCode(code);
        adminCode.setExpirationDate(LocalDateTime.now().plusDays(7));
        adminCodeRepository.save(adminCode);
        return code;
    }
}
