package com.elwaseet.backend.model.job;

import com.elwaseet.backend.model.user.User;
import com.elwaseet.backend.model.category.Category;
import com.elwaseet.backend.model.application.Application;
import com.elwaseet.backend.model.review.Review;
import com.elwaseet.backend.model.dispute.Dispute;
import com.elwaseet.backend.model.transaction.Transaction;
import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

    private String title;
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private int budgetMin;
    private int budgetMax;

    @Enumerated(EnumType.STRING)
    private com.elwaseet.backend.model.user.Location location;

    @Enumerated(EnumType.STRING)
    private Urgency urgency;

    private Date preferredDate;

    @Enumerated(EnumType.STRING)
    private JobStatus status;

    @ElementCollection
    private List<String> photos;

    private Date createdAt;
    private Date updatedAt;

    @OneToMany(mappedBy = "job")
    private List<Application> applications;

    @OneToOne(mappedBy = "job")
    private Transaction transaction;

    @OneToMany(mappedBy = "job")
    private List<Review> reviews;

    @OneToMany(mappedBy = "job")
    private List<Dispute> disputes;
}
