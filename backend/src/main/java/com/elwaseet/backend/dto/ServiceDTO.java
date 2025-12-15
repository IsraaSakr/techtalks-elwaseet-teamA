package com.elwaseet.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

import com.elwaseet.backend.entity.ProviderService;

/**
 * Data Transfer Object representing a service offered by a provider.
 *
 * This DTO is used to expose service information to API consumers
 * without exposing internal persistence entities.
 */
@Data
public class ServiceDTO {

    /**
     * Unique identifier of the service.
     */
    private Long serviceId;

    /**
     * Display name of the service.
     */
    private String serviceName;

    /**
     * Price of the service.
     *
     * BigDecimal is used to ensure accuracy for monetary values.
     */
    private BigDecimal price;

    /**
     * Optional description providing additional details about the service.
     */
    private String description;

    /**
     * Constructs a {@code ServiceDTO} from a {@link ProviderService} entity.
     *
     * @param service the provider service entity to convert
     */
    public ServiceDTO(ProviderService service) {
        this.serviceId = service.getServiceId();
        this.serviceName = service.getServiceName();
        this.price = service.getPrice();
        this.description = service.getDescription();
    }
}
