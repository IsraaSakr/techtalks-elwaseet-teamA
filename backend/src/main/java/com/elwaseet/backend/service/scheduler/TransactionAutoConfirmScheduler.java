package com.elwaseet.backend.service.scheduler;

import com.elwaseet.backend.entity.Transaction;
import com.elwaseet.backend.entity.Transaction.TransactionStatus;
import com.elwaseet.backend.repository.TransactionRepository;
import com.elwaseet.backend.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionAutoConfirmScheduler {

    private final TransactionRepository transactionRepository;
    private final TransactionService transactionService;

    /**
     * Auto-confirm completed transactions when customer does not respond.
     * Runs every hour.
     */
    @Scheduled(fixedRate = 60 * 60 * 1000) // every hour
    @Transactional
    public void autoConfirmTransactions() {

        LocalDateTime now = LocalDateTime.now();

        log.info("[Scheduler] Auto-confirm started at {}", now);

        List<Transaction> transactions = transactionRepository.findByStatusAndAutoConfirmScheduledAtBefore(
                TransactionStatus.COMPLETED,
                now);

        if (transactions.isEmpty()) {
            log.info("[Scheduler] No transactions eligible for auto-confirm");
            return;
        }

        log.info("[Scheduler] Found {} transaction(s) eligible for auto-confirm",
                transactions.size());

        for (Transaction transaction : transactions) {
            try {
                log.info("[Scheduler] Auto-confirming transactionId={}",
                        transaction.getTransactionId());

                transactionService.autoConfirmTransaction(transaction.getTransactionId());

                log.info("[Scheduler] Transaction {} confirmed & paid successfully",
                        transaction.getTransactionId());

            } catch (Exception e) {
                log.error(
                        "[Scheduler] Failed to auto-confirm transactionId={}. Reason={}",
                        transaction.getTransactionId(),
                        e.getMessage());
                // continue processing others
            }
        }

        log.info("[Scheduler] Auto-confirm finished");
    }
}
