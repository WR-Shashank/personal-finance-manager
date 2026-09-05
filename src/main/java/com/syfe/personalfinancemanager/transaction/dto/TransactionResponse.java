package com.syfe.personalfinancemanager.transaction.dto;

import com.syfe.personalfinancemanager.common.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * A transaction as the API exposes it. The category is returned by name rather
 * than by id, matching the shape accepted on the way in.
 */
public record TransactionResponse(Long id,
                                  BigDecimal amount,
                                  LocalDate date,
                                  String category,
                                  String description,
                                  TransactionType type) {
}
