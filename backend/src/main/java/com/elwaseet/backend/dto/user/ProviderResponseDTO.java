package com.elwaseet.backend.dto.user;

import java.math.BigDecimal;
import com.elwaseet.backend.entity.ProviderProfile;
import lombok.Data;

@Data
public class ProviderResponseDTO {
    private Long profileId;
    private String userName;
    private String bio;
    private String serviceAreas;
    private String availabilityDescription;
    private Boolean isVerified;
    private BigDecimal averageRating;
    private Integer totalReviews;
    private Integer totalJobsCompleted;
    private BigDecimal totalEarned;

    public static ProviderResponseDTO fromEntity(ProviderProfile provider) {
        ProviderResponseDTO dto = new ProviderResponseDTO();
        dto.setProfileId(provider.getProfileId());

        if (provider.getUser() != null) {
            dto.setUserName(provider.getUser().getName()); 
            // or provider.getUser().getUsername() depending on your User entity
        }

        dto.setBio(provider.getBio());
        dto.setServiceAreas(provider.getServiceAreas());
        dto.setAvailabilityDescription(provider.getAvailabilityDescription());
        dto.setIsVerified(provider.getIsVerified());

        if (provider.getAverageRating() != null) {
            dto.setAverageRating(provider.getAverageRating());
        }
        dto.setTotalReviews(provider.getTotalReviews());
        dto.setTotalJobsCompleted(provider.getTotalJobsCompleted());

        if (provider.getTotalEarned() != null) {
            dto.setTotalEarned(provider.getTotalEarned());
        }

        return dto;
    }
}
