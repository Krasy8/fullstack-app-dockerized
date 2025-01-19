package com.krasy8.full_stack_app.student;

import com.krasy8.full_stack_app.student.exception.StudentNotFoundException;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import com.krasy8.full_stack_app.student.exception.BadRequestException;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class StudentService {

    private final StudentRepository repository;

    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    public void addStudent(Student student) {
        Boolean emailExists = repository.selectEmailExists(student.getEmail());
        if (emailExists) {
            throw new BadRequestException(
                    "Email: " + student.getEmail() + " taken");
        }
        repository.save(student);
    }

    public void deleteStudent(Long studentId) {
        if (!repository.existsById(studentId)) {
            throw new StudentNotFoundException(
                    "Student with id " + studentId + " does not exists"
            );
        }
        repository.deleteById(studentId);
    }

    public boolean doesStudentExist(String email) {
        return repository.selectEmailExists(email);
    }

    public Student getStudentByEmail(String email) {
        return repository.findByEmail(email);
    }

    public int updateStudent(Student student) {
        int rowsUpdated = repository.updateStudent(
                student.getStudentId(),
                student.getUserId(),
                student.getFirstName(),
                student.getLastName(),
                student.getUsername(),
                student.getEmail(),
                student.getGender().name()
        );
        if (rowsUpdated == 0) {
            throw new EntityNotFoundException("Student not found with id: " + student.getStudentId());
        }
        return rowsUpdated;
    }
}
