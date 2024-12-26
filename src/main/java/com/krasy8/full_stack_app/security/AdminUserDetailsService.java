//package com.krasy8.full_stack_app.security;
//
//import com.krasy8.full_stack_app.admin.UserRepository;
//import com.krasy8.full_stack_app.auth.UserDTO;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//
//@Service
//public class AdminUserDetailsService implements UserDetailsService {
//
//    @Autowired
//    private UserRepository userRepo;
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        UserDTO user = userRepo.findByUsername(username);
//        if (user == null) {
//            throw new UsernameNotFoundException(String.format("Admin: {%s} not found", username));
//        }
//        return new User(user.getUsername(), user.getPassword(), new ArrayList<>());
//    }
//}
