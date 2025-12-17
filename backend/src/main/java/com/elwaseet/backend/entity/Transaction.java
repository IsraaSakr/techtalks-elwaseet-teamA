package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================================
 * TRANSACTION ENTITY
 * ============================================================================
 * Represents the escrow payment between customer and provider after job acceptance.
 *
 * RELATIONSHIP SUMMARY:
 * - One transaction → belongs to one Job (1:1)
 * - One transaction → belongs to one Customer (User)
 * - One transaction → belongs to one Provider (User)
 * - One transaction → may have one Dispute (1:1)
 * - One transaction → may have many Reviews (1:N)
 *
 * PAYMENT FLOW:
 * COMMITTED → IN_PROGRESS → COMPLETED → CONFIRMED (or DISPUTED → RESOLVED)
 */
@Entity
@Table(
    name = "transactions",
    indexes = {
        @Index(name = "idx_transactions_job_id", columnList = "job_id"),
        @Index(name = "idx_transactions_customer_id", columnList = "customer_id"),
        @Index(name = "idx_transactions_provider_id", columnList = "provider_id"),
        @Index(name = "idx_transactions_status", columnList = "status"),
        @Index(name = "idx_transactions_auto_confirm", columnList = "auto_confirm_scheduled_at")
    }
)
public class Transaction {

    /**
     * Transaction status enum - matches PostgreSQL type
     * CREATE TYPE transaction_status AS ENUM (
     *     'COMMITTED', 'IN_PROGRESS', 'COMPLETED', 'CONFIRMED', 'DISPUTED', 'RESOLVED'
     * );
     */
    public enum TransactionStatus {
        COMMITTED,
        IN_PROGRESS,
        COMPLETED,
        CONFIRMED,
        PAID,
        DISPUTED,
        RESOLVED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    /**
     * The job this transaction belongs to (1:1 relationship)
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false, unique = true)
    @NotNull(message = "Job is required")
    private Job job;

    /**
     * Customer who pays
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @NotNull(message = "Customer is required")
    private User customer;

    /**
     * Provider who receives payment
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    @NotNull(message = "Provider is required")
    private User provider;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be positive")
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "transaction_status")
    private TransactionStatus status = TransactionStatus.COMMITTED;

    @Column(name = "committed_at", nullable = false, updatable = false)
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

    /**
     * When to auto-confirm if customer does not respond (48 hours after completed_at)
     */
    @Column(name = "auto_confirm_scheduled_at")
    private LocalDateTime autoConfirmScheduledAt;

    /*
     * ============================================================================
     * RELATIONSHIPS
     * ============================================================================
     */

    /**
     * Dispute associated with this transaction (if any)
     */
    @OneToOne(mappedBy = "transaction", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Dispute dispute;

    /**
     * Reviews associated with this transaction
     */
    @OneToMany(mappedBy = "transaction", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Review> reviews = new ArrayList<>();

    /*
     * ============================================================================
     * LIFECYCLE CALLBACKS
     * ============================================================================
     */

    @PrePersist
    protected void onCreate() {
        if (committedAt == null) {
            committedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = TransactionStatus.COMMITTED;
        }
    }

    /*
     * ============================================================================
     * CONSTRUCTORS
     * ============================================================================
     */

    protected Transaction() {
        // JPA requires no-arg constructor
    }

    public Transaction(Job job, User customer, User provider, BigDecimal amount) {
        this.job = job;
        this.customer = customer;
        this.provider = provider;
        this.amount = amount;
        this.status = TransactionStatus.COMMITTED;
    }

    /*
     * ============================================================================
     * GETTERS & SETTERS
     * ============================================================================
     */

    public Long getTransactionId() {
        return transactionId;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public User getProvider() {
        return provider;
    }

    public void setProvider(User provider) {
        this.provider = provider;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public TransactionStatus getStatus() {
        return status;
    }

    public void setStatus(TransactionStatus status) {
        this.status = status;
    }

    public LocalDateTime getCommittedAt() {
        return committedAt;
    }

    public LocalDateTime getInProgressAt() {
        return inProgressAt;
    }

    public void setInProgressAt(LocalDateTime inProgressAt) {
        this.inProgressAt = inProgressAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public LocalDateTime getConfirmedAt() {
        return confirmedAt;
    }

    public void setConfirmedAt(LocalDateTime confirmedAt) {
        this.confirmedAt = confirmedAt;
    }

    public LocalDateTime getDisputedAt() {
        return disputedAt;
    }

    public void setDisputedAt(LocalDateTime disputedAt) {
        this.disputedAt = disputedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public BigDecimal getCustomerBalanceBefore() {
        return customerBalanceBefore;
    }

    public void setCustomerBalanceBefore(BigDecimal customerBalanceBefore) {
        this.customerBalanceBefore = customerBalanceBefore;
    }

    public BigDecimal getCustomerBalanceAfter() {
        return customerBalanceAfter;
    }

    public void setCustomerBalanceAfter(BigDecimal customerBalanceAfter) {
        this.customerBalanceAfter = customerBalanceAfter;
    }

    public BigDecimal getProviderBalanceBefore() {
        return providerBalanceBefore;
    }

    public void setProviderBalanceBefore(BigDecimal providerBalanceBefore) {
        this.providerBalanceBefore = providerBalanceBefore;
    }

    public BigDecimal getProviderBalanceAfter() {
        return providerBalanceAfter;
    }

    public void setProviderBalanceAfter(BigDecimal providerBalanceAfter) {
        this.providerBalanceAfter = providerBalanceAfter;
    }

    public LocalDateTime getAutoConfirmScheduledAt() {
        return autoConfirmScheduledAt;
    }

    public void setAutoConfirmScheduledAt(LocalDateTime autoConfirmScheduledAt) {
        this.autoConfirmScheduledAt = autoConfirmScheduledAt;
    }

    public Dispute getDispute() {
        return dispute;
    }

    public void setDispute(Dispute dispute) {
        this.dispute = dispute;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    /*
     * ============================================================================
     * BUSINESS LOGIC
     * ============================================================================
     */

    public void moveToInProgress() {
        this.status = TransactionStatus.IN_PROGRESS;
        this.inProgressAt = LocalDateTime.now();
    }

    public void moveToCompleted() {
        this.status = TransactionStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
        // Schedule auto-confirm for 48 hours later
        this.autoConfirmScheduledAt = this.completedAt.plusHours(48);
    }

    public void moveToConfirmed() {
        this.status = TransactionStatus.CONFIRMED;
        this.confirmedAt = LocalDateTime.now();
    }

    public void moveToDisputed() {
        this.status = TransactionStatus.DISPUTED;
        this.disputedAt = LocalDateTime.now();
    }

    public void moveToResolved() {
        this.status = TransactionStatus.RESOLVED;
        this.resolvedAt = LocalDateTime.now();
    }

    public boolean isDisputed() {
        return status == TransactionStatus.DISPUTED;
    }

    public boolean isCompleted() {
        return status == TransactionStatus.COMPLETED;
    }

    public boolean isConfirmed() {
        return status == TransactionStatus.CONFIRMED;
    }

    public boolean canBeConfirmed() {
        return status == TransactionStatus.COMPLETED;
    }

    public boolean canBeDisputed() {
        return status == TransactionStatus.COMPLETED || status == TransactionStatus.CONFIRMED;
    }

    public boolean hasDispute() {
        return dispute != null;
    }

    public boolean isAutoConfirmDue() {
        if (autoConfirmScheduledAt == null || status != TransactionStatus.COMPLETED) {
            return false;
        }
        return LocalDateTime.now().isAfter(autoConfirmScheduledAt);
    }

    /*
     * ============================================================================
     * EQUALS, HASHCODE, TOSTRING
     * ============================================================================
     */

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Transaction)) return false;
        Transaction that = (Transaction) o;
        return transactionId != null && transactionId.equals(that.getTransactionId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Transaction{" +
                "transactionId=" + transactionId +
                ", amount=" + amount +
                ", status=" + status +
                ", committedAt=" + committedAt +
                '}';
    }
}