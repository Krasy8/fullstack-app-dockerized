package com.krasy8.full_stack_app.student.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class AdminCodeNotFoundException extends RuntimeException {

    public AdminCodeNotFoundException(String message) {
        super(message);
    }
}
