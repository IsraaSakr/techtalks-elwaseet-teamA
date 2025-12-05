package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dispute_appeals")
public class DisputeAppeal {

    public enum AppealStatus {
        PENDING,
        UNDER_REVIEW,
        FINAL_DECISION
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appeal_id")
    private Long appealId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dispute_id", nullable = false, unique = true)
    private Dispute dispute;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appealed_by", nullable = false)
    private User appealedBy;

    @Lob
    @Column(name = "appeal_reason")
    private String appealReason;

    @Enumerated(EnumType.STRING)
    @Column(name = "appeal_status", length = 20)
    private AppealStatus appealStatus;

    @Column(name = "final_resolution", length = 50)
    private String finalResolution;

    @Lob
    @Column(name = "final_notes")
    private String finalNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private AdminUser reviewedBy;

    @Column(name = "appealed_at")
    private LocalDateTime appealedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    protected DisputeAppeal() {
    }
}
