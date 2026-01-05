package com.elwaseet.backend.service;

import com.elwaseet.backend.entity.Job;
import com.elwaseet.backend.entity.Transaction;
import com.elwaseet.backend.entity.Transaction.TransactionStatus;
import com.elwaseet.backend.entity.User;
import com.elwaseet.backend.policy.TransactionTransitionPolicy;
import com.elwaseet.backend.repository.JobRepository;
import com.elwaseet.backend.repository.TransactionRepository;
import com.elwaseet.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final TransactionTransitionPolicy transitionPolicy;

    public TransactionService(
            TransactionRepository transactionRepository,
            JobRepository jobRepository,
            UserRepository userRepository,
            TransactionTransitionPolicy transitionPolicy) {
        this.transactionRepository = transactionRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.transitionPolicy = transitionPolicy;
    }

    /*
     * =========================================================================
     * INTERNAL HELPERS
     * =========================================================================
     */

    private Transaction getTransaction(Long txId) {
        return transactionRepository.findById(txId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found: " + txId));
    }

    private void validateTransition(Transaction tx, TransactionStatus next) {
        transitionPolicy.assertTransition(tx.getStatus(), next);
    }

    /*
     * =========================================================================
     * CREATION
     * =========================================================================
     */

    @Transactional
    public Transaction commit(
            Long jobId,
            Long customerId,
            Long providerId,
            BigDecimal amount) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));

        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        User provider = userRepository.findById(providerId)
                .orElseThrow(() -> new IllegalArgumentException("Provider not found"));

        Transaction transaction = new Transaction(job, customer, provider, amount);
        transaction.setCommittedAt(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    /*
     * =========================================================================
     * PROVIDER ACTIONS
     * =========================================================================
     */

    @Transactional
    public Transaction startWork(Long txId, Long providerId) {
        Transaction tx = getTransaction(txId);

        validateTransition(tx, TransactionStatus.IN_PROGRESS);

        if (!tx.getProvider().getUserId().equals(providerId)) {
            throw new IllegalStateException("Only assigned provider can start work");
        }

        tx.moveToInProgress();

        // Update job status
        Job job = tx.getJob();
        job.setStatus(Job.JobStatus.IN_PROGRESS);
        job.setStartedAt(LocalDateTime.now());
        jobRepository.save(job);

        return transactionRepository.save(tx);
    }

    @Transactional
    public Transaction completeWork(Long txId, Long providerId) {
        Transaction tx = getTransaction(txId);

        validateTransition(tx, TransactionStatus.COMPLETED);

        if (!tx.getProvider().getUserId().equals(providerId)) {
            throw new IllegalStateException("Only assigned provider can complete work");
        }

        tx.moveToCompleted(); // schedules auto-confirm internally

        // Update job status
        Job job = tx.getJob();
        job.setStatus(Job.JobStatus.COMPLETED);
        job.setCompletedAt(LocalDateTime.now());
        jobRepository.save(job);

        return transactionRepository.save(tx);
    }

    /*
     * =========================================================================
     * CUSTOMER ACTIONS
     * =========================================================================
     */

    @Transactional
    public Transaction confirmWork(Long txId, Long customerId) {
        Transaction tx = getTransaction(txId);

        validateTransition(tx, TransactionStatus.CONFIRMED);

        if (!tx.getCustomer().getUserId().equals(customerId)) {
            throw new IllegalStateException("Only customer can confirm work");
        }

        tx.moveToConfirmed();

        return tx;
    }

    @Transactional
    public Transaction releasePayment(Long txId, Long customerId) {
        Transaction tx = getTransaction(txId);

        validateTransition(tx, TransactionStatus.PAID);

        if (!tx.getCustomer().getUserId().equals(customerId)) {
            throw new IllegalStateException("Only customer can release payment");
        }

        releasePaymentInternal(tx);
        return tx;
    }
    
    @Transactional
    public Transaction openDispute(Long txId, Long customerId) {
        Transaction tx = getTransaction(txId);

        validateTransition(tx, TransactionStatus.DISPUTED);

        if (!tx.getCustomer().getUserId().equals(customerId)) {
            throw new IllegalStateException("Only customer can open dispute");
        }

        tx.moveToDisputed();
        return transactionRepository.save(tx);
    }

    /*
     * =========================================================================
     * SCHEDULER ACTION (SYSTEM)
     * =========================================================================
     */

    /**
     * Auto-confirm transaction when customer does not respond in time.
     * Called ONLY by scheduler.
     */
    @Transactional
    public void autoConfirmTransaction(Long txId) {

        Transaction tx = getTransaction(txId);

        // Idempotency guard
        if (tx.getStatus() != TransactionStatus.COMPLETED) {
            return;
        }

        tx.moveToConfirmed();
        releasePaymentInternal(tx);
    }

    /*
     * =========================================================================
     * PAYMENT (INTERNAL ONLY)
     * =========================================================================
     */

    private void releasePaymentInternal(Transaction tx) {

        validateTransition(tx, TransactionStatus.PAID);

        tx.setStatus(TransactionStatus.PAID);
        tx.setResolvedAt(LocalDateTime.now());

        // Platform fee (10%)
        BigDecimal fee = tx.getAmount().multiply(BigDecimal.valueOf(0.10));
        BigDecimal netAmount = tx.getAmount().subtract(fee);

        User provider = tx.getProvider();
        BigDecimal currentBalance = provider.getSimulatedBalance();

        // Audit balances
        tx.setProviderBalanceBefore(currentBalance);
        tx.setProviderBalanceAfter(currentBalance.add(netAmount));

        // Apply balance update
        provider.setSimulatedBalance(currentBalance.add(netAmount));
        userRepository.save(provider);

        // Update job status
        Job job = tx.getJob();
        job.setConfirmedAt(LocalDateTime.now());
        jobRepository.save(job);

        transactionRepository.save(tx);
    }

    /**
     * Get transaction by ID with no access control (used internally by controller)
     * Controller will handle access validation
     */
    public Transaction getTransactionById(Long txId) {
        return transactionRepository.findById(txId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found: " + txId));
    }

    /**
     * Get user's transaction history (both as customer and provider)
     * @param userId - the user ID (can be customer or provider)
     * @param page - page number (0-indexed)
     * @param size - items per page
     * @return paginated list of transactions
     */
    public Page<Transaction> getUserTransactions(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "committedAt"));
        
        // Find all transactions where user is either customer OR provider
        List<Transaction> customerTxs = transactionRepository.findByCustomer_UserId(userId);
        List<Transaction> providerTxs = transactionRepository.findByProvider_UserId(userId);
        
        // Merge and sort by committedAt descending
        List<Transaction> allTxs = new ArrayList<>();
        allTxs.addAll(customerTxs);
        allTxs.addAll(providerTxs);
        
        // Sort by date (newest first)
        allTxs.sort((t1, t2) -> t2.getCommittedAt().compareTo(t1.getCommittedAt()));
        
        // Manual pagination
        int start = page * size;
        int end = Math.min(start + size, allTxs.size());
        
        List<Transaction> pageContent = allTxs.subList(start, end);
        
        return new PageImpl<>(pageContent, pageable, allTxs.size());
    }
}