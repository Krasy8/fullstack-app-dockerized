//package com.krasy8.full_stack_app.security;
//
//import jakarta.persistence.*;
//import jakarta.validation.constraints.NotNull;
//import lombok.*;
//
//@ToString
//@Getter
//@EqualsAndHashCode
//@NoArgsConstructor
//@AllArgsConstructor
//@Entity
//@Table
//public class PermissionType {
//
//    @Id
//    @SequenceGenerator(
//            name = "permission_type_seq",
//            sequenceName = "permission_type_seq",
//            allocationSize = 1
//    )
//    @GeneratedValue(
//            generator = "permission_type_seq",
//            strategy = GenerationType.SEQUENCE
//    )
//    @Column(name = "permission_type_id")
//    private Long id;
//
//    @NotNull
//    @Enumerated(EnumType.STRING)
//    @Column(name = "permissionName", nullable = false, unique = true)
//    private Permission permission;
//
//    @NotNull
//    @Column(nullable = false, unique = true)
//    private String permissionValue;
//
//
//    // Custom constructor to ensure permissionValue is derived from Permission enum
//    public PermissionType(Permission permission) {
//        this.permission = permission;
//        this.permissionValue = permission.getPermissionValue();  // Automatically set the value
//    }
//
//    // Override the setter for permission to also update the permissionValue
//    public void setPermission(Permission permission) {
//        this.permission = permission;
//        this.permissionValue = permission.getPermissionValue();  // Ensure it's always in sync
//    }
//}
