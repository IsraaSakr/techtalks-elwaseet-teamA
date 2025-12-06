package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================================
 * PROVIDER PROFILE ENTITY
 * ============================================================================
 * Represents the service-provider extension of a User account.
 *
 * RELATIONSHIP SUMMARY:
 * - One provider profile → belongs to One User (1:1)
 * - One provider profile → offers many ProviderServices (1:N)
 *
 * NOTES:
 * - This entity exists only for users with AccountType = HYBRID_PROVIDER.
 * - Statistics such as rating, jobs completed, and earnings are stored here.
 */
@Entity
@Table(name = "provider_profiles")
public class ProviderProfile {

    // Schema: CREATE TYPE verification_status AS ENUM ('NONE', 'PENDING', 'APPROVED', 'REJECTED');
    public enum VerificationStatus {
        NONE,
        PENDING,
        APPROVED,
        REJECTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Long profileId;

    /** Each provider profile belongs to exactly one User */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    /** Text describing locations the provider serves */
    @Column(name = "service_areas", columnDefinition = "TEXT")
    private String serviceAreas;

    @Column(name = "availability_description", columnDefinition = "TEXT")
    private String availabilityDescription;

    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;

    @Column(name = "verification_requested_at")
    private LocalDateTime verificationRequestedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false, length = 20)
    private VerificationStatus verificationStatus = VerificationStatus.NONE;

    @DecimalMin(value = "0.00", message = "Rating cannot be negative")
    @DecimalMax(value = "5.00", message = "Rating cannot exceed 5.00")
    @Column(name = "average_rating", nullable = false, precision = 3, scale = 2)
    private BigDecimal averageRating = BigDecimal.ZERO;

    @Min(value = 0, message = "Total reviews cannot be negative")
    @Column(name = "total_reviews", nullable = false)
    private Integer totalReviews = 0;

    @Min(value = 0, message = "Total jobs completed cannot be negative")
    @Column(name = "total_jobs_completed", nullable = false)
    private Integer totalJobsCompleted = 0;

    @DecimalMin(value = "0.00", message = "Total earned cannot be negative")
    @Column(name = "total_earned", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalEarned = BigDecimal.ZERO;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /*
     * ============================================================================
     * RELATIONSHIPS
     * ============================================================================
     */

    /** A provider may offer multiple services */
    @OneToMany(
        mappedBy = "providerProfile", 
        cascade = CascadeType.ALL, 
        fetch = FetchType.LAZY, 
        orphanRemoval = true
    )
    private List<ProviderService> services = new ArrayList<>();

    /*
     * ============================================================================
     * LIFECYCLE CALLBACKS
     * ============================================================================
     */

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        if (updatedAt == null) {
            updatedAt = now;
        }
        if (isVerified == null) {
            isVerified = false;
        }
        if (verificationStatus == null) {
            verificationStatus = VerificationStatus.NONE;
        }
        if (averageRating == null) {
            averageRating = BigDecimal.ZERO;
        }
        if (totalReviews == null) {
            totalReviews = 0;
        }
        if (totalJobsCompleted == null) {
            totalJobsCompleted = 0;
        }
        if (totalEarned == null) {
            totalEarned = BigDecimal.ZERO;
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

    protected ProviderProfile() {
    }

    public ProviderProfile(User user) {
        this.user = user;
    }

    /*
     * ============================================================================
     * GETTERS & SETTERS
     * ============================================================================
     */

    public Long getProfileId() {
        return profileId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getServiceAreas() {
        return serviceAreas;
    }

    public void setServiceAreas(String serviceAreas) {
        this.serviceAreas = serviceAreas;
    }

    public String getAvailabilityDescription() {
        return availabilityDescription;
    }

    public void setAvailabilityDescription(String availabilityDescription) {
        this.availabilityDescription = availabilityDescription;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public LocalDateTime getVerificationRequestedAt() {
        return verificationRequestedAt;
    }

    public void setVerificationRequestedAt(LocalDateTime verificationRequestedAt) {
        this.verificationRequestedAt = verificationRequestedAt;
    }

    public VerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(VerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public BigDecimal getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(BigDecimal averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(Integer totalReviews) {
        this.totalReviews = totalReviews;
    }

    public Integer getTotalJobsCompleted() {
        return totalJobsCompleted;
    }

    public void setTotalJobsCompleted(Integer totalJobsCompleted) {
        this.totalJobsCompleted = totalJobsCompleted;
    }

    public BigDecimal getTotalEarned() {
        return totalEarned;
    }

    public void setTotalEarned(BigDecimal totalEarned) {
        this.totalEarned = totalEarned;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public List<ProviderService> getServices() {
        return services;
    }

    /*
     * ============================================================================
     * BUSINESS LOGIC
     * ============================================================================
     */

    /**
     * Update statistics after a job completion
     */
    public void recordJobCompletion(BigDecimal earnings, BigDecimal newRating) {
        this.totalJobsCompleted++;
        this.totalEarned = this.totalEarned.add(earnings);
        
        // Update average rating
        if (newRating != null) {
            BigDecimal currentTotal = this.averageRating.multiply(
                BigDecimal.valueOf(this.totalReviews)
            );
            this.totalReviews++;
            this.averageRating = currentTotal.add(newRating)
                .divide(BigDecimal.valueOf(this.totalReviews), 2, RoundingMode.HALF_UP);
        }
    }

    /**
     * Check if profile is verified
     */
    public boolean isVerified() {
        return isVerified != null && isVerified;
    }

    /**
     * Request verification
     */
    public void requestVerification() {
        this.verificationStatus = VerificationStatus.PENDING;
        this.verificationRequestedAt = LocalDateTime.now();
    }

    /**
     * Approve verification
     */
    public void approveVerification() {
        this.verificationStatus = VerificationStatus.APPROVED;
        this.isVerified = true;
    }

    /**
     * Reject verification
     */
    public void rejectVerification() {
        this.verificationStatus = VerificationStatus.REJECTED;
        this.isVerified = false;
    }

    /*
     * ============================================================================
     * EQUALS, HASHCODE, TOSTRING
     * ============================================================================
     */

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProviderProfile)) return false;
        ProviderProfile that = (ProviderProfile) o;
        return profileId != null && profileId.equals(that.getProfileId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "ProviderProfile{" +
                "profileId=" + profileId +
                ", isVerified=" + isVerified +
                ", verificationStatus=" + verificationStatus +
                ", averageRating=" + averageRating +
                ", totalReviews=" + totalReviews +
                ", totalJobsCompleted=" + totalJobsCompleted +
                ", totalEarned=" + totalEarned +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}