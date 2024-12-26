package com.krasy8.full_stack_app.security;

import com.google.common.collect.Sets;
import lombok.Getter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Set;
import java.util.stream.Collectors;

import static com.krasy8.full_stack_app.security.Permission.*;

@Getter
public enum Role {
    MASTER(Sets.newHashSet(STUDENT_READ, STUDENT_WRITE, ADMIN_READ, ADMIN_WRITE)),
    ADMIN(Sets.newHashSet(STUDENT_READ, STUDENT_WRITE)),
    STUDENT(Sets.newHashSet(SELF_READ, SELF_WRITE));

    private final Set<Permission> permissions;

    Role(Set<Permission> permissions) {
        this.permissions = permissions;
    }

    public Set<SimpleGrantedAuthority> getGrantedAuthority() {
        Set<SimpleGrantedAuthority> permissions = getPermissions().stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermissionValue()))
                .collect(Collectors.toSet());
        permissions.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return permissions;
    }
}
