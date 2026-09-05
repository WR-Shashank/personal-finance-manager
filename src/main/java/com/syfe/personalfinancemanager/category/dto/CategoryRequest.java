package com.syfe.personalfinancemanager.category.dto;

import com.syfe.personalfinancemanager.common.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Payload for creating a custom category.
 *
 * @param name unique within the user's visible set, defaults included
 * @param type INCOME or EXPENSE; fixed once created
 */
public record CategoryRequest(

        @NotBlank(message = "Category name is required")
        @Size(max = 50, message = "Category name must not exceed 50 characters")
        String name,

        @NotNull(message = "Type is required and must be INCOME or EXPENSE")
        TransactionType type) {
}
