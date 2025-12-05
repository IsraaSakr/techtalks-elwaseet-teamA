package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

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

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Lob
    private String bio;

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

    protected ProviderProfile() {
    }
}
