package com.elwaseet.backend.dto;


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
    private Double averageRating;
    private Integer totalReviews;
    private Integer totalJobsCompleted;
    private Double totalEarned;

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
            dto.setAverageRating(provider.getAverageRating().doubleValue());
        }
        dto.setTotalReviews(provider.getTotalReviews());
        dto.setTotalJobsCompleted(provider.getTotalJobsCompleted());

        if (provider.getTotalEarned() != null) {
            dto.setTotalEarned(provider.getTotalEarned().doubleValue());
        }

        return dto;
    }
}
