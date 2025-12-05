package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "email_queue")
public class EmailQueue {

    /**
     * ============================================================================
     * EMAIL QUEUE ENTITY
     * ============================================================================
     * An internal queue for sending notification emails asynchronously.
     *
     * RELATIONSHIP SUMMARY:
     * - Many queued emails → belong to one User
     */

    public enum EmailStatus {
        PENDING,
        SENT,
        FAILED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "email_id")
    private Long emailId;

    /** Recipient user */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_user_id", nullable = false)
    private User recipientUser;

    @Column(name = "subject", length = 255)
    private String subject;

    @Lob
    private String body;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private EmailStatus status;

    @Column(name = "queued_at")
    private LocalDateTime queuedAt;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    protected EmailQueue() {
    }
}
