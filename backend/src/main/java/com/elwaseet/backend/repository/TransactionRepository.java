package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Query by provider's userId
    List<Transaction> findByProvider_UserId(Long providerId);

    // Query by customer's userId
    List<Transaction> findByCustomer_UserId(Long customerId);

    // Query by job's jobId
    Optional<Transaction> findByJob_JobId(Long jobId);

    // Optional: query by status
    List<Transaction> findByStatus(Transaction.TransactionStatus status);

    // Scheduler support (AUTO-CONFIRM)
    List<Transaction> findByStatusAndAutoConfirmScheduledAtBefore(
            Transaction.TransactionStatus status,
            LocalDateTime time);

    Optional<BigDecimal> sumCompletedTransactionAmounts();

}