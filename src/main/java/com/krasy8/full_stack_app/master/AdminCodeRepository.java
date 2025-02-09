package com.krasy8.full_stack_app.master;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface AdminCodeRepository extends JpaRepository<AdminCode, Long> {

    // Custom query to find by hashed code and check if not expired
    Optional<AdminCode> findByCodeAndExpirationDateAfter(String hashedCode, LocalDateTime currentDate);

    // Delete all expired admin codes
    void deleteByExpirationDateBefore(LocalDateTime currentDate);
}
