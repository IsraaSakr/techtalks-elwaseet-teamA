package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "dispute_appeals")
public class DisputeAppeal {

    /**
     * ============================================================================
     * DISPUTE APPEAL ENTITY
     * ============================================================================
     * If a user is not satisfied with dispute resolution, they may appeal.
     *
     * RELATIONSHIP SUMMARY:
     * - One appeal → belongs to one Dispute (UNIQUE constraint)
     * - One appeal → submitted by one User (appealedBy)
     * - One appeal → reviewed by one AdminUser (optional)
     */

    // Schema: CREATE TYPE appeal_status AS ENUM ('PENDING', 'UNDER_REVIEW', 'FINAL_DECISION');
    public enum AppealStatus {
        PENDING,
        UNDER_REVIEW,
        FINAL_DECISION
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appeal_id")
    private Long appealId;

    /** Appeal belongs to one dispute (UNIQUE - one appeal per dispute max) */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dispute_id", nullable = false, unique = true)
    private Dispute dispute;

    /** The user submitting this appeal */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appealed_by", nullable = false)
    private User appealedBy;

    @NotBlank(message = "Appeal reason is required")
    @Column(name = "appeal_reason", nullable = false, columnDefinition = "TEXT")
    private String appealReason;

    @NotNull(message = "Appeal status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "appeal_status", nullable = false, length = 20)
    private AppealStatus appealStatus = AppealStatus.PENDING;

    @Column(name = "final_resolution", length = 50)
    private String finalResolution;

    @Column(name = "final_notes", columnDefinition = "TEXT")
    private String finalNotes;

    /** Admin who reviewed this appeal */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private AdminUser reviewedBy;

    @Column(name = "appealed_at", nullable = false, updatable = false)
    private LocalDateTime appealedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    /*
     * ============================================================================
     * LIFECYCLE CALLBACKS
     * ============================================================================
     */

    @PrePersist
    protected void onCreate() {
        if (appealedAt == null) {
            appealedAt = LocalDateTime.now();
        }
        if (appealStatus == null) {
            appealStatus = AppealStatus.PENDING;
        }
    }

    /*
     * ============================================================================
     * CONSTRUCTORS
     * ============================================================================
     */

    protected DisputeAppeal() {
    }

    public DisputeAppeal(Dispute dispute, User appealedBy, String appealReason) {
        this.dispute = dispute;
        this.appealedBy = appealedBy;
        this.appealReason = appealReason;
    }

    /*
     * ============================================================================
     * GETTERS & SETTERS
     * ============================================================================
     */

    public Long getAppealId() {
        return appealId;
    }

    public Dispute getDispute() {
        return dispute;
    }

    public void setDispute(Dispute dispute) {
        this.dispute = dispute;
    }

    public User getAppealedBy() {
        return appealedBy;
    }

    public void setAppealedBy(User appealedBy) {
        this.appealedBy = appealedBy;
    }

    public String getAppealReason() {
        return appealReason;
    }

    public void setAppealReason(String appealReason) {
        this.appealReason = appealReason;
    }

    public AppealStatus getAppealStatus() {
        return appealStatus;
    }

    public void setAppealStatus(AppealStatus appealStatus) {
        this.appealStatus = appealStatus;
    }

    public String getFinalResolution() {
        return finalResolution;
    }

    public void setFinalResolution(String finalResolution) {
        this.finalResolution = finalResolution;
    }

    public String getFinalNotes() {
        return finalNotes;
    }

    public void setFinalNotes(String finalNotes) {
        this.finalNotes = finalNotes;
    }

    public AdminUser getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(AdminUser reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public LocalDateTime getAppealedAt() {
        return appealedAt;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    /*
     * ============================================================================
     * EQUALS, HASHCODE, TOSTRING
     * ============================================================================
     */

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof DisputeAppeal)) return false;
        DisputeAppeal that = (DisputeAppeal) o;
        return appealId != null && appealId.equals(that.getAppealId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "DisputeAppeal{" +
                "appealId=" + appealId +
                ", appealStatus=" + appealStatus +
                ", finalResolution='" + finalResolution + '\'' +
                ", appealedAt=" + appealedAt +
                ", reviewedAt=" + reviewedAt +
                '}';
    }
}