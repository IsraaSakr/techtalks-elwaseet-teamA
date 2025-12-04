package com.elwaseet.backend.model.review;

import com.elwaseet.backend.model.job.Job;
import com.elwaseet.backend.model.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    @ManyToOne
    @JoinColumn(name = "reviewer_id")
    private User reviewer;

    @ManyToOne
    @JoinColumn(name = "reviewee_id")
    private User reviewee;

    private int rating;

    private String comment;

    private boolean isPublic;
    // true -> customer → provider (public)
    // false -> provider → customer (private)

    private Date createdAt;
    private Date updatedAt;
}
