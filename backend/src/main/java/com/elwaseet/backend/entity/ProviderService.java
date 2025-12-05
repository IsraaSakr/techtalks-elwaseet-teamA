package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * ============================================================================
 * PROVIDER SERVICE ENTITY
 * ============================================================================
 * Represents a single service offered by a provider, such as:
 * - Plumbing repair
 * - Electrical installation
 * - Custom carpentry
 * - Cleaning
 *
 * RELATIONSHIP SUMMARY:
 * - Many services → belong to one provider profile (N:1)
 * - Many services → have many categories (N:M)
 */
@Entity
@Table(name = "provider_services")
public class ProviderService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private Long serviceId;

    /** Service belongs to one provider profile */
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

    /*
     * ============================================================================
     * CATEGORY RELATIONSHIP (Many-to-Many)
     * ============================================================================
     */

    /**
     * Many services can belong to many categories.
     * Example:
     * - A "Deep cleaning" service may be in both:
     * ✓ Home Cleaning
     * ✓ Deep Cleaning
     * ✓ Sanitization
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "provider_service_categories", joinColumns = @JoinColumn(name = "service_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<ServiceCategory> categories = new HashSet<>();

    protected ProviderService() {
    }
}
