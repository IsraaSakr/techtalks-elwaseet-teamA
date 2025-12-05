package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    /**
     * ============================================================================
     * TRANSACTION ENTITY
     * ============================================================================
     * Represents the payment between customer and provider AFTER a job is accepted.
     *
     * RELATIONSHIP SUMMARY:
     * - One transaction → belongs to one Job (1:1)
     * - One transaction → belongs to one Customer (User)
     * - One transaction → belongs to one Provider (User)
     *
     * PAYMENT FLOW:
     * - Customer deposits amount (simulated balance reduced)
     * - Provider receives payment after job completion/confirmation
     * - Recorded amounts: subtotal, fees, tax, provider earning
     */

    public enum PaymentStatus {
        PENDING,
        ESCROW_HELD,
        RELEASED,
        REFUNDED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    /** The job this transaction belongs to */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false, unique = true)
    private Job job;

    /** Customer who pays */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    /** Provider who receives payment */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    private User provider;

    @Column(name = "amount", precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "platform_fee", precision = 10, scale = 2)
    private BigDecimal platformFee;

    @Column(name = "tax_amount", precision = 10, scale = 2)
    private BigDecimal taxAmount;

    /** Final amount provider receives */
    @Column(name = "provider_earning", precision = 10, scale = 2)
    private BigDecimal providerEarning;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", length = 20)
    private PaymentStatus paymentStatus;

    protected Transaction() {
    }
}
