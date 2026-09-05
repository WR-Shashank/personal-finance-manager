package com.syfe.personalfinancemanager.goal;

import com.syfe.personalfinancemanager.auth.dto.MessageResponse;
import com.syfe.personalfinancemanager.goal.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * <pre>
 * GET    /api/goals        list goals with live progress
 * GET    /api/goals/{id}   one goal
 * POST   /api/goals        create a goal
 * PUT    /api/goals/{id}   change target amount or date
 * DELETE /api/goals/{id}   remove a goal
 * </pre>
 */
@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class SavingsGoalController {

    private final SavingsGoalService goalService;

    @GetMapping
    public GoalListResponse list() {
        return new GoalListResponse(goalService.list());
    }

    @GetMapping("/{id}")
    public GoalResponse get(@PathVariable Long id) {
        return goalService.get(id);
    }

    @PostMapping
    public ResponseEntity<GoalResponse> create(@Valid @RequestBody CreateGoalRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(goalService.create(request));
    }

    @PutMapping("/{id}")
    public GoalResponse update(@PathVariable Long id, @Valid @RequestBody UpdateGoalRequest request) {
        return goalService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public MessageResponse delete(@PathVariable Long id) {
        goalService.delete(id);
        return new MessageResponse("Goal deleted successfully");
    }
}
