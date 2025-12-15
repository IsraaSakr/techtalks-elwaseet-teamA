package com.elwaseet.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Data Transfer Object used for updating a provider's profile information.
 *
 * This DTO allows partial updates of profile fields and applies
 * validation constraints to ensure data integrity.
 */
@Data
public class UpdateProfileRequest {

    /**
     * Short biography describing the provider.
     *
     * Optional field, limited to 1000 characters.
     */
    @Size(max = 1000, message = "Bio must not exceed 1000 characters")
    private String bio;

    /**
     * Service areas where the provider operates.
     *
     * Stored as a string in the ProviderProfile entity and
     * limited to 1000 characters.
     */
    @Size(max = 1000, message = "Service areas must not exceed 1000 characters")
    private String serviceAreas;

    /**
     * Description of the provider's availability
     * (e.g., working hours, weekdays).
     *
     * Optional field with a maximum length of 1000 characters.
     */
    @Size(max = 1000, message = "Availability description must not exceed 1000 characters")
    private String availabilityDescription;
}
