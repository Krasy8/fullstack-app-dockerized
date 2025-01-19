package com.krasy8.full_stack_app.user;

import com.krasy8.full_stack_app.security.Role;
import com.krasy8.full_stack_app.student.Gender;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;

@ToString
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "app_user")
public class User implements UserDetails {

    @Id
    @SequenceGenerator(
            name = "user_seq",
            sequenceName = "user_seq",
            allocationSize = 1
    )
    @GeneratedValue(
            generator = "user_seq",
            strategy = GenerationType.SEQUENCE
    )
    private Long userId;

    @Column
    private String firstName;

    @Column
    private String lastName;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String username;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @NotBlank
    @Column(nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column
    private Gender gender;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private boolean isAccountNonExpired;

    @Column(nullable = false)
    private boolean isAccountNonLocked;

    @Column(nullable = false)
    private boolean isCredentialsNonExpired;

    @Column(nullable = false)
    private boolean isEnabled;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private String adminCode;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return role.getGrantedAuthority();
    }
}
