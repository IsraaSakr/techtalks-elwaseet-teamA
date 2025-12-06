package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
     * - Many queued emails → may belong to one User (optional - can be null)
     */

    // Schema: CREATE TYPE email_status AS ENUM ('PENDING', 'SENT', 'FAILED');
    public enum EmailStatus {
        PENDING,
        SENT,
        FAILED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "email_id")
    private Long emailId;

    @NotBlank(message = "Recipient email is required")
    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    @Column(name = "recipient_email", nullable = false, length = 255)
    private String recipientEmail;

    /** 
     * Recipient user (OPTIONAL - can be null for emails to non-users)
     * ON DELETE SET NULL means this can be null if user is deleted
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_user_id")  // No nullable = false!
    private User recipientUser;

    @NotBlank(message = "Subject is required")
    @Size(max = 255, message = "Subject must not exceed 255 characters")
    @Column(name = "subject", nullable = false, length = 255)
    private String subject;

    @NotBlank(message = "Body is required")
    @Column(name = "body", nullable = false, columnDefinition = "TEXT")
    private String body;

    @NotBlank(message = "Email type is required")
    @Size(max = 50, message = "Email type must not exceed 50 characters")
    @Column(name = "email_type", nullable = false, length = 50)
    private String emailType;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private EmailStatus status = EmailStatus.PENDING;

    @Column(name = "attempts", nullable = false)
    private Integer attempts = 0;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    /*
     * ============================================================================
     * LIFECYCLE CALLBACKS
     * ============================================================================
     */

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = EmailStatus.PENDING;
        }
        if (attempts == null) {
            attempts = 0;
        }
    }

    /*
     * ============================================================================
     * CONSTRUCTORS
     * ============================================================================
     */

    protected EmailQueue() {
    }

    public EmailQueue(String recipientEmail, String subject, String body, String emailType) {
        this.recipientEmail = recipientEmail;
        this.subject = subject;
        this.body = body;
        this.emailType = emailType;
    }

    public EmailQueue(User recipientUser, String recipientEmail, String subject, 
                      String body, String emailType) {
        this.recipientUser = recipientUser;
        this.recipientEmail = recipientEmail;
        this.subject = subject;
        this.body = body;
        this.emailType = emailType;
    }

    /*
     * ============================================================================
     * GETTERS & SETTERS
     * ============================================================================
     */

    public Long getEmailId() {
        return emailId;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public User getRecipientUser() {
        return recipientUser;
    }

    public void setRecipientUser(User recipientUser) {
        this.recipientUser = recipientUser;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getEmailType() {
        return emailType;
    }

    public void setEmailType(String emailType) {
        this.emailType = emailType;
    }

    public EmailStatus getStatus() {
        return status;
    }

    public void setStatus(EmailStatus status) {
        this.status = status;
    }

    public Integer getAttempts() {
        return attempts;
    }

    public void setAttempts(Integer attempts) {
        this.attempts = attempts;
    }

    public void incrementAttempts() {
        this.attempts++;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    /*
     * ============================================================================
     * BUSINESS LOGIC
     * ============================================================================
     */

    /**
     * Mark email as sent successfully
     */
    public void markAsSent() {
        this.status = EmailStatus.SENT;
        this.sentAt = LocalDateTime.now();
    }

    /**
     * Mark email as failed with error message
     */
    public void markAsFailed(String errorMessage) {
        this.status = EmailStatus.FAILED;
        this.errorMessage = errorMessage;
        incrementAttempts();
    }

    /*
     * ============================================================================
     * EQUALS, HASHCODE, TOSTRING
     * ============================================================================
    */

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EmailQueue)) return false;
        EmailQueue that = (EmailQueue) o;
        return emailId != null && emailId.equals(that.getEmailId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "EmailQueue{" +
                "emailId=" + emailId +
                ", recipientEmail='" + recipientEmail + '\'' +
                ", subject='" + subject + '\'' +
                ", emailType='" + emailType + '\'' +
                ", status=" + status +
                ", attempts=" + attempts +
                ", createdAt=" + createdAt +
                ", sentAt=" + sentAt +
                '}';
    }
}