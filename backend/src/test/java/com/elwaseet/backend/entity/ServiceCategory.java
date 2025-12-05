package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "service_categories")
public class ServiceCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryId;

    @Column(name = "category_name", unique = true, nullable = false, length = 100)
    private String categoryName;

    @Column(name = "parent_category", length = 100)
    private String parentCategory;

    @Lob
    private String description;

    @Column(name = "is_active")
    private Boolean isActive;

    // Optional back-references
    @ManyToMany(mappedBy = "categories")
    private Set<ProviderService> providerServices;

    @ManyToMany(mappedBy = "categories")
    private Set<Job> jobs;

    protected ServiceCategory() {
    }
}
