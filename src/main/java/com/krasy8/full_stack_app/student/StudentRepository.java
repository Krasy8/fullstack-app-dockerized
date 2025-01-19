package com.krasy8.full_stack_app.student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN " +
            "TRUE ELSE FALSE END " +
            "FROM Student s " +
            "WHERE s.email = ?1")
    Boolean selectEmailExists(String email);

    Student findByEmail(String email);

    @Modifying
    @Transactional
    @Query(
            "UPDATE Student s SET s.firstName = :firstName," +
                    "s.userId = :userId, " +
                    "s.lastName = :lastName, " +
                    "s.username = :username, " +
                    "s.email = :email, " +
                    "s.gender = :gender " +
                    "WHERE s.studentId = :studentId"
    )
    int updateStudent(Long studentId, Long userId, String firstName, String lastName, String username, String email,
                      String gender);
}
