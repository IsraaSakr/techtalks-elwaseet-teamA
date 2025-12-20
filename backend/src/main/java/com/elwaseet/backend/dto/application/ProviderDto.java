package com.elwaseet.backend.dto.application;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.elwaseet.backend.entity.Location;
import java.math.BigDecimal;

/**
 * Basic provider information DTO
 * Used in ApplicationResponseDTO to show provider details
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderDto {
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private Location location;
    private String profilePhotoUrl;
    
    // Provider Profile fields (if available)
    private BigDecimal averageRating;
    private Integer totalReviews;
    private Integer totalJobsCompleted;
    private Boolean isVerified;
}
