package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "application_photos")
public class ApplicationPhoto {

    /**
     * ============================================================================
     * APPLICATION PHOTO ENTITY
     * ============================================================================
     * Providers can upload additional photos as proof of skill or clarification.
     *
     * RELATIONSHIP SUMMARY:
     * - Many application photos → belong to one Application
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Long photoId;

    /** Photo belongs to one application */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(name = "photo_url", length = 500, nullable = false)
    private String photoUrl;

    @Column(name = "upload_order")
    private Integer uploadOrder;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    protected ApplicationPhoto() {
    }
}
