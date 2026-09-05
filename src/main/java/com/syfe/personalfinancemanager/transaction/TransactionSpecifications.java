package com.syfe.personalfinancemanager.transaction;

import org.springframework.data.jpa.domain.Specification;

/**
 * Composable predicates for transaction queries.
 * <p>
 * Each optional criterion becomes a specification or nothing, so the service
 * assembles a filter by conjunction rather than branching through a chain of
 * {@code if / else if} into one finder method per combination.
 */
final class TransactionSpecifications {

    private TransactionSpecifications() {
    }

    /** Mandatory on every query: a user only ever sees their own rows. */
    static Specification<Transaction> ownedBy(Long userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
    }

    static Specification<Transaction> matching(TransactionFilter filter) {
        // Neutral starting point so every criterion below is a plain conjunction.
        Specification<Transaction> spec = (root, query, cb) -> cb.conjunction();

        if (filter.startDate() != null) {
            spec = spec.and((root, q, cb) ->
                    cb.greaterThanOrEqualTo(root.get("date"), filter.startDate()));
        }
        if (filter.endDate() != null) {
            spec = spec.and((root, q, cb) ->
                    cb.lessThanOrEqualTo(root.get("date"), filter.endDate()));
        }
        if (filter.categoryId() != null) {
            spec = spec.and((root, q, cb) ->
                    cb.equal(root.get("category").get("id"), filter.categoryId()));
        }
        if (filter.type() != null) {
            spec = spec.and((root, q, cb) ->
                    cb.equal(root.get("type"), filter.type()));
        }
        return spec;
    }
}
