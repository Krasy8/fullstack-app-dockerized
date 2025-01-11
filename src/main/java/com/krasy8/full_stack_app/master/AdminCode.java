package com.krasy8.full_stack_app.master;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@ToString
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "admin_code")
public class AdminCode {

    @Id
    @SequenceGenerator(
            name = "admin_code_seq",
            sequenceName = "admin_code_seq",
            allocationSize = 1
    )
    @GeneratedValue(
            generator = "admin_code_seq",
            strategy = GenerationType.SEQUENCE
    )
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private LocalDateTime expirationDate;

    private Long userId;

    private LocalDateTime usedAt;
}
