package com.elwaseet.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

/**
 * Data Transfer Object used for creating a new service offered by a provider.
 *
 * This DTO is validated at the controller level to ensure that
 * incoming request data meets business and data integrity requirements.
 */
@Data
public class AddServiceRequest {

    /**
     * Name of the service.
     *
     * Must not be blank and is limited to 255 characters to ensure
     * consistency and prevent excessively long input.
     */
    @NotBlank(message = "Service name is required")
    @Size(max = 255, message = "Service name must not exceed 255 characters")
    private String serviceName;

    /**
     * Price of the service.
     *
     * Must be provided and greater than zero.
     * BigDecimal is used to avoid floating-point precision issues.
     */
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    /**
     * Optional description of the service.
     *
     * Limited to 1000 characters to prevent excessive payload size
     * and ensure readability.
     */
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
}
