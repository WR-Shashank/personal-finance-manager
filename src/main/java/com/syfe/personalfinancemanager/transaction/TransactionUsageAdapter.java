package com.syfe.personalfinancemanager.transaction;

import com.syfe.personalfinancemanager.category.CategoryUsage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Answers the category package's deletion-protection question, so the category
 * package never has to import a transaction repository.
 */
@Component
@RequiredArgsConstructor
public class TransactionUsageAdapter implements CategoryUsage {

    private final TransactionRepository transactionRepository;

    @Override
    public boolean isCategoryInUse(Long categoryId, Long userId) {
        return transactionRepository.existsByCategoryIdAndUserId(categoryId, userId);
    }
}
