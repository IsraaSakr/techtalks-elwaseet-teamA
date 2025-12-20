package com.elwaseet.backend.dto.application;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Request DTO for creating a new job application
 * Used in ApplicationController.applyToJob()
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationCreateDTO {

    @NotNull(message = "Quoted price is required")
    @DecimalMin(value = "0.01", message = "Quote must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Invalid price format")
    private BigDecimal quotedPrice;

    @Size(max = 1000, message = "Message cannot exceed 1000 characters")
    private String message;

    @Size(max = 500, message = "Availability description cannot exceed 500 characters")
    private String availability;

    @Min(value = 1, message = "Estimated hours must be at least 1")
    @Max(value = 1000, message = "Estimated hours cannot exceed 1000")
    private Integer estimatedHours;

    @Future(message = "Available date must be in the future")
    private LocalDateTime availableDate;
}