//package com.krasy8.full_stack_app.security;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.util.Set;
//
//@ToString
//@Getter
//@Setter
//@EqualsAndHashCode
//@NoArgsConstructor
//@AllArgsConstructor
//@Entity
//@Table
//public class UserRole {
//
//    @Id
//    @SequenceGenerator(
//            name = "user_role_seq",
//            sequenceName = "user_role_seq",
//            allocationSize = 1
//    )
//    @GeneratedValue(
//            generator = "user_role_seq",
//            strategy = GenerationType.SEQUENCE
//    )
//    @Column(name = "user_role_id")
//    private Long id;
//
//    @OneToOne
//    @JoinColumn(name = "user_role_type_id")
//    private RoleType roleType;
//
//    @ElementCollection(fetch = FetchType.EAGER)
//    @CollectionTable(name = "user_role_permission", joinColumns = @JoinColumn(name = "user_permission_id"))
//    @Column(name = "permissions")
//    private Set<String> userPermissions;
//}
