package com.elwaseet.backend.model.dispute;

import com.elwaseet.backend.model.job.Job;
import com.elwaseet.backend.model.user.User;
import com.elwaseet.backend.model.transaction.Transaction;

import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "disputes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dispute {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    @ManyToOne
    @JoinColumn(name = "opened_by_id")
    private User openedBy;

    @OneToOne
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    private String reasonCategory;
    private String reasonText;

    @ElementCollection
    private List<String> customerEvidencePhotos;

    @ElementCollection
    private List<String> providerEvidencePhotos;

    private String customerEvidenceText;
    private String providerEvidenceText;

    @Enumerated(EnumType.STRING)
    private AdminDecision adminDecision;

    private String adminNotes;
    private Integer providerPercentage;

    @Enumerated(EnumType.STRING)
    private DisputeStatus status;

    private Date createdAt;
    private Date resolvedAt;
}
