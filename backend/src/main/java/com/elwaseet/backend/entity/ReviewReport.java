package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "review_reports")
public class ReviewReport {

    /**
     * ============================================================================
     * REVIEW REPORT ENTITY
     * ============================================================================
     * Users can report a review if it contains inappropriate content.
     * Admins review these reports and take action.
     *
     * RELATIONSHIP SUMMARY:
     * - Many reports → belong to one Review
     * - Many reports → submitted by one User (reported_by)
     * - Many reports → reviewed by one AdminUser (reviewed_by)
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    /** The review being reported */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    @NotNull(message = "Review is required")
    private Review review;

    /** 
     * The user who submitted the report
     * CRITICAL: Column name is "reported_by" NOT "reported_by_id"
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by", nullable = false)
    @NotNull(message = "Reporter is required")
    private User reportedBy;

    /**
     * Reason for the report (free text)
     * CRITICAL: Schema uses TEXT field, NOT an enum!
     */
    @NotNull(message = "Reason is required")
    @Size(max = 1000, message = "Reason must not exceed 1000 characters")
    @Column(name = "reason", nullable = false, columnDefinition = "TEXT")
    private String reason;

    /**
     * Report status from schema enum
     * Schema enum: ('PENDING', 'REVIEWED', 'DISMISSED')
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "report_status")
    private ReportStatus status = ReportStatus.PENDING;

    /**
     * When the report was submitted
     * Schema: DEFAULT CURRENT_TIMESTAMP
     */
    @Column(name = "reported_at", nullable = false, updatable = false)
    private LocalDateTime reportedAt;

    /**
     * When the report was reviewed by admin
     * CRITICAL: Column name is "reviewed_at" NOT "resolved_at"
     */
    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    /**
     * Admin who reviewed this report
     * FK to admin_users table
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private AdminUser reviewedBy;

    /*
     * ============================================================================
     * ENUM (matches schema)
     * ============================================================================
     */

    /**
     * Report status enum - matches PostgreSQL type
     * CREATE TYPE report_status AS ENUM ('PENDING', 'REVIEWED', 'DISMISSED');
     */
    public enum ReportStatus {
        PENDING,
        REVIEWED,
        DISMISSED
    }

    /*
     * ============================================================================
     * LIFECYCLE CALLBACKS
     * ============================================================================
     */

    @PrePersist
    protected void onCreate() {
        if (reportedAt == null) {
            reportedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = ReportStatus.PENDING;
        }
    }

    /*
     * ============================================================================
     * CONSTRUCTORS
     * ============================================================================
     */

    protected ReviewReport() {
        // JPA requires no-arg constructor
    }

    public ReviewReport(Review review, User reportedBy, String reason) {
        this.review = review;
        this.reportedBy = reportedBy;
        this.reason = reason;
        this.status = ReportStatus.PENDING;
    }

    /*
     * ============================================================================
     * GETTERS & SETTERS
     * ============================================================================
     */

    public Long getReportId() {
        return reportId;
    }

    public Review getReview() {
        return review;
    }

    public void setReview(Review review) {
        this.review = review;
    }

    public User getReportedBy() {
        return reportedBy;
    }

    public void setReportedBy(User reportedBy) {
        this.reportedBy = reportedBy;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
    }

    public LocalDateTime getReportedAt() {
        return reportedAt;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public AdminUser getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(AdminUser reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    /*
     * ============================================================================
     * BUSINESS LOGIC
     * ============================================================================
     */

    /**
     * Mark report as reviewed by an admin
     */
    public void markAsReviewed(AdminUser admin, ReportStatus newStatus) {
        this.reviewedBy = admin;
        this.status = newStatus;
        this.reviewedAt = LocalDateTime.now();
    }

    /**
     * Check if report is still pending
     */
    public boolean isPending() {
        return status == ReportStatus.PENDING;
    }

    /**
     * Check if report has been reviewed
     */
    public boolean isReviewed() {
        return status == ReportStatus.REVIEWED || status == ReportStatus.DISMISSED;
    }

    /*
     * ============================================================================
     * EQUALS, HASHCODE, TOSTRING
     * ============================================================================
     */

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ReviewReport)) return false;
        ReviewReport that = (ReviewReport) o;
        return reportId != null && reportId.equals(that.getReportId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "ReviewReport{" +
                "reportId=" + reportId +
                ", status=" + status +
                ", reportedAt=" + reportedAt +
                '}';
    }
}