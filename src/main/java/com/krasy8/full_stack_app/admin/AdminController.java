package com.krasy8.full_stack_app.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestParam String firstName,
                                           @RequestParam String lastName,
                                           @RequestParam String username,
                                           @RequestParam String password) {
        adminService.registerAdmin(firstName, lastName, username, password);
        return ResponseEntity.ok("Administrator registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String username, @RequestParam String password) {
        adminService.loginAdmin(username, password);
        return ResponseEntity.ok("Login successful");
    }
}
