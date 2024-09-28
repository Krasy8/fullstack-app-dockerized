package com.krasy8.full_stack_app.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void registerAdmin(String firstName,
                              String lastName,
                              String username,
                              String password) {
        Administrator admin = new Administrator();
        admin.setFirstName(firstName);
        admin.setLastName(lastName);
        admin.setUsername(username);
        admin.setPassword(passwordEncoder.encode(password)); // Hash password
        admin.setCreatedAt(LocalDateTime.now());
        adminRepo.save(admin);
    }

    public Administrator loginAdmin(String username, String password) {
        Administrator admin = adminRepo.findByUsername(username);
        if (admin != null && passwordEncoder.matches(password, admin.getPassword())) {
            return admin; // Login successful
        }
        throw new RuntimeException("Invalid username or password"); // Handle login failure
    }
}
