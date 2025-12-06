package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

/**
 * ============================================================================
 * SERVICE CATEGORY ENTITY
 * ============================================================================
 * Represents a category for services and jobs such as:
 * - Plumbing
 * - Electrical
 * - Cleaning
 * - Painting
 *
 * RELATIONSHIP SUMMARY:
 * - Many categories ↔ many provider services (N:M via provider_service_categories)
 * - Many categories ↔ many jobs (N:M via job_categories)
 *
 * Acts as a shared taxonomy linking job postings and provider offerings.
 */
@Entity
@Table(
    name = "service_categories",
    indexes = {
        @Index(name = "idx_category_name", columnList = "category_name"),
        @Index(name = "idx_category_active", columnList = "is_active")
    }
)
public class ServiceCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryId;

    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Category name must not exceed 100 characters")
    @Column(name = "category_name", unique = true, nullable = false, length = 100)
    private String categoryName;

    @Size(max = 100, message = "Parent category must not exceed 100 characters")
    @Column(name = "parent_category", length = 100)
    private String parentCategory;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    /*
     * ============================================================================
     * RELATIONSHIPS (Bidirectional Many-to-Many)
     * ============================================================================
     */

    /**
     * Provider services linked to this category
     * Junction table: provider_service_categories
     */
    @ManyToMany(mappedBy = "categories", fetch = FetchType.LAZY)
    private Set<ProviderService> providerServices = new HashSet<>();

    /**
     * Jobs linked to this category
     * Junction table: job_categories
     */
    @ManyToMany(mappedBy = "categories", fetch = FetchType.LAZY)
    private Set<Job> jobs = new HashSet<>();

    /*
     * ============================================================================
     * LIFECYCLE CALLBACKS
     * ============================================================================
     */

    @PrePersist
    protected void onCreate() {
        if (isActive == null) {
            isActive = true;
        }
    }

    /*
     * ============================================================================
     * CONSTRUCTORS
     * ============================================================================
     */

    protected ServiceCategory() {
        // JPA requires no-arg constructor
    }

    public ServiceCategory(String categoryName) {
        this.categoryName = categoryName;
        this.isActive = true;
    }

    /*
     * ============================================================================
     * GETTERS & SETTERS
     * ============================================================================
     */

    public Integer getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getParentCategory() {
        return parentCategory;
    }

    public void setParentCategory(String parentCategory) {
        this.parentCategory = parentCategory;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public boolean isActive() {
        return isActive != null && isActive;
    }

    public Set<ProviderService> getProviderServices() {
        return providerServices;
    }

    public Set<Job> getJobs() {
        return jobs;
    }

    /*
     * ============================================================================
     * BUSINESS LOGIC
     * ============================================================================
     */

    public boolean isRootCategory() {
        return parentCategory == null || parentCategory.trim().isEmpty();
    }

    public boolean isSubCategory() {
        return !isRootCategory();
    }

    public void activate() {
        this.isActive = true;
    }

    public void deactivate() {
        this.isActive = false;
    }

    public int getProviderServicesCount() {
        return providerServices != null ? providerServices.size() : 0;
    }

    public int getJobsCount() {
        return jobs != null ? jobs.size() : 0;
    }

    public boolean isInUse() {
        return getProviderServicesCount() > 0 || getJobsCount() > 0;
    }

    /*
     * ============================================================================
     * EQUALS, HASHCODE, TOSTRING
     * ============================================================================
     */

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ServiceCategory)) return false;
        ServiceCategory that = (ServiceCategory) o;
        return categoryId != null && categoryId.equals(that.getCategoryId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "ServiceCategory{" +
                "categoryId=" + categoryId +
                ", categoryName='" + categoryName + '\'' +
                ", parentCategory='" + parentCategory + '\'' +
                ", isActive=" + isActive +
                '}';
    }
}