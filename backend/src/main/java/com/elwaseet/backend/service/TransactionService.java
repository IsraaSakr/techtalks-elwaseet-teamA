package com.elwaseet.backend.service;

import com.elwaseet.backend.entity.Transaction;
import com.elwaseet.backend.entity.Transaction.TransactionStatus;
import com.elwaseet.backend.policy.TransactionTransitionPolicy;
import com.elwaseet.backend.repository.TransactionRepository;
import com.elwaseet.backend.entity.Job;
import com.elwaseet.backend.repository.JobRepository;
import com.elwaseet.backend.entity.User;
import com.elwaseet.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final TransactionTransitionPolicy transitionPolicy;

    public TransactionService(TransactionRepository transactionRepository,
                              JobRepository jobRepository,
                              UserRepository userRepository,
                              TransactionTransitionPolicy transitionPolicy) {
        this.transactionRepository = transactionRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.transitionPolicy = transitionPolicy;
    }

    // --- Utility ---
    @Transactional
    private Transaction getTransaction(Long txId) {
        return transactionRepository.findById(txId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found: " + txId));
    }

    @Transactional
    private void validateTransition(Transaction tx, TransactionStatus next) {
        transitionPolicy.assertTransition(tx.getStatus(), next);
    }

    // --- State Transitions ---
    @Transactional
    public Transaction commit(Long jobId,Long customerId,Long providerId, BigDecimal amount) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        User provider = userRepository.findById(providerId)
                .orElseThrow(() -> new IllegalArgumentException("Provider not found"));

        Transaction tx = new Transaction(job, customer, provider, amount);
        tx.setCommittedAt(LocalDateTime.now());
        return transactionRepository.save(tx);
    }

    @Transactional
    public Transaction startWork(Long txId, Long providerId) {
        Transaction tx = getTransaction(txId);
        validateTransition(tx, TransactionStatus.IN_PROGRESS);
        if (!tx.getProvider().getUserId().equals(providerId)) {
            throw new IllegalStateException("Only assigned provider can start work");
        }
        tx.setStatus(TransactionStatus.IN_PROGRESS);
        tx.setInProgressAt(LocalDateTime.now());
        return transactionRepository.save(tx);
    }

    @Transactional
    public Transaction completeWork(Long txId, Long providerId) {
        Transaction tx = getTransaction(txId);
        validateTransition(tx, TransactionStatus.COMPLETED);
        if (!tx.getProvider().getUserId().equals(providerId)) {
            throw new IllegalStateException("Only assigned provider can complete work");
        }
        tx.setStatus(TransactionStatus.COMPLETED);
        tx.setCompletedAt(LocalDateTime.now());
        tx.setAutoConfirmScheduledAt(LocalDateTime.now().plusHours(24)); // Auto-confirm after 24 hours
        return transactionRepository.save(tx);
    }

    @Transactional
    public Transaction confirmWork(Long txId, Long customerId) {
        Transaction tx = getTransaction(txId);
        validateTransition(tx, TransactionStatus.CONFIRMED);
        if (!tx.getCustomer().getUserId().equals(customerId)) {
            throw new IllegalStateException("Only customer can confirm work");
        }
        tx.setStatus(TransactionStatus.CONFIRMED);
        tx.setConfirmedAt(LocalDateTime.now());
        return transactionRepository.save(tx);
    }

    @Transactional
    public Transaction releasePayment(Long txId) {
        Transaction tx = getTransaction(txId);
        validateTransition(tx, TransactionStatus.PAID);

        tx.setStatus(TransactionStatus.PAID);
        tx.setResolvedAt(LocalDateTime.now());

        // Fee calculation
        BigDecimal fee = tx.getAmount().multiply(BigDecimal.valueOf(0.1));
        BigDecimal net = tx.getAmount().subtract(fee);

        // Get current balance from provider
        User provider = tx.getProvider();
        BigDecimal currentBalance = provider.getSimulatedBalance();

        // Record balance changes
        tx.setProviderBalanceBefore(currentBalance);
        tx.setProviderBalanceAfter(currentBalance.add(net));

        // Update the provider's balance
        provider.setSimulatedBalance(currentBalance.add(net));
        userRepository.save(provider);

        return transactionRepository.save(tx);
    }

    @Transactional
    public Transaction openDispute(Long txId, Long customerId) {
        Transaction tx = getTransaction(txId);
        validateTransition(tx, TransactionStatus.DISPUTED);
        if (!tx.getCustomer().getUserId().equals(customerId)) {
            throw new IllegalStateException("Only customer can open dispute");
        }
        tx.setStatus(TransactionStatus.DISPUTED);
        tx.setDisputedAt(LocalDateTime.now());
        return transactionRepository.save(tx);
    }
}