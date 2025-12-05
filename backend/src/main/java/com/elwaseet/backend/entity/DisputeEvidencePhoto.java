package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dispute_evidence_photos")
public class DisputeEvidencePhoto {

    /**
     * ============================================================================
     * DISPUTE EVIDENCE PHOTO ENTITY
     * ============================================================================
     * Evidence uploaded by customer or provider during a dispute.
     *
     * RELATIONSHIP SUMMARY:
     * - Many evidence photos → belong to one Dispute
     * - Many evidence photos → uploaded by one User
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Long photoId;

    /** Photo belongs to a specific dispute */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dispute_id", nullable = false)
    private Dispute dispute;

    /** The user who uploaded this evidence */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_id", nullable = false)
    private User uploadedBy;

    @Column(name = "photo_url", length = 500, nullable = false)
    private String photoUrl;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    protected DisputeEvidencePhoto() {
    }
}
