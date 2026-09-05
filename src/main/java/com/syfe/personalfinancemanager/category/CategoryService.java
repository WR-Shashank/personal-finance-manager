package com.syfe.personalfinancemanager.category;

import com.syfe.personalfinancemanager.category.dto.CategoryRequest;
import com.syfe.personalfinancemanager.category.dto.CategoryResponse;
import com.syfe.personalfinancemanager.common.exception.BusinessRuleException;
import com.syfe.personalfinancemanager.common.exception.DuplicateResourceException;
import com.syfe.personalfinancemanager.common.exception.ForbiddenOperationException;
import com.syfe.personalfinancemanager.common.exception.ResourceNotFoundException;
import com.syfe.personalfinancemanager.user.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Category rules: what the caller can see, what they may add, and what they may remove.
 */
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final CategoryUsage categoryUsage;
    private final CurrentUser currentUser;

    /** @return system defaults plus the caller's own categories */
    @Transactional(readOnly = true)
    public List<CategoryResponse> listVisible() {
        return categoryRepository.findAllVisibleTo(currentUser.id()).stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    /**
     * Adds a custom category for the caller.
     *
     * @throws DuplicateResourceException if the name collides with a default or an existing custom category
     */
    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        var owner = currentUser.entity();

        if (categoryRepository.existsVisibleByName(request.name(), owner.getId())) {
            throw new DuplicateResourceException(
                    "A category named '" + request.name() + "' already exists");
        }

        Category saved = categoryRepository.save(Category.builder()
                .name(request.name().trim())
                .type(request.type())
                .owner(owner)
                .build());

        return categoryMapper.toResponse(saved);
    }

    /**
     * Removes a custom category by name.
     *
     * @throws ResourceNotFoundException    if no visible category has that name
     * @throws ForbiddenOperationException  if the name refers to a system default
     * @throws BusinessRuleException        if transactions still reference it
     */
    @Transactional
    public void deleteByName(String name) {
        Long userId = currentUser.id();

        Category category = categoryRepository.findVisibleByName(name, userId)
                .orElseThrow(() -> ResourceNotFoundException.of("Category", name));

        if (!category.isCustom()) {
            throw new ForbiddenOperationException(
                    "'" + category.getName() + "' is a default category and cannot be deleted");
        }

        if (categoryUsage.isCategoryInUse(category.getId(), userId)) {
            throw new BusinessRuleException(
                    "Category '" + category.getName() + "' is referenced by existing transactions");
        }

        categoryRepository.delete(category);
    }

    /**
     * Resolves a category name to the entity, for the transaction package.
     *
     * @throws BusinessRuleException if the name is not one the caller can use
     */
    @Transactional(readOnly = true)
    public Category requireVisibleByName(String name) {
        return categoryRepository.findVisibleByName(name, currentUser.id())
                .orElseThrow(() -> new BusinessRuleException(
                        "Unknown category: '" + name + "'"));
    }
}
