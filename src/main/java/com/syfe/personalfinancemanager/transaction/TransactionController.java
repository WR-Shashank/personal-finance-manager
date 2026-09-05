package com.syfe.personalfinancemanager.transaction;

import com.syfe.personalfinancemanager.auth.dto.MessageResponse;
import com.syfe.personalfinancemanager.common.TransactionType;
import com.syfe.personalfinancemanager.transaction.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * <pre>
 * GET    /api/transactions        list, optionally filtered
 * POST   /api/transactions        record a transaction
 * PUT    /api/transactions/{id}   amend one (date excluded)
 * DELETE /api/transactions/{id}   remove one
 * </pre>
 *
 * The filter parameters are gathered into a {@link TransactionFilter} rather
 * than branched over here; the controller's job is binding and status codes.
 */
@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public TransactionListResponse list(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) TransactionType type) {

        var filter = new TransactionFilter(startDate, endDate, categoryId, type);
        return new TransactionListResponse(transactionService.list(filter));
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> create(
            @Valid @RequestBody CreateTransactionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.create(request));
    }

    @PutMapping("/{id}")
    public TransactionResponse update(@PathVariable Long id,
                                      @Valid @RequestBody UpdateTransactionRequest request) {
        return transactionService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public MessageResponse delete(@PathVariable Long id) {
        transactionService.delete(id);
        return new MessageResponse("Transaction deleted successfully");
    }
}
