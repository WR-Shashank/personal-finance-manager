package com.syfe.personalfinancemanager.transaction;

import com.syfe.personalfinancemanager.category.Category;
import com.syfe.personalfinancemanager.category.CategoryService;
import com.syfe.personalfinancemanager.common.TransactionType;
import com.syfe.personalfinancemanager.common.exception.BusinessRuleException;
import com.syfe.personalfinancemanager.common.exception.ResourceNotFoundException;
import com.syfe.personalfinancemanager.transaction.dto.CreateTransactionRequest;
import com.syfe.personalfinancemanager.transaction.dto.TransactionResponse;
import com.syfe.personalfinancemanager.transaction.dto.UpdateTransactionRequest;
import com.syfe.personalfinancemanager.user.CurrentUser;
import com.syfe.personalfinancemanager.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    private static final Long USER_ID = 5L;

    @Mock private TransactionRepository transactionRepository;
    @Mock private CategoryService categoryService;
    @Mock private CurrentUser currentUser;

    private final TransactionMapper mapper = new TransactionMapper();
    private TransactionService service;

    private User user;
    private Category salary;

    @BeforeEach
    void setUp() {
        user = User.builder().id(USER_ID).username("darsh@example.com").build();
        salary = Category.builder().id(1L).name("Salary").type(TransactionType.INCOME).owner(null).build();
        service = new TransactionService(transactionRepository, mapper, categoryService, currentUser);
    }

    @Test
    @DisplayName("type is taken from the category, not from client input")
    void createDerivesTypeFromCategory() {
        when(currentUser.entity()).thenReturn(user);
        when(categoryService.requireVisibleByName("Salary")).thenReturn(salary);
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> {
            Transaction t = inv.getArgument(0);
            t.setId(100L);
            return t;
        });

        var req = new CreateTransactionRequest(new BigDecimal("50000.00"),
                LocalDate.of(2024, 1, 15), "Salary", "January");

        TransactionResponse res = service.create(req);

        assertThat(res.type()).isEqualTo(TransactionType.INCOME);
        assertThat(res.category()).isEqualTo("Salary");
        assertThat(res.amount()).isEqualByComparingTo("50000.00");
    }

    @Test
    @DisplayName("an unknown category name is rejected before anything is saved")
    void createRejectsUnknownCategory() {
        when(currentUser.entity()).thenReturn(user);
        when(categoryService.requireVisibleByName("Ghost"))
                .thenThrow(new BusinessRuleException("Unknown category: 'Ghost'"));

        var req = new CreateTransactionRequest(new BigDecimal("10.00"),
                LocalDate.of(2024, 1, 15), "Ghost", null);

        assertThatThrownBy(() -> service.create(req)).isInstanceOf(BusinessRuleException.class);
        verify(transactionRepository, never()).save(any());
    }

    @Test
    @DisplayName("update changes only the fields provided; nulls are left untouched")
    void updateIsPartial() {
        Transaction existing = Transaction.builder()
                .id(100L).amount(new BigDecimal("100.00")).description("old")
                .date(LocalDate.of(2024, 1, 15)).user(user).build();
        existing.assignCategory(salary);

        when(currentUser.id()).thenReturn(USER_ID);
        when(transactionRepository.findByIdAndUserId(100L, USER_ID)).thenReturn(Optional.of(existing));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> inv.getArgument(0));

        var req = new UpdateTransactionRequest(new BigDecimal("250.00"), null, null);
        TransactionResponse res = service.update(100L, req);

        assertThat(res.amount()).isEqualByComparingTo("250.00");
        assertThat(res.description()).isEqualTo("old");       // untouched
        assertThat(res.date()).isEqualTo(LocalDate.of(2024, 1, 15)); // never editable
    }

    @Test
    @DisplayName("updating a transaction that isn't yours is a 404")
    void updateRejectsForeignRow() {
        when(currentUser.id()).thenReturn(USER_ID);
        when(transactionRepository.findByIdAndUserId(999L, USER_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.update(999L, new UpdateTransactionRequest(null, null, null)))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("listing scopes to the current user and returns mapped rows")
    void listReturnsMappedRows() {
        Transaction t = Transaction.builder()
                .id(1L).amount(new BigDecimal("10.00")).description("x")
                .date(LocalDate.of(2024, 2, 1)).user(user).build();
        t.assignCategory(salary);

        when(currentUser.id()).thenReturn(USER_ID);
        when(transactionRepository.findAll(any(Specification.class), any(Sort.class)))
                .thenReturn(List.of(t));

        var filter = new TransactionFilter(null, null, null, null);
        List<TransactionResponse> res = service.list(filter);

        assertThat(res).hasSize(1);
        assertThat(res.get(0).category()).isEqualTo("Salary");
    }

    @Test
    @DisplayName("a filter with start after end is rejected on construction")
    void filterRejectsInvertedRange() {
        assertThatThrownBy(() -> new TransactionFilter(
                LocalDate.of(2024, 3, 1), LocalDate.of(2024, 1, 1), null, null))
                .isInstanceOf(BusinessRuleException.class);
    }

    @Test
    @DisplayName("deleting a transaction that isn't yours is a 404")
    void deleteRejectsForeignRow() {
        when(currentUser.id()).thenReturn(USER_ID);
        when(transactionRepository.findByIdAndUserId(7L, USER_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.delete(7L)).isInstanceOf(ResourceNotFoundException.class);
        verify(transactionRepository, never()).delete(any());
    }
}
