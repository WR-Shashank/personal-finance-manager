package com.syfe.personalfinancemanager.category;

/**
 * Port through which the category package asks whether a category is still in use.
 * <p>
 * Deletion protection is a category rule, but the evidence lives in the
 * transaction table. Declaring the question here and implementing it in the
 * transaction package keeps the dependency pointing one way and lets
 * {@link CategoryService} be unit-tested against a stub instead of a repository.
 */
public interface CategoryUsage {

    /** @return true if the given user has at least one transaction in this category */
    boolean isCategoryInUse(Long categoryId, Long userId);
}
