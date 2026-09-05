package com.syfe.personalfinancemanager.transaction;

import com.syfe.personalfinancemanager.category.Category;
import com.syfe.personalfinancemanager.category.CategoryService;
import com.syfe.personalfinancemanager.common.exception.ResourceNotFoundException;
import com.syfe.personalfinancemanager.transaction.dto.CreateTransactionRequest;
import com.syfe.personalfinancemanager.transaction.dto.TransactionResponse;
import com.syfe.personalfinancemanager.transaction.dto.UpdateTransactionRequest;
import com.syfe.personalfinancemanager.user.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Transaction rules. Every read and write is scoped to the authenticated user;
 * a row belonging to someone else is indistinguishable from one that does not exist.
 */
@Service
@RequiredArgsConstructor
public class TransactionService {

    /** Newest first, with id as the tie-breaker so same-day ordering is stable. */
    private static final Sort NEWEST_FIRST =
            Sort.by(Sort.Direction.DESC, "date").and(Sort.by(Sort.Direction.DESC, "id"));

    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;
    private final CategoryService categoryService;
    private final CurrentUser currentUser;

    /**
     * Lists transactions matching the given criteria.
     *
     * @param filter optional date range, category and type constraints
     */
    @Transactional(readOnly = true)
    public List<TransactionResponse> list(TransactionFilter filter) {
        Specification<Transaction> spec = TransactionSpecifications.ownedBy(currentUser.id())
                .and(TransactionSpecifications.matching(filter));

        return transactionRepository.findAll(spec, NEWEST_FIRST).stream()
                .map(transactionMapper::toResponse)
                .toList();
    }

    @Transactional
    public TransactionResponse create(CreateTransactionRequest request) {
        Category category = categoryService.requireVisibleByName(request.category());

        Transaction transaction = Transaction.builder()
                .amount(request.amount())
                .date(request.date())
                .description(request.description())
                .user(currentUser.entity())
                .build();
        transaction.assignCategory(category);

        return transactionMapper.toResponse(transactionRepository.save(transaction));
    }

    /**
     * Applies a partial update. Null fields are left as they are; the date is
     * not updatable and the request type carries no date field.
     */
    @Transactional
    public TransactionResponse update(Long id, UpdateTransactionRequest request) {
        Transaction transaction = requireOwned(id);

        if (request.amount() != null) {
            transaction.setAmount(request.amount());
        }
        if (request.description() != null) {
            transaction.setDescription(request.description());
        }
        if (request.category() != null) {
            transaction.assignCategory(categoryService.requireVisibleByName(request.category()));
        }

        return transactionMapper.toResponse(transactionRepository.save(transaction));
    }

    @Transactional
    public void delete(Long id) {
        transactionRepository.delete(requireOwned(id));
    }

    private Transaction requireOwned(Long id) {
        return transactionRepository.findByIdAndUserId(id, currentUser.id())
                .orElseThrow(() -> ResourceNotFoundException.of("Transaction", id));
    }
}
