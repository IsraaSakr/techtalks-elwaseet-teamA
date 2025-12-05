package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "disputes")
public class Dispute {

    /**
     * ============================================================================
     * DISPUTE ENTITY
     * ============================================================================
     * A dispute is opened when a customer or provider disagrees about:
     * - Job quality
     * - Job completion
     * - Payment release
     *
     * RELATIONSHIP SUMMARY:
     * - Many disputes → belong to one Job
     * - Many disputes → belong to the User who opened them
     * - One dispute → many Evidence Photos
     * - One dispute → many Appeals
     */

    public enum DisputeStatus {
        OPEN,
        UNDER_REVIEW,
        RESOLVED_CUSTOMER,
        RESOLVED_PROVIDER,
        CANCELLED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dispute_id")
    private Long disputeId;

    /** Job the dispute is about */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    /** User (customer or provider) who opened this dispute */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opened_by_id", nullable = false)
    private User openedBy;

    @Lob
    private String complaintText;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 30)
    private DisputeStatus status;

    @Column(name = "opened_at")
    private LocalDateTime openedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    /*
     * ============================================================================
     * RELATIONSHIPS
     * ============================================================================
     */

    /** Evidence photos uploaded for this dispute */
    @OneToMany(mappedBy = "dispute", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<DisputeEvidencePhoto> evidencePhotos = new ArrayList<>();

    /** Appeals submitted by either party */
    @OneToMany(mappedBy = "dispute", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<DisputeAppeal> appeals = new ArrayList<>();

    protected Dispute() {
    }
}
