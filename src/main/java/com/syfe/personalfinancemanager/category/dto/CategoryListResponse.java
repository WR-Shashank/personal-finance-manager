package com.syfe.personalfinancemanager.category.dto;

import java.util.List;

/**
 * Wrapper for the category listing.
 *
 * @param categories every category visible to the caller
 */
public record CategoryListResponse(List<CategoryResponse> categories) {
}
