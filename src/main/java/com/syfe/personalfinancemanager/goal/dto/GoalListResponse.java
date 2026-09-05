package com.syfe.personalfinancemanager.goal.dto;

import java.util.List;

/**
 * Wrapper for the goal listing.
 *
 * @param goals the caller's goals, nearest deadline first
 */
public record GoalListResponse(List<GoalResponse> goals) {
}
