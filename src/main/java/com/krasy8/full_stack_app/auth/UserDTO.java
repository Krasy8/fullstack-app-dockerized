//package com.krasy8.full_stack_app.auth;
//
//import lombok.Getter;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//
//import java.time.LocalDateTime;
//import java.util.Collection;
//import java.util.Set;
//
//public class UserDTO implements UserDetails {
//
//    @Getter
//    private final long id;
//    private final String username;
//    private final String password;
//    private final Set<? extends GrantedAuthority> grantedAuthorities;
//    private final boolean isAccountNonExpired;
//    private final boolean isAccountNonLocked;
//    private final boolean isCredentialsNonExpired;
//    private final boolean isEnabled;
//    @Getter
//    private final LocalDateTime createdAt;
//
//    public UserDTO(long id, String username,
//                   String password,
//                   Set<? extends GrantedAuthority> grantedAuthorities,
//                   boolean isAccountNonExpired,
//                   boolean isAccountNonLocked,
//                   boolean isCredentialsNonExpired,
//                   boolean isEnabled, LocalDateTime createdAt) {
//        this.id = id;
//        this.username = username;
//        this.password = password;
//        this.grantedAuthorities = grantedAuthorities;
//        this.isAccountNonExpired = isAccountNonExpired;
//        this.isAccountNonLocked = isAccountNonLocked;
//        this.isCredentialsNonExpired = isCredentialsNonExpired;
//        this.isEnabled = isEnabled;
//        this.createdAt = createdAt;
//    }
//
//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//        return grantedAuthorities;
//    }
//
//    @Override
//    public String getPassword() {
//        return password;
//    }
//
//    @Override
//    public String getUsername() {
//        return username;
//    }
//
//    @Override
//    public boolean isAccountNonExpired() {
//        return isAccountNonExpired;
//    }
//
//    @Override
//    public boolean isAccountNonLocked() {
//        return isAccountNonLocked;
//    }
//
//    @Override
//    public boolean isCredentialsNonExpired() {
//        return isCredentialsNonExpired;
//    }
//
//    @Override
//    public boolean isEnabled() {
//        return isEnabled;
//    }
//}
