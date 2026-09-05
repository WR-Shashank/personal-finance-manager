package com.syfe.personalfinancemanager.category;

import com.syfe.personalfinancemanager.auth.dto.MessageResponse;
import com.syfe.personalfinancemanager.category.dto.CategoryListResponse;
import com.syfe.personalfinancemanager.category.dto.CategoryRequest;
import com.syfe.personalfinancemanager.category.dto.CategoryResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * <pre>
 * GET    /api/categories          list defaults and the caller's own
 * POST   /api/categories          create a custom category
 * DELETE /api/categories/{name}   remove a custom category
 * </pre>
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public CategoryListResponse list() {
        return new CategoryListResponse(categoryService.listVisible());
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> create(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.create(request));
    }

    @DeleteMapping("/{name}")
    public MessageResponse delete(@PathVariable String name) {
        categoryService.deleteByName(name);
        return new MessageResponse("Category deleted successfully");
    }
}
