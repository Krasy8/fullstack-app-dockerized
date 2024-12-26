//package com.krasy8.full_stack_app.auth;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//@Service
//public class UserService implements UserDetailsService {
//
//    private final UserDao userDao;
//
//    @Autowired
//    public UserService(UserDao userDao) {
//        this.userDao = userDao;
//    }
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        return userDao
//                .findByUsername(username)
//                .orElseThrow(() -> new UsernameNotFoundException(String.format("User %s not found", username)));
//    }
//}
