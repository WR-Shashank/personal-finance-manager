package com.syfe.personalfinancemanager.category;

import com.syfe.personalfinancemanager.common.TransactionType;
import com.syfe.personalfinancemanager.user.User;
import jakarta.persistence.*;
import lombok.*;

/**
 * A bucket a transaction is filed under.
 * <p>
 * A null {@link #owner} marks a system default: shared by every account, and
 * neither editable nor deletable. A non-null owner marks a user's own category.
 * Modelling both as one table means transaction lookup stays a single query and
 * "is this mine or a default?" is one null check rather than a union.
 */
@Entity
@Table(name = "categories",
       uniqueConstraints = @UniqueConstraint(
               name = "uk_category_owner_name", columnNames = {"owner_id", "name"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TransactionType type;

    /** Null for system defaults; set for user-created categories. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    /** @return true when this is a user-created category rather than a system default */
    public boolean isCustom() {
        return owner != null;
    }
}
