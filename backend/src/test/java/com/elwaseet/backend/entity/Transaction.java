package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    public enum TransactionStatus {
        COMMITTED,
        IN_PROGRESS,
        COMPLETED,
        CONFIRMED,
        DISPUTED,
        RESOLVED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false, unique = true)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    private User provider;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private TransactionStatus status;

    @Column(name = "committed_at")
    private LocalDateTime committedAt;

    @Column(name = "in_progress_at")
    private LocalDateTime inProgressAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    @Column(name = "disputed_at")
    private LocalDateTime disputedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "customer_balance_before", precision = 10, scale = 2)
    private BigDecimal customerBalanceBefore;

    @Column(name = "customer_balance_after", precision = 10, scale = 2)
    private BigDecimal customerBalanceAfter;

    @Column(name = "provider_balance_before", precision = 10, scale = 2)
    private BigDecimal providerBalanceBefore;

    @Column(name = "provider_balance_after", precision = 10, scale = 2)
    private BigDecimal providerBalanceAfter;

    @Column(name = "auto_confirm_scheduled_at")
    private LocalDateTime autoConfirmScheduledAt;

    protected Transaction() {
    }
}
