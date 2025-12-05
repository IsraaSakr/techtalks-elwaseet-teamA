package com.elwaseet.backend.entity;

import jakarta.persistence.*;
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
 * - Many categories ↔ many provider services (N:M)
 * - Many categories ↔ many jobs (N:M)
 *
 * Acts as a shared taxonomy linking job postings and provider offerings.
 */
@Entity
@Table(name = "service_categories")
public class ServiceCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryId;

    @Column(name = "category_name", unique = true, nullable = false, length = 100)
    private String categoryName;

    /** Optional hierarchical structure: e.g., Plumbing → Bathroom Plumbing */
    @Column(name = "parent_category", length = 100)
    private String parentCategory;

    @Lob
    private String description;

    @Column(name = "is_active")
    private Boolean isActive;

    /*
     * ============================================================================
     * RELATIONSHIPS (Bidirectional Many-to-Many)
     * ============================================================================
     */

    /** Provider services linked to this category */
    @ManyToMany(mappedBy = "categories")
    private Set<ProviderService> providerServices = new HashSet<>();

    /** Jobs linked to this category */
    @ManyToMany(mappedBy = "categories")
    private Set<Job> jobs = new HashSet<>();

    protected ServiceCategory() {
    }
}
