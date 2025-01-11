package com.krasy8.full_stack_app.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegistrationRequest {
    private User user;
    private String adminCode;
}
