//package com.krasy8.full_stack_app.security;
//
//import jakarta.persistence.*;
//import jakarta.validation.constraints.NotNull;
//import lombok.*;
//
//@ToString
//@Getter
//@Setter
//@EqualsAndHashCode
//@NoArgsConstructor
//@AllArgsConstructor
//@Entity
//@Table
//public class RoleType {
//
//    @Id
//    @SequenceGenerator(
//            name = "role_type_seq",
//            sequenceName = "role_type_seq",
//            allocationSize = 1
//    )
//    @GeneratedValue(
//            generator = "role_type_seq",
//            strategy = GenerationType.SEQUENCE
//    )
//    @Column(name = "role_type_id")
//    private Long id;
//
//    @NotNull
//    @Enumerated(EnumType.STRING)
//    @Column(name = "role_name", nullable = false)
//    private Role role;
//
//    @Column
//    private String description;
//
//
//    public RoleType(Role role,
//                    String description) {
//        this.role = role;
//        this.description = description;
//    }
//}
