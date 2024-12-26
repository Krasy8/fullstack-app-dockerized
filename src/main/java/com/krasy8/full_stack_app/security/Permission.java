package com.krasy8.full_stack_app.security;

import lombok.Getter;

@Getter
public enum Permission {
    STUDENT_READ("student:read"),
    STUDENT_WRITE("student:write"),
    SELF_READ("self:read"),
    SELF_WRITE("self:write"),
    ADMIN_READ("admin:read"),
    ADMIN_WRITE("admin:write");

    private final String permissionValue;

    Permission(String permissionValue) {
        this.permissionValue = permissionValue;
    }
}
