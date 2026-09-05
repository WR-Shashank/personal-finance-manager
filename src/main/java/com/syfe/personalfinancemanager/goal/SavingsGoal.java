package com.syfe.personalfinancemanager.goal;

import com.syfe.personalfinancemanager.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * A savings target.
 * <p>
 * Progress is not a column. It is derived from the user's transactions on every
 * read, so deleting or amending a transaction is reflected immediately and there
 * is no stored total that can drift out of step with the ledger.
 */
@Entity
@Table(name = "savings_goals", indexes = @Index(name = "idx_goal_user", columnList = "user_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavingsGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String goalName;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal targetAmount;

    @Column(nullable = false)
    private LocalDate targetDate;

    /** Progress counts transactions dated on or after this day. */
    @Column(nullable = false)
    private LocalDate startDate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
