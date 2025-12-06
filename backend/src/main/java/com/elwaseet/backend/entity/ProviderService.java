package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
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
 * - One service → many service photos (1:N)
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

    @NotBlank(message = "Service name is required")
    @Size(max = 255, message = "Service name must not exceed 255 characters")
    @Column(name = "service_name", nullable = false, length = 255)
    private String serviceName;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Invalid price format")
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /*
     * ============================================================================
     * RELATIONSHIPS
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
    @JoinTable(
        name = "provider_service_categories", 
        joinColumns = @JoinColumn(name = "service_id"), 
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<ServiceCategory> categories = new HashSet<>();

    /**
     * Photos showcasing this specific service
     */
    @OneToMany(
        mappedBy = "service", 
        cascade = CascadeType.ALL, 
        fetch = FetchType.LAZY, 
        orphanRemoval = true
    )
    private List<ServicePhoto> photos = new ArrayList<>();

    /*
     * ============================================================================
     * LIFECYCLE CALLBACKS
     * ============================================================================
     */

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    /*
     * ============================================================================
     * CONSTRUCTORS
     * ============================================================================
     */

    protected ProviderService() {
    }

    public ProviderService(ProviderProfile providerProfile, String serviceName, BigDecimal price) {
        this.providerProfile = providerProfile;
        this.serviceName = serviceName;
        this.price = price;
    }

    /*
     * ============================================================================
     * GETTERS & SETTERS
     * ============================================================================
     */

    public Long getServiceId() {
        return serviceId;
    }

    public ProviderProfile getProviderProfile() {
        return providerProfile;
    }

    public void setProviderProfile(ProviderProfile providerProfile) {
        this.providerProfile = providerProfile;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Set<ServiceCategory> getCategories() {
        return categories;
    }

    public List<ServicePhoto> getPhotos() {
        return photos;
    }

    /*
     * ============================================================================
     * EQUALS, HASHCODE, TOSTRING
     * ============================================================================
     */

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProviderService)) return false;
        ProviderService that = (ProviderService) o;
        return serviceId != null && serviceId.equals(that.getServiceId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "ProviderService{" +
                "serviceId=" + serviceId +
                ", serviceName='" + serviceName + '\'' +
                ", price=" + price +
                ", createdAt=" + createdAt +
                '}';
    }
}