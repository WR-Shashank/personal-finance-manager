package com.syfe.personalfinancemanager.category;

import com.syfe.personalfinancemanager.category.dto.CategoryResponse;
import org.springframework.stereotype.Component;

/**
 * Entity to DTO translation, kept out of the service so the service reads as
 * business rules and nothing else.
 */
@Component
public class CategoryMapper {

    public CategoryResponse toResponse(Category category) {
        return new CategoryResponse(category.getName(), category.getType(), category.isCustom());
    }
}
