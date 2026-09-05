package com.syfe.personalfinancemanager.transaction;

import com.syfe.personalfinancemanager.transaction.dto.TransactionResponse;
import org.springframework.stereotype.Component;

/** Entity to DTO translation for transactions. */
@Component
public class TransactionMapper {

    public TransactionResponse toResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getDate(),
                transaction.getCategory().getName(),
                transaction.getDescription(),
                transaction.getType());
    }
}
