package com.syfe.personalfinancemanager.transaction.dto;

import java.util.List;

/**
 * Wrapper for a transaction listing.
 *
 * @param transactions matching transactions, newest first
 */
public record TransactionListResponse(List<TransactionResponse> transactions) {
}
