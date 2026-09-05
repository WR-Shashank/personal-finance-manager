package com.syfe.personalfinancemanager.user;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * An application account. Owns the categories, transactions and goals created
 * under it; every query in the system is scoped by this id.
 * <p>
 * {@code username} holds an email address, as the API contract requires.
 * Collections are deliberately not mapped here — the aggregate is loaded by
 * repository queries scoped to the user id, which keeps this entity cheap and
 * avoids cascade behaviour nobody asked for.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Email address; the login identifier. */
    @Column(nullable = false, unique = true, length = 120)
    private String username;

    /** BCrypt hash — never the plaintext. */
    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, length = 20)
    private String phoneNumber;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
    }
}
