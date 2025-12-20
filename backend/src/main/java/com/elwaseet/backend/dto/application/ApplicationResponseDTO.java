package com.elwaseet.backend.dto.application;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.elwaseet.backend.entity.Application;
import com.elwaseet.backend.entity.Application.ApplicationStatus;
import com.elwaseet.backend.entity.ApplicationPhoto;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Response DTO for application data
 * Used to return application information to frontend
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponseDTO {

    private Long applicationId;
    private Long jobId;
    private String jobTitle;
    private ProviderDto provider;
    private BigDecimal quotedPrice;
    private String message;
    private String availability;
    private Integer estimatedHours;
    private LocalDateTime availableDate;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
    private List<String> photoUrls;

    /**
     * Convert Application entity to DTO
     */
    public static ApplicationResponseDTO fromEntity(Application application) {
        ApplicationResponseDTO dto = new ApplicationResponseDTO();
        
        dto.setApplicationId(application.getApplicationId());
        dto.setJobId(application.getJob().getJobId());
        dto.setJobTitle(application.getJob().getTitle());
        dto.setQuotedPrice(application.getQuotedPrice());
        dto.setMessage(application.getMessage());
        dto.setAvailability(application.getAvailability());
        dto.setStatus(application.getStatus());
        dto.setAppliedAt(application.getAppliedAt());
        dto.setUpdatedAt(application.getUpdatedAt());
        
        // Map provider info
        ProviderDto providerDto = ProviderDto.builder()
            .userId(application.getProvider().getUserId())
            .name(application.getProvider().getName())
            .email(application.getProvider().getEmail())
            .phone(application.getProvider().getPhone())
            .location(application.getProvider().getLocation())
            .profilePhotoUrl(application.getProvider().getProfilePhotoUrl())
            .build();
        
        // Add profile info if provider has a profile
        // Note: ProviderProfile is separate - would need to fetch it separately
        // For now, we'll set defaults or fetch it in the service layer
        
        dto.setProvider(providerDto);
        
        // Map photo URLs
        List<String> photoUrls = application.getPhotos().stream()
                .map(ApplicationPhoto::getPhotoUrl)
                .collect(Collectors.toList());
        dto.setPhotoUrls(photoUrls);
        
        return dto;
    }
}