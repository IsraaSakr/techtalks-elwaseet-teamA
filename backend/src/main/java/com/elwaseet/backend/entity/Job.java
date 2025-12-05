package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "jobs")
public class Job {

    /**
     * ============================================================================
     * JOB ENTITY
     * ============================================================================
     * Represents a job posted by a customer.
     *
     * RELATIONSHIP SUMMARY:
     * - Many jobs → belong to one User (customer)
     * - One job → many JobPhotos
     * - One job → many Applications (providers apply)
     * - One job → one accepted application (nullable)
     * - One job → one Transaction (created only after acceptance)
     * - One job → many Disputes (job may be disputed)
     * - One job ↔ many Categories (categorization for search/recommendation)
     *
     * Job lifecycle typically:
     * POSTED → PROVIDERS APPLY → CUSTOMER ACCEPTS ONE → IN PROGRESS → COMPLETED
     */

    public enum Urgency {
        LOW, MEDIUM, HIGH
    }

    public enum JobStatus {
        OPEN,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Long jobId;

    /** Customer who posted the job */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(nullable = false, length = 255)
    private String title;

    @Lob
    private String description;

    /** Optional budget range fields */
    @Column(name = "budget_min", precision = 10, scale = 2)
    private BigDecimal budgetMin;

    @Column(name = "budget_max", precision = 10, scale = 2)
    private BigDecimal budgetMax;

    @Column(length = 255)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "urgency", length = 10)
    private Urgency urgency;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private JobStatus status;

    /** Accepted application (if any) */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accepted_application_id", unique = true)
    private Application acceptedApplication;

    @Column(name = "posted_at")
    private LocalDateTime postedAt;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    /*
     * ============================================================================
     * RELATIONSHIPS
     * ============================================================================
     */

    /** Photos uploaded by the customer describing the job */
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<JobPhoto> photos = new ArrayList<>();

    /** Providers apply to the job — core marketplace relation */
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Application> applications = new ArrayList<>();

    /** Transaction created only after a provider is accepted */
    @OneToOne(mappedBy = "job", fetch = FetchType.LAZY)
    private Transaction transaction;

    /** Disputes raised on this job (by customer or provider) */
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Dispute> disputes = new ArrayList<>();

    /**
     * Categories assigned to this job (e.g., Plumbing, Cleaning).
     * Used for search filters, recommendations, and analytics.
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "job_categories", joinColumns = @JoinColumn(name = "job_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<ServiceCategory> categories = new HashSet<>();

    protected Job() {
    }
}
