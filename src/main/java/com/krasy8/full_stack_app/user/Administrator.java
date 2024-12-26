//package com.krasy8.full_stack_app.admin;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.time.LocalDateTime;
//
//@ToString
//@Getter
//@Setter
//@EqualsAndHashCode
//@AllArgsConstructor
//@NoArgsConstructor
//@Entity
//@Table
//public class Administrator {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false)
//    private String firstName;
//
//    @Column(nullable = false)
//    private String lastName;
//
//    @Column(unique = true, nullable = false)
//    private String username;
//
//    @Column(nullable = false)
//    private String password;
//
//    @Column(nullable = false)
//    private LocalDateTime createdAt;
//}
