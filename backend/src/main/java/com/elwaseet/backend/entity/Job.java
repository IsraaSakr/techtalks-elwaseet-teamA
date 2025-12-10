package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import jakarta.validation.constraints.Digits;

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

    // Schema: CREATE TYPE urgency_level AS ENUM ('LOW', 'MEDIUM', 'HIGH');
    public enum Urgency {
        LOW, 
        MEDIUM, 
        HIGH
    }

    // Schema: CREATE TYPE job_status AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
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

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @NotBlank(message = "Description is required")
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Minimum budget is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Budget must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Invalid budget format")
    @Column(name = "budget_min", nullable = false, precision = 10, scale = 2)
    private BigDecimal budgetMin;

    @NotNull(message = "Maximum budget is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Budget must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Invalid budget format")
    @Column(name = "budget_max", nullable = false, precision = 10, scale = 2)
    private BigDecimal budgetMax;

    @NotBlank(message = "Location is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "location", nullable = false, length = 20)
    private Location location;

    @NotNull(message = "Urgency level is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "urgency", nullable = false, length = 10)
    private Urgency urgency;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private JobStatus status = JobStatus.OPEN;

    /** Accepted application (if any) */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accepted_application_id", unique = true)
    private Application acceptedApplication;

    @Column(name = "posted_at", nullable = false, updatable = false)
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
    @OneToMany(
        mappedBy = "job", 
        cascade = CascadeType.ALL, 
        fetch = FetchType.LAZY, 
        orphanRemoval = true
    )
    private List<JobPhoto> photos = new ArrayList<>();

    /** Providers apply to the job — core marketplace relation */
    @OneToMany(
        mappedBy = "job", 
        cascade = CascadeType.ALL, 
        fetch = FetchType.LAZY, 
        orphanRemoval = true
    )
    private List<Application> applications = new ArrayList<>();

    /** Transaction created only after a provider is accepted */
    @OneToOne(mappedBy = "job", fetch = FetchType.LAZY)
    private Transaction transaction;

    /** Disputes raised on this job (by customer or provider) */
    @OneToMany(
        mappedBy = "job", 
        cascade = CascadeType.ALL, 
        fetch = FetchType.LAZY, 
        orphanRemoval = true
    )
    private List<Dispute> disputes = new ArrayList<>();

    /**
     * Categories assigned to this job (e.g., Plumbing, Cleaning).
     * Used for search filters, recommendations, and analytics.
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "job_categories", 
        joinColumns = @JoinColumn(name = "job_id"), 
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<ServiceCategory> categories = new HashSet<>();

    /*
     * ============================================================================
     * LIFECYCLE CALLBACKS
     * ============================================================================
     */

    @PrePersist
    protected void onCreate() {
        if (postedAt == null) {
            postedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = JobStatus.OPEN;
        }
    }

    /*
     * ============================================================================
     * CONSTRUCTORS
     * ============================================================================
     */

    protected Job() {
    }

    public Job(User customer, String title, String description, 
               BigDecimal budgetMin, BigDecimal budgetMax, 
               Location location, Urgency urgency) {
        this.customer = customer;
        this.title = title;
        this.description = description;
        this.budgetMin = budgetMin;
        this.budgetMax = budgetMax;
        this.location = location;
        this.urgency = urgency;
    }

    /*
     * ============================================================================
     * GETTERS & SETTERS
     * ============================================================================
     */

    public Long getJobId() {
        return jobId;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getBudgetMin() {
        return budgetMin;
    }

    public void setBudgetMin(BigDecimal budgetMin) {
        this.budgetMin = budgetMin;
    }

    public BigDecimal getBudgetMax() {
        return budgetMax;
    }

    public void setBudgetMax(BigDecimal budgetMax) {
        this.budgetMax = budgetMax;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Urgency getUrgency() {
        return urgency;
    }

    public void setUrgency(Urgency urgency) {
        this.urgency = urgency;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public Application getAcceptedApplication() {
        return acceptedApplication;
    }

    public void setAcceptedApplication(Application acceptedApplication) {
        this.acceptedApplication = acceptedApplication;
    }

    public LocalDateTime getPostedAt() {
        return postedAt;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public LocalDateTime getConfirmedAt() {
        return confirmedAt;
    }

    public void setConfirmedAt(LocalDateTime confirmedAt) {
        this.confirmedAt = confirmedAt;
    }

    public List<JobPhoto> getPhotos() {
        return photos;
    }

    public List<Application> getApplications() {
        return applications;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }

    public List<Dispute> getDisputes() {
        return disputes;
    }

    public Set<ServiceCategory> getCategories() {
        return categories;
    }

    /*
     * ============================================================================
     * BUSINESS LOGIC & VALIDATION
     * ============================================================================
     */

    /**
     * Validates that budget_max >= budget_min (matches DB constraint)
     */
    @AssertTrue(message = "Maximum budget must be greater than or equal to minimum budget")
    public boolean isBudgetValid() {
        if (budgetMin == null || budgetMax == null) {
            return true; // Let @NotNull handle this
        }
        return budgetMax.compareTo(budgetMin) >= 0;
    }

    /**
     * Check if job can accept applications
     */
    public boolean canAcceptApplications() {
        return status == JobStatus.OPEN;
    }

    /**
     * Check if job is completed
     */
    public boolean isCompleted() {
        return status == JobStatus.COMPLETED;
    }

    /**
     * Mark job as in progress
     */
    public void markAsInProgress() {
        this.status = JobStatus.IN_PROGRESS;
        if (this.startedAt == null) {
            this.startedAt = LocalDateTime.now();
        }
    }

    /**
     * Mark job as completed
     */
    public void markAsCompleted() {
        this.status = JobStatus.COMPLETED;
        if (this.completedAt == null) {
            this.completedAt = LocalDateTime.now();
        }
    }

    /**
     * Mark job as confirmed by customer
     */
    public void markAsConfirmed() {
        if (this.confirmedAt == null) {
            this.confirmedAt = LocalDateTime.now();
        }
    }

    /*
     * ============================================================================
     * EQUALS, HASHCODE, TOSTRING
     * ============================================================================
    */

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Job)) return false;
        Job job = (Job) o;
        return jobId != null && jobId.equals(job.getJobId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Job{" +
                "jobId=" + jobId +
                ", title='" + title + '\'' +
                ", location='" + location + '\'' +
                ", budgetMin=" + budgetMin +
                ", budgetMax=" + budgetMax +
                ", urgency=" + urgency +
                ", status=" + status +
                ", postedAt=" + postedAt +
                '}';
    }
}