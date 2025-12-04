package com.elwaseet.backend.model.application;

import com.elwaseet.backend.model.job.Job;
import com.elwaseet.backend.model.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    @ManyToOne
    @JoinColumn(name = "provider_id")
    private User provider;

    private int quote;
    private String availabilityText;
    private int estimatedHours;
    private String message;

    @ElementCollection
    private List<String> photos;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    private Date createdAt;
}
