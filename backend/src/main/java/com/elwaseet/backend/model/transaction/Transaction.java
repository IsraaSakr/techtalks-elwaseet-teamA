package com.elwaseet.backend.model.transaction;

import com.elwaseet.backend.model.job.Job;
import com.elwaseet.backend.model.user.User;
import com.elwaseet.backend.model.dispute.Dispute;
import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "transactions")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "job_id")
    private Job job;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

    @ManyToOne
    @JoinColumn(name = "provider_id")
    private User provider;

    private int amount;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    @Column(columnDefinition = "TEXT")
    private String stateHistory;

    private Date createdAt;
    private Date updatedAt;
    private Date confirmedAt;

    @OneToOne(mappedBy = "transaction")
    private Dispute dispute;
}
