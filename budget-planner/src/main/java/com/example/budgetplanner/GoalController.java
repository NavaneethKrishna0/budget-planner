package com.example.budgetplanner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "http://localhost:3000")
public class GoalController {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping
    public List<Goal> getAllGoals() {
        return goalRepository.findAll();
    }

    @PostMapping
    public Goal addGoal(@RequestBody Goal goal) {
        return goalRepository.save(goal);
    }

    @PostMapping("/{id}/contribute")
    public ResponseEntity<Goal> contributeToGoal(@PathVariable Long id, @RequestBody Map<String, BigDecimal> payload) {
        Optional<Goal> optionalGoal = goalRepository.findById(id);
        if (!optionalGoal.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Goal goal = optionalGoal.get();
        BigDecimal contributionAmount = payload.get("amount");
        if (contributionAmount == null || contributionAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().build();
        }

        // 1. Update the goal's current amount
        goal.setCurrentAmount(goal.getCurrentAmount().add(contributionAmount));
        Goal savedGoal = goalRepository.save(goal);

        // 2. Create a corresponding expense transaction
        Transaction expense = new Transaction();
        expense.setDescription("Contribution to goal: " + goal.getName());
        expense.setAmount(contributionAmount);
        expense.setType("expense");
        expense.setCategory("Savings");
        expense.setDate(LocalDate.now());
        transactionRepository.save(expense);

        return ResponseEntity.ok(savedGoal);
    }
}