package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * ============================================================================
 * SERVICE PHOTO ENTITY
 * ============================================================================
 * Stores photos uploaded by a provider to showcase previous work.
 *
 * RELATIONSHIP SUMMARY:
 * - Many photos → belong to one provider profile (N:1)
 */
@Entity
@Table(name = "service_photos")
public class ServicePhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Long photoId;

    /** Photo belongs to one provider profile */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private ProviderProfile providerProfile;

    @Column(name = "photo_url", length = 500, nullable = false)
    private String photoUrl;

    /** Defines photo order in gallery */
    @Column(name = "upload_order")
    private Integer uploadOrder;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    protected ServicePhoto() {
    }
}
