package com.elwaseet.backend.model.user;

import com.elwaseet.backend.model.job.Job;
import com.elwaseet.backend.model.application.Application;
import com.elwaseet.backend.model.notification.Notification;
import com.elwaseet.backend.model.review.Review;
import com.elwaseet.backend.model.profile.ProviderProfile;
import com.elwaseet.backend.model.transaction.Transaction;
import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "users")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public enum Role {
    CUSTOMER, HYBRID_PROVIDER, ADMIN
}

public enum Location {
    BEIRUT, MOUNT_LEBANON, NORTH, SOUTH, BEKAA, NABATIEH
}

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true)
    private String email;

    private String password;
    private String fullName;
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private Location location;

    @Enumerated(EnumType.STRING)
    private Role role;

    private boolean verified;
    private double averageRating;
    private int reviewCount;
    private int balance;

    private Date createdAt;
    private Date updatedAt;

    // RELATIONSHIPS
    @OneToMany(mappedBy = "customer")
    private List<Job> jobs;

    @OneToMany(mappedBy = "provider")
    private List<Application> applications;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private ProviderProfile profile;

    @OneToMany(mappedBy = "reviewer")
    private List<Review> reviewsWritten;

    @OneToMany(mappedBy = "reviewee")
    private List<Review> reviewsReceived;

    @OneToMany(mappedBy = "user")
    private List<Notification> notifications;
}
