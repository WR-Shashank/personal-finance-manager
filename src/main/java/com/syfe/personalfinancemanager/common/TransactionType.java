package com.syfe.personalfinancemanager.common;

/**
 * Whether money comes in or goes out.
 * <p>
 * Shared vocabulary: a category is declared as one of these, and a transaction
 * inherits it from the category it references. Lives in {@code common} because
 * both feature packages need it and neither owns it.
 */
public enum TransactionType {
    INCOME,
    EXPENSE
}
