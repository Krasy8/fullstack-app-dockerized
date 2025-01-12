package com.krasy8.full_stack_app.user;

import com.krasy8.full_stack_app.master.AdminCode;
import com.krasy8.full_stack_app.master.AdminCodeService;
import com.krasy8.full_stack_app.security.Role;
import com.krasy8.full_stack_app.student.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {


    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final AdminCodeService adminCodeService;

    @Autowired
    public UserService(UserRepository userRepo, PasswordEncoder passwordEncoder, AdminCodeService adminCodeService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.adminCodeService = adminCodeService;
    }

    public void registerUser(User user) {

        if (userRepo.existsByEmail(user.getEmail())) {
            throw new BadRequestException(String.format("Email address: %s already in use", user.getEmail()));
        }

        final String adminCode = user.getAdminCode();

        if (adminCode != null) {
            Optional<AdminCode> code = adminCodeService.validateAdminCode(adminCode);
            if (code.isPresent()) {
                user.setRole(Role.ADMIN);
                final Long userId = getNextUserId();
                adminCodeService.assignAdminCodeToUser(code.get(), userId);
            } else {
                throw new BadRequestException(String.format("Invalid admin code: %s", adminCode));
            }
        } else {
            user.setRole(Role.STUDENT);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword())); // Hash password
        //user.setRole(Role.STUDENT);
        user.setAccountNonExpired(true);
        user.setAccountNonLocked(true);
        user.setCredentialsNonExpired(true);
        user.setEnabled(true);
        user.setCreatedAt(LocalDateTime.now());
        userRepo.save(user);
    }

    public User loginUser(String username, String password) {

        User user = (User) loadUserByUsername(username);

        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user; // Login successful
        }
        throw new RuntimeException("Invalid username or password"); // Handle login failure
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepo
                .findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(String.format("Username %s not found", username)));
        validateUser(user);

        return user;
    }

    private void validateUser(User user) {

        if (!user.isAccountNonExpired()) {
            throw new UsernameNotFoundException(String.format("Username %s is expired", user.getUsername()));
        }

        if (!user.isAccountNonLocked()) {
            throw new UsernameNotFoundException(String.format("Username %s is locked", user.getUsername()));
        }

        if (!user.isCredentialsNonExpired()) {
            throw new UsernameNotFoundException(String.format("Username %s is expired", user.getUsername()));
        }

        if (!user.isEnabled()) {
            throw new UsernameNotFoundException(String.format("Username %s is disabled", user.getUsername()));
        }
    }

    public Long getNextUserId() {
        return userRepo.getNextUserId();
    }
}
