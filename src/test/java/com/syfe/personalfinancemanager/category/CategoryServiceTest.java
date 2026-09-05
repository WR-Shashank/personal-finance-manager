package com.syfe.personalfinancemanager.category;

import com.syfe.personalfinancemanager.category.dto.CategoryRequest;
import com.syfe.personalfinancemanager.category.dto.CategoryResponse;
import com.syfe.personalfinancemanager.common.TransactionType;
import com.syfe.personalfinancemanager.common.exception.BusinessRuleException;
import com.syfe.personalfinancemanager.common.exception.DuplicateResourceException;
import com.syfe.personalfinancemanager.common.exception.ForbiddenOperationException;
import com.syfe.personalfinancemanager.common.exception.ResourceNotFoundException;
import com.syfe.personalfinancemanager.user.CurrentUser;
import com.syfe.personalfinancemanager.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    private static final Long USER_ID = 7L;

    @Mock private CategoryRepository categoryRepository;
    @Mock private CategoryUsage categoryUsage;
    @Mock private CurrentUser currentUser;

    private final CategoryMapper categoryMapper = new CategoryMapper();
    private CategoryService categoryService;
    private User owner;

    @BeforeEach
    void setUp() {
        owner = User.builder().id(USER_ID).username("darsh@example.com").build();
        categoryService = new CategoryService(categoryRepository, categoryMapper, categoryUsage, currentUser);
    }

    @Test
    @DisplayName("listing marks defaults as non-custom and own categories as custom")
    void listsWithCustomFlag() {
        Category dflt = Category.builder().id(1L).name("Salary").type(TransactionType.INCOME).owner(null).build();
        Category mine = Category.builder().id(2L).name("Side").type(TransactionType.INCOME).owner(owner).build();
        when(currentUser.id()).thenReturn(USER_ID);
        when(categoryRepository.findAllVisibleTo(USER_ID)).thenReturn(List.of(dflt, mine));

        List<CategoryResponse> result = categoryService.listVisible();

        assertThat(result).extracting(CategoryResponse::name).containsExactly("Salary", "Side");
        assertThat(result).extracting(CategoryResponse::isCustom).containsExactly(false, true);
    }

    @Test
    @DisplayName("creating a category whose name is already taken is a conflict")
    void rejectsDuplicateName() {
        when(currentUser.entity()).thenReturn(owner);
        when(categoryRepository.existsVisibleByName("Rent", USER_ID)).thenReturn(true);

        assertThatThrownBy(() -> categoryService.create(new CategoryRequest("Rent", TransactionType.EXPENSE)))
                .isInstanceOf(DuplicateResourceException.class);
        verify(categoryRepository, never()).save(any());
    }

    @Test
    @DisplayName("a valid custom category is trimmed and saved")
    void createsCustomCategory() {
        when(currentUser.entity()).thenReturn(owner);
        when(categoryRepository.existsVisibleByName("Books", USER_ID)).thenReturn(false);
        when(categoryRepository.save(any(Category.class)))
                .thenAnswer(inv -> { Category c = inv.getArgument(0); c.setId(9L); return c; });

        CategoryResponse res = categoryService.create(new CategoryRequest("  Books ", TransactionType.EXPENSE));

        assertThat(res.name()).isEqualTo("Books");
        assertThat(res.isCustom()).isTrue();
    }

    @Test
    @DisplayName("a system default category cannot be deleted")
    void rejectsDeletingDefault() {
        Category systemDefault = Category.builder().id(1L).name("Salary").type(TransactionType.INCOME).owner(null).build();
        when(currentUser.id()).thenReturn(USER_ID);
        when(categoryRepository.findVisibleByName("Salary", USER_ID)).thenReturn(Optional.of(systemDefault));

        assertThatThrownBy(() -> categoryService.deleteByName("Salary"))
                .isInstanceOf(ForbiddenOperationException.class);
    }

    @Test
    @DisplayName("a category still referenced by transactions cannot be deleted")
    void rejectsDeletingCategoryInUse() {
        Category custom = Category.builder().id(2L).name("Side").type(TransactionType.INCOME).owner(owner).build();
        when(currentUser.id()).thenReturn(USER_ID);
        when(categoryRepository.findVisibleByName("Side", USER_ID)).thenReturn(Optional.of(custom));
        when(categoryUsage.isCategoryInUse(2L, USER_ID)).thenReturn(true);

        assertThatThrownBy(() -> categoryService.deleteByName("Side"))
                .isInstanceOf(BusinessRuleException.class);
        verify(categoryRepository, never()).delete(any());
    }

    @Test
    @DisplayName("an unused custom category is deleted")
    void deletesUnusedCustomCategory() {
        Category custom = Category.builder().id(3L).name("Books").type(TransactionType.EXPENSE).owner(owner).build();
        when(currentUser.id()).thenReturn(USER_ID);
        when(categoryRepository.findVisibleByName("Books", USER_ID)).thenReturn(Optional.of(custom));
        when(categoryUsage.isCategoryInUse(3L, USER_ID)).thenReturn(false);

        categoryService.deleteByName("Books");

        verify(categoryRepository).delete(custom);
    }

    @Test
    @DisplayName("a name outside the caller's visible set is not found")
    void rejectsUnknownName() {
        when(currentUser.id()).thenReturn(USER_ID);
        when(categoryRepository.findVisibleByName(any(), any())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.deleteByName("Nope"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("resolving a usable name returns the entity; an unusable one is a business-rule error")
    void requireVisibleByName() {
        Category custom = Category.builder().id(4L).name("Salary").type(TransactionType.INCOME).owner(null).build();
        when(currentUser.id()).thenReturn(USER_ID);
        when(categoryRepository.findVisibleByName("Salary", USER_ID)).thenReturn(Optional.of(custom));
        assertThat(categoryService.requireVisibleByName("Salary")).isSameAs(custom);

        when(categoryRepository.findVisibleByName("Ghost", USER_ID)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> categoryService.requireVisibleByName("Ghost"))
                .isInstanceOf(BusinessRuleException.class);
    }
}
