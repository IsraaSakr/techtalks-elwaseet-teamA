package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "disputes")
public class Dispute {

    public enum ReasonCategory {
        WORK_INCOMPLETE,
        WORK_POOR_QUALITY,
        PROVIDER_NO_SHOW,
        PROVIDER_LATE,
        CUSTOMER_CHANGED_REQUIREMENTS,
        PAYMENT_DISPUTE,
        DAMAGED_PROPERTY,
        SAFETY_ISSUE,
        OTHER
    }

    public enum DisputeStatus {
        OPEN,
        UNDER_REVIEW,
        RESOLVED,
        APPEALED
    }

    public enum Resolution {
        PROVIDER_FULL,
        CUSTOMER_FULL,
        SPLIT,
        FIX_REQUIRED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dispute_id")
    private Long disputeId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false, unique = true)
    private Transaction transaction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opened_by", nullable = false)
    private User openedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "reason_category", length = 50)
    private ReasonCategory reasonCategory;

    @Lob
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private DisputeStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "resolution", length = 20)
    private Resolution resolution;

    @Lob
    @Column(name = "resolution_notes")
    private String resolutionNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by")
    private AdminUser resolvedBy;

    @Column(name = "split_percentage_customer", precision = 5, scale = 2)
    private BigDecimal splitPercentageCustomer;

    @Column(name = "split_percentage_provider", precision = 5, scale = 2)
    private BigDecimal splitPercentageProvider;

    @Column(name = "opened_at")
    private LocalDateTime openedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "appeal_deadline")
    private LocalDateTime appealDeadline;

    protected Dispute() {
    }
}
