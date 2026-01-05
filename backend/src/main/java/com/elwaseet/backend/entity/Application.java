package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "applications") 
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
        CANCELLED
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
    
    @NotNull(message = "Quoted price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Invalid price format")
    @Column(name = "quoted_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal quotedPrice;
    
    @Column(columnDefinition = "TEXT")
    private String availability;
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ApplicationStatus status = ApplicationStatus.PENDING;
    
    @Column(name = "applied_at", nullable = false, updatable = false)
    private LocalDateTime appliedAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    /*
     * ============================================================================
     * RELATIONSHIPS
     * ============================================================================
     */
    
    /** Photos uploaded by provider for this application */
    @OneToMany(
        mappedBy = "application", 
        cascade = CascadeType.ALL, 
        fetch = FetchType.LAZY, 
        orphanRemoval = true
    )
    private List<ApplicationPhoto> photos = new ArrayList<>();
    
    /*
     * ============================================================================
     * LIFECYCLE CALLBACKS
     * ============================================================================
     */
    
    @PrePersist
    protected void onCreate() {
        if (appliedAt == null) {
            appliedAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = ApplicationStatus.PENDING;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    /*
     * ============================================================================
     * CONSTRUCTORS
     * ============================================================================
     */
    
    protected Application() {
    }
    
    // Builder pattern or constructor with required fields
    public Application(Job job, User provider, BigDecimal quotedPrice) {
        this.job = job;
        this.provider = provider;
        this.quotedPrice = quotedPrice;
    }
    
    /*
     * ============================================================================
     * GETTERS & SETTERS (Add as needed)
     * ============================================================================
     */
    
    public Long getApplicationId() {
        return applicationId;
    }
    
    public Job getJob() {
        return job;
    }
    
    public void setJob(Job job) {
        this.job = job;
    }
    
    public User getProvider() {
        return provider;
    }
    
    public void setProvider(User provider) {
        this.provider = provider;
    }
    
    public BigDecimal getQuotedPrice() {
        return quotedPrice;
    }
    
    public void setQuotedPrice(BigDecimal quotedPrice) {
        this.quotedPrice = quotedPrice;
    }
    
    public String getAvailability() {
        return availability;
    }
    
    public void setAvailability(String availability) {
        this.availability = availability;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public ApplicationStatus getStatus() {
        return status;
    }
    
    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public List<ApplicationPhoto> getPhotos() {
        return photos;
    }
    
    public void addPhoto(ApplicationPhoto photo) {
        photos.add(photo);
        photo.setApplication(this);
    }
    
    public void removePhoto(ApplicationPhoto photo) {
        photos.remove(photo);
        photo.setApplication(null);
    }

    /*
     * ============================================================================
     * EQUALS, HASHCODE, TOSTRING
     * ============================================================================
     */

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Application)) return false;
        Application that = (Application) o;
        return applicationId != null && applicationId.equals(that.getApplicationId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Application{" +
                "applicationId=" + applicationId +
                ", quotedPrice=" + quotedPrice +
                ", status=" + status +
                ", appliedAt=" + appliedAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}