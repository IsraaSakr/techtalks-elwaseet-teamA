package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "applications", uniqueConstraints = @UniqueConstraint(name = "uk_application_provider_job", columnNames = {
        "provider_id", "job_id" }))
public class Application {

    /**
     * ============================================================================
     * APPLICATION ENTITY
     * ============================================================================
     * Represents a provider applying to a job.
     *
     * RELATIONSHIP SUMMARY:
     * - Many applications → belong to one Job
     * - Many applications → belong to one Provider (User)
     * - One application → many ApplicationPhotos
     * - One job may accept ONE application (Job.acceptedApplication)
     */

    public enum ApplicationStatus {
        PENDING,
        ACCEPTED,
        REJECTED,
        WITHDRAWN
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long applicationId;

    /** Application belongs to one Job */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    /** Application submitted by provider (User) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    private User provider;

    @Column(name = "quoted_price", precision = 10, scale = 2)
    private BigDecimal quotedPrice;

    @Lob
    private String availability;

    @Lob
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private ApplicationStatus status;

    @Column(name = "applied_at")
    private LocalDateTime appliedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /*
     * ============================================================================
     * RELATIONSHIPS
     * ============================================================================
     */

    /** Photos uploaded by provider for this application */
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<ApplicationPhoto> photos = new ArrayList<>();

    protected Application() {
    }
}
