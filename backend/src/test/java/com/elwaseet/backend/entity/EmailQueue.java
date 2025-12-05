package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "email_queue")
public class EmailQueue {

    public enum EmailStatus {
        PENDING,
        SENT,
        FAILED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "email_id")
    private Long emailId;

    @Column(name = "recipient_email", nullable = false, length = 255)
    private String recipientEmail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_user_id")
    private User recipientUser;

    @Column(length = 255)
    private String subject;

    @Lob
    private String body;

    @Column(name = "email_type", length = 50)
    private String emailType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private EmailStatus status;

    private Integer attempts;

    @Lob
    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    protected EmailQueue() {
    }
}
