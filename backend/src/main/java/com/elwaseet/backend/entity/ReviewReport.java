package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "review_reports")
public class ReviewReport {

    /**
     * ============================================================================
     * REVIEW REPORT ENTITY
     * ============================================================================
     * Users can report a review if it is:
     * - Abusive
     * - Spam
     * - Fake review
     *
     * RELATIONSHIP SUMMARY:
     * - Many reports → belong to one Review
     * - Many reports → submitted by one User
     */

    public enum ReportReason {
        ABUSIVE,
        SPAM,
        MISLEADING,
        OTHER
    }

    public enum ReportStatus {
        PENDING,
        UNDER_REVIEW,
        APPROVED,
        REJECTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    /** The review being reported */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    /** The user who submitted the report */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by_id", nullable = false)
    private User reportedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "reason", length = 30)
    private ReportReason reason;

    @Lob
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private ReportStatus status;

    @Column(name = "reported_at")
    private LocalDateTime reportedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    protected ReviewReport() {
    }
}
