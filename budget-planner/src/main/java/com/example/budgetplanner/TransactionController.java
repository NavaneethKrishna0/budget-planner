package com.example.budgetplanner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @PostMapping
    public Transaction addTransaction(@RequestBody Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    @GetMapping("/summary")
    public Map<String, BigDecimal> getTransactionSummary() {
        Map<String, BigDecimal> summary = new HashMap<>();
        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpenses = BigDecimal.ZERO;

        List<Transaction> transactions = transactionRepository.findAll();
        for (Transaction t : transactions) {
            if (t.getAmount() != null) {
                if ("income".equalsIgnoreCase(t.getType())) {
                    totalIncome = totalIncome.add(t.getAmount());
                } else {
                    totalExpenses = totalExpenses.add(t.getAmount());
                }
            }
        }
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpenses", totalExpenses);
        summary.put("balance", totalIncome.subtract(totalExpenses));
        return summary;
    }

    @GetMapping("/summary/category")
    public Map<String, BigDecimal> getExpenseSummaryByCategory() {
        Map<String, BigDecimal> categorySummary = new HashMap<>();
        List<Transaction> transactions = transactionRepository.findAll();
        for (Transaction t : transactions) {
            if ("expense".equalsIgnoreCase(t.getType()) && t.getAmount() != null) {
                String category = t.getCategory() == null || t.getCategory().trim().isEmpty() ? "Uncategorized" : t.getCategory();
                categorySummary.merge(category, t.getAmount(), BigDecimal::add);
            }
        }
        return categorySummary;
    }
    
    @GetMapping("/recent")
    public List<Transaction> getRecentTransactions() {
        return transactionRepository.findTop5ByOrderByDateDesc();
    }
}