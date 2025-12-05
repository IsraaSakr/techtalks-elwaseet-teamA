package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    /**
     * ============================================================================
     * REVIEW ENTITY
     * ============================================================================
     * Represents a rating + written feedback between users.
     *
     * RELATIONSHIP SUMMARY:
     * - Many reviews → written by one User (reviewer)
     * - Many reviews → received by one User (reviewee)
     * - Many reviews → belong to one Job (for history)
     * - One review → may have many reports (ReviewReport)
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;

    /** User who wrote this review */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    /**
     * User being reviewed (customer reviewing provider OR provider reviewing
     * customer)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewee_id", nullable = false)
    private User reviewee;

    /** The job associated with this review */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    /** Rating from 1–5 stars */
    @Column(nullable = false)
    private Integer rating;

    /** Written feedback */
    @Lob
    private String comment;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    /*
     * ============================================================================
     * RELATIONSHIPS
     * ============================================================================
     */

    /** Reports submitted against this review */
    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private java.util.List<ReviewReport> reports = new java.util.ArrayList<>();

    protected Review() {
    }
}
