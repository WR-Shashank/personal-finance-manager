package com.syfe.personalfinancemanager.category.dto;

import com.syfe.personalfinancemanager.common.TransactionType;

/**
 * A category as the API exposes it.
 *
 * @param name     display name
 * @param type     INCOME or EXPENSE
 * @param isCustom false for system defaults, true for the user's own categories
 */
public record CategoryResponse(String name, TransactionType type, boolean isCustom) {
}
