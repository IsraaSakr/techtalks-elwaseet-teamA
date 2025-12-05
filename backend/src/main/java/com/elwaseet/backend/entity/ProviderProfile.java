package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
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
 * - One provider profile → has many service photos (1:N)
 *
 * NOTES:
 * - This entity exists only for users with AccountType = HYBRID_PROVIDER.
 * - Statistics such as rating, jobs completed, and earnings are stored here.
 */
@Entity
@Table(name = "provider_profiles")
public class ProviderProfile {

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

    @Lob
    private String bio;

    /** JSON-like text describing locations the provider serves */
    @Lob
    @Column(name = "service_areas")
    private String serviceAreas;

    @Lob
    @Column(name = "availability_description")
    private String availabilityDescription;

    @Column(name = "is_verified")
    private Boolean isVerified;

    @Column(name = "verification_requested_at")
    private LocalDateTime verificationRequestedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", length = 20)
    private VerificationStatus verificationStatus;

    @Column(name = "average_rating", precision = 3, scale = 2)
    private BigDecimal averageRating;

    @Column(name = "total_reviews")
    private Integer totalReviews;

    @Column(name = "total_jobs_completed")
    private Integer totalJobsCompleted;

    @Column(name = "total_earned", precision = 10, scale = 2)
    private BigDecimal totalEarned;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /*
     * ============================================================================
     * RELATIONSHIPS (Bidirectional)
     * ============================================================================
     */

    /** A provider may offer multiple services */
    @OneToMany(mappedBy = "providerProfile", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<ProviderService> services = new ArrayList<>();

    /** A provider may upload multiple photos showcasing their work */
    @OneToMany(mappedBy = "providerProfile", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<ServicePhoto> photos = new ArrayList<>();

    protected ProviderProfile() {
    }
}
