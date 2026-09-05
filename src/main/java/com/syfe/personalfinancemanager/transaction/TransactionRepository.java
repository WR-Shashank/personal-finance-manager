package com.syfe.personalfinancemanager.transaction;

import com.syfe.personalfinancemanager.common.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Transaction persistence.
 * <p>
 * Filtering goes through {@link JpaSpecificationExecutor} so optional criteria
 * compose instead of multiplying into one finder method per combination. The
 * explicit queries below are the aggregations reports and goals need, which
 * belong in the database rather than in a stream over a full table scan.
 */
public interface TransactionRepository
        extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {

    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    boolean existsByCategoryIdAndUserId(Long categoryId, Long userId);

    /** Net of income minus expenses from {@code from} to {@code to} inclusive. Used for goal progress. */
    @Query("""
           SELECT COALESCE(SUM(CASE WHEN t.type = :income THEN t.amount ELSE -t.amount END), 0)
           FROM Transaction t
           WHERE t.user.id = :userId AND t.date BETWEEN :from AND :to
           """)
    BigDecimal netAmountBetween(@Param("userId") Long userId,
                                @Param("from") LocalDate from,
                                @Param("to") LocalDate to,
                                @Param("income") TransactionType income);

    /** Convenience overload: net savings are always income minus everything else. */
    default BigDecimal netAmountBetween(Long userId, LocalDate from, LocalDate to) {
        return netAmountBetween(userId, from, to, TransactionType.INCOME);
    }

    /**
     * Per-category totals for one type over a date range.
     *
     * @return rows of {@code [categoryName, total]}
     */
    @Query("""
           SELECT t.category.name, SUM(t.amount)
           FROM Transaction t
           WHERE t.user.id = :userId AND t.type = :type AND t.date BETWEEN :from AND :to
           GROUP BY t.category.name
           ORDER BY t.category.name
           """)
    List<Object[]> totalsByCategory(@Param("userId") Long userId,
                                    @Param("type") TransactionType type,
                                    @Param("from") LocalDate from,
                                    @Param("to") LocalDate to);
}
