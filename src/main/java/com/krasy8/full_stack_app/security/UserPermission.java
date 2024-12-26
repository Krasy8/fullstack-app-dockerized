//package com.krasy8.full_stack_app.security;
//
//import jakarta.persistence.*;
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
//public class UserPermission {
//
//    @Id
//    @SequenceGenerator(
//            name = "user_permission_seq",
//            sequenceName = "user_permission_seq",
//            allocationSize = 1
//    )
//    @GeneratedValue(
//            generator = "user_permission_seq",
//            strategy = GenerationType.SEQUENCE
//    )
//    @Column(name = "user_permission_id")
//    private Long id;
//
//    @OneToOne
//    @JoinColumn(name = "user_permission_type_id")
//    private PermissionType permissionType;
//}
