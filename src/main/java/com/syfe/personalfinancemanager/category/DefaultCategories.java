package com.syfe.personalfinancemanager.category;

import com.syfe.personalfinancemanager.common.TransactionType;

import java.util.List;
import java.util.Map;

/**
 * The fixed set of categories every account starts with.
 * <p>
 * Held here as data rather than scattered through a seeding method, so the
 * catalogue can be asserted against in a test and changed in one place.
 */
public final class DefaultCategories {

    /** Ordered so the seeded rows read the same way the API contract lists them. */
    public static final List<Map.Entry<String, TransactionType>> CATALOGUE = List.of(
            Map.entry("Salary",         TransactionType.INCOME),
            Map.entry("Food",           TransactionType.EXPENSE),
            Map.entry("Rent",           TransactionType.EXPENSE),
            Map.entry("Transportation", TransactionType.EXPENSE),
            Map.entry("Entertainment",  TransactionType.EXPENSE),
            Map.entry("Healthcare",     TransactionType.EXPENSE),
            Map.entry("Utilities",      TransactionType.EXPENSE));

    private DefaultCategories() {
    }
}
