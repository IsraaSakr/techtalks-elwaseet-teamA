package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_photos")
public class JobPhoto {

    /**
     * ============================================================================
     * JOB PHOTO ENTITY
     * ============================================================================
     * Photos uploaded by the customer describing the job request.
     *
     * RELATIONSHIP SUMMARY:
     * - Many photos → belong to one Job
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Long photoId;

    /** Photo belongs to one Job */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "photo_url", length = 500, nullable = false)
    private String photoUrl;

    /** Used to keep photos ordered in lists */
    @Column(name = "upload_order")
    private Integer uploadOrder;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    protected JobPhoto() {
    }
}
