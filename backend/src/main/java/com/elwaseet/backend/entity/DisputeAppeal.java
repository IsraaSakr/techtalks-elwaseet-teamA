package com.elwaseet.backend.entity;

import jakarta.persistence.*;
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
     * - Many appeals → belong to one Dispute
     * - Many appeals → belong to one User (appealedBy)
     */

    public enum AppealStatus {
        PENDING,
        APPROVED,
        REJECTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appeal_id")
    private Long appealId;

    /** Appeal belongs to one dispute */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dispute_id", nullable = false)
    private Dispute dispute;

    /** The user submitting this appeal */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appealed_by_id", nullable = false)
    private User appealedBy;

    @Lob
    @Column(name = "appeal_text")
    private String appealText;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private AppealStatus status;

    @Column(name = "appealed_at")
    private LocalDateTime appealedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    protected DisputeAppeal() {
    }
}
