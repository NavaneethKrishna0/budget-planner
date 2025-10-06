package com.example.budgetplanner;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    // This method will find the top 5 transactions, ordered by date in descending order.
    List<Transaction> findTop5ByOrderByDateDesc(); 
}