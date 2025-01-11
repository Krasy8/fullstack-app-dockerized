package com.krasy8.full_stack_app.master;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/master")
public class MasterController {

    private final AdminCodeService adminCodeService;

    @Autowired
    public MasterController(AdminCodeService adminCodeService) {
        this.adminCodeService = adminCodeService;
    }

    @PostMapping("/generate-amin-code")
    @PreAuthorize("hasRole('MASTER')")
    public ResponseEntity<String> generateAdminCode() {
        try {
            String code = adminCodeService.generateAdminCode();
            return ResponseEntity.ok(code);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
