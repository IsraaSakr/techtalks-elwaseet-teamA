package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "provider_services")
public class ProviderService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private Long serviceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private ProviderProfile providerProfile;

    @Column(name = "service_name", nullable = false, length = 255)
    private String serviceName;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Lob
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Many-to-many with service categories
    @ManyToMany
    @JoinTable(
            name = "provider_service_categories",
            joinColumns = @JoinColumn(name = "service_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<ServiceCategory> categories;

    protected ProviderService() {
    }
}
