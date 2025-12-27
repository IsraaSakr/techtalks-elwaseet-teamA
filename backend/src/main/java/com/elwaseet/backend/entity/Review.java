package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "reviews",
    uniqueConstraints = @UniqueConstraint(
        name = "unique_review_per_transaction_per_reviewer",
        columnNames = {"transaction_id", "reviewer_id"}
    )
)
public class Review {

    /**
     * ============================================================================
     * REVIEW ENTITY
     * ============================================================================
     * Represents a rating + written feedback between users.
     *
     * RELATIONSHIP SUMMARY:
     * - Many reviews → belong to one Transaction (NOT Job!)
     * - Many reviews → written by one User (reviewer)
     * - Many reviews → received by one User (reviewee)
     * - One review → may have many reports (ReviewReport)
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;

    /** The transaction this review is about */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;

    /** User who wrote this review */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    /**
     * User being reviewed (customer reviewing provider OR provider reviewing customer)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewee_id", nullable = false)
    private User reviewee;

    /** Rating from 1–5 stars */
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must not exceed 5")
    @Column(name = "rating", nullable = false)
    private Integer rating;

    /** Written feedback (max 500 characters) */
    @Size(max = 500, message = "Comment must not exceed 500 characters")
    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "is_public", nullable = false)
    private Boolean isPublic = true;

    @Column(name = "is_edited", nullable = false)
    private Boolean isEdited = false;

    @Column(name = "review_deadline")
    private LocalDateTime reviewDeadline;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "edit_deadline")
    private LocalDateTime editDeadline;

    /*
     * ============================================================================
     * RELATIONSHIPS
     * ============================================================================
     */

    /** Reports submitted against this review */
    @OneToMany(
        mappedBy = "review", 
        cascade = CascadeType.ALL, 
        fetch = FetchType.LAZY, 
        orphanRemoval = true
    )
    private List<ReviewReport> reports = new ArrayList<>();

    /*
     * ============================================================================
     * LIFECYCLE CALLBACKS
     * ============================================================================
     */

@PrePersist
protected void onCreate() {
    LocalDateTime now = LocalDateTime.now();
    if (createdAt == null) {
        createdAt = now;
    }
    if (updatedAt == null) {
        updatedAt = now;
    }
    if (isPublic == null) {
        isPublic = true;
    }
    if (isEdited == null) {
        isEdited = false;
    }
    // Change from 24 to 48 hours as per requirements
    if (editDeadline == null) {
        editDeadline = createdAt.plusHours(48); // Changed from 24 to 48
    }
}

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /*
     * ============================================================================
     * CONSTRUCTORS
     * ============================================================================
     */

    protected Review() {
    }

    public Review(Transaction transaction, User reviewer, User reviewee, Integer rating) {
        this.transaction = transaction;
        this.reviewer = reviewer;
        this.reviewee = reviewee;
        this.rating = rating;
    }

    /*
     * ============================================================================
     * GETTERS & SETTERS
     * ============================================================================
     */

    public Long getReviewId() {
        return reviewId;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }

    public User getReviewer() {
        return reviewer;
    }

    public void setReviewer(User reviewer) {
        this.reviewer = reviewer;
    }

    public User getReviewee() {
        return reviewee;
    }

    public void setReviewee(User reviewee) {
        this.reviewee = reviewee;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
        if (this.reviewId != null) { // If already persisted
            this.isEdited = true;
        }
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public Boolean getIsEdited() {
        return isEdited;
    }

    public void setIsEdited(Boolean isEdited) {
        this.isEdited = isEdited;
    }

    public LocalDateTime getReviewDeadline() {
        return reviewDeadline;
    }

    public void setReviewDeadline(LocalDateTime reviewDeadline) {
        this.reviewDeadline = reviewDeadline;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public LocalDateTime getEditDeadline() {
        return editDeadline;
    }

    public void setEditDeadline(LocalDateTime editDeadline) {
        this.editDeadline = editDeadline;
    }

    public List<ReviewReport> getReports() {
        return reports;
    }

    /*
     * ============================================================================
     * BUSINESS LOGIC
     * ============================================================================
     */

    /**
     * Check if review can still be edited
     */
    public boolean canEdit() {
        if (editDeadline == null) {
            return false;
        }
        return LocalDateTime.now().isBefore(editDeadline);
    }

    /**
     * Check if review deadline has passed
     */
    public boolean isDeadlinePassed() {
        if (reviewDeadline == null) {
            return false;
        }
        return LocalDateTime.now().isAfter(reviewDeadline);
    }

    /**
     * Validate comment length (matches DB constraint)
     */
    @AssertTrue(message = "Comment must not exceed 500 characters")
    public boolean isCommentLengthValid() {
        if (comment == null) {
            return true;
        }
        return comment.length() <= 500;
    }

    /*
     * ============================================================================
     * EQUALS, HASHCODE, TOSTRING
     * ============================================================================
     */

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Review)) return false;
        Review that = (Review) o;
        return reviewId != null && reviewId.equals(that.getReviewId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Review{" +
                "reviewId=" + reviewId +
                ", rating=" + rating +
                ", isPublic=" + isPublic +
                ", isEdited=" + isEdited +
                ", createdAt=" + createdAt +
                '}';
    }
}