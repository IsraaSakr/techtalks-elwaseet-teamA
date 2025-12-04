package com.elwaseet.backend.model.services;

import com.elwaseet.backend.model.user.User;
import com.elwaseet.backend.model.category.Category;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "services")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "provider_id")
    private User provider;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private String name;
    private String priceText;
    private String description;
}
