package com.syfe.personalfinancemanager.transaction;

import com.syfe.personalfinancemanager.category.Category;
import com.syfe.personalfinancemanager.common.TransactionType;
import com.syfe.personalfinancemanager.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * A single movement of money, always attached to a user and a category.
 * <p>
 * {@link #type} duplicates the category's type on purpose: reports group by type
 * over date ranges, and carrying it on the row keeps those queries off a join.
 * It is written from the category at save time and never set from client input,
 * so the two cannot disagree.
 */
@Entity
@Table(name = "transactions", indexes = {
        @Index(name = "idx_txn_user_date", columnList = "user_id, date"),
        @Index(name = "idx_txn_user_category", columnList = "user_id, category_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDate date;

    @Column(length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TransactionType type;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private Instant updatedAt;

    /**
     * Points this transaction at a category and adopts its type, keeping the
     * denormalised {@link #type} column consistent with the reference.
     */
    public void assignCategory(Category category) {
        this.category = category;
        this.type = category.getType();
    }

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
