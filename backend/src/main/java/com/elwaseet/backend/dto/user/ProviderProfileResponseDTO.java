package com.elwaseet.backend.dto.user;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

import com.elwaseet.backend.entity.User;
import com.elwaseet.backend.dto.service.ServiceDTO;
import com.elwaseet.backend.entity.ProviderProfile;

/**
 * Response Data Transfer Object representing a provider's full profile.
 *
 * This DTO aggregates data from both {@link User} and {@link ProviderProfile}
 * entities and is used to expose provider information to clients
 * in a controlled and API-friendly format.
 */
@Data
public class ProviderProfileResponseDTO {

    /* =========================
       Basic user information
       ========================= */

    /**
     * Unique identifier of the provider user.
     */
    private Long userId;

    /**
     * Full name of the provider.
     */
    private String name;

    /**
     * Email address of the provider.
     */
    private String email;

    /**
     * Contact phone number of the provider.
     */
    private String phone;

    /**
     * Provider's primary location.
     */
    private String location;

    /**
     * Public URL of the provider's profile photo.
     */
    private String profilePhotoUrl;

    /* =========================
       Provider profile details
       ========================= */

    /**
     * Short biography describing the provider.
     */
    private String bio;

    /**
     * Areas or regions where the provider offers services.
     */
    private String serviceAreas;

    /**
     * Description of provider availability (e.g., working hours).
     */
    private String availabilityDescription;

    /**
     * Average rating calculated from customer reviews.
     */
    private BigDecimal averageRating;

    /**
     * Total number of reviews received by the provider.
     */
    private Integer totalReviews;

    /**
     * Total number of completed jobs.
     */
    private Integer totalJobsCompleted;

    /**
     * Total earnings accumulated by the provider.
     */
    private BigDecimal totalEarned;

    /**
     * Indicates whether the provider is verified by the platform.
     */
    private Boolean isVerified;

    /* =========================
       Related resources
       ========================= */

    /**
     * List of services offered by the provider.
     */
    private List<ServiceDTO> services;

    /**
     * List of portfolio photos associated with the provider.
     */
    private List<PortfolioPhotoDTO> portfolioPhotos;

    /**
     * Constructs a response DTO by combining {@link User} and
     * {@link ProviderProfile} entity data.
     *
     * @param user    the user entity containing basic account information
     * @param profile the provider profile entity containing extended details
     */
    public ProviderProfileResponseDTO(User user, ProviderProfile profile) {

        // Map user-level fields
        this.userId = user.getUserId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.location = user.getLocation().name();
        this.profilePhotoUrl = user.getProfilePhotoUrl();

        // Map provider-specific fields if profile exists
        if (profile != null) {
            this.bio = profile.getBio();
            this.serviceAreas = profile.getServiceAreas();
            this.availabilityDescription = profile.getAvailabilityDescription();
            this.averageRating = profile.getAverageRating();
            this.totalReviews = profile.getTotalReviews();
            this.totalJobsCompleted = profile.getTotalJobsCompleted();
            this.totalEarned = profile.getTotalEarned();
            this.isVerified = profile.getIsVerified();
        }
    }
}
