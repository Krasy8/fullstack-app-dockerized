package com.krasy8.full_stack_app.master;

import com.krasy8.full_stack_app.student.exception.AdminCodeNotFoundException;
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

    @Autowired
    public AdminCodeService(AdminCodeRepository adminCodeRepository) {
        this.adminCodeRepository = adminCodeRepository;
    }

    public List<AdminCode> getAllAdminCodes() {
        return adminCodeRepository.findAll();
    }

    // Validate an admin code
    public Optional<AdminCode> validateAdminCode(String code) {
        return adminCodeRepository.findByCodeAndExpirationDateAfter(code, LocalDateTime.now());
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

    public void deleteAdminCode(Long id) {
        if (!adminCodeRepository.existsById(id)) {
            throw new AdminCodeNotFoundException("Admin code id: " + id + " not found");
        }
        adminCodeRepository.deleteById(id);
    }
}
