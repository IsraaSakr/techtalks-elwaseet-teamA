package com.elwaseet.backend.model.category;

import com.elwaseet.backend.model.job.Job;
import com.elwaseet.backend.model.services.Service;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String name;
    private String description;
    private String icon;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Category parent;

    @OneToMany(mappedBy = "parent")
    private List<Category> subcategories;

    @OneToMany(mappedBy = "category")
    private List<Job> jobs;

    @OneToMany(mappedBy = "category")
    private List<Service> services;
}
