//package com.krasy8.full_stack_app.auth;
//
//import com.krasy8.full_stack_app.admin.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//
//@Service
//public class UserDaoService implements UserDao {
//
//    private final UserRepository userRepository;
//
//    @Autowired
//    public UserDaoService(UserRepository userRepository) {
//        this.userRepository = userRepository;
//    }
//
//    @Override
//    public Optional<User> findByUsername(String username) {
//        return (userRepository.findByUsername(username));
//    }
//}
