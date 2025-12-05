package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================================
 * USER ENTITY — CORE ACCOUNT MODEL
 * ============================================================================
 * A User represents both Customer and Provider roles in the system.
 *
 * RELATIONSHIP OVERVIEW:
 * - One user → many OTP codes (login verification history)
 * - One user → one provider profile (if the user is a service provider)
 * - One user → many jobs posted (customer side)
 * - One user → many job applications submitted (provider side)
 * - One user → many transactions as customer
 * - One user → many transactions as provider
 * - One user → many disputes opened
 * - One user → many dispute appeals submitted
 * - One user → many evidence photos uploaded in disputes
 * - One user → many reviews written
 * - One user → many reviews received
 * - One user → many review reports filed
 * - One user → many queued system emails
 *
 * This is the central entity in the system and is referenced by most modules.
 */
@Entity
@Table(name = "users")
public class User {

    public enum AccountType {
        CUSTOMER,
        HYBRID_PROVIDER // Provider who can also act as a customer
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(length = 255)
    private String name;

    @Column(length = 20)
    private String phone;

    @Column(length = 255)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false, length = 30)
    private AccountType accountType;

    @Column(name = "profile_photo_url", length = 500)
    private String profilePhotoUrl;

    @Column(name = "simulated_balance", precision = 10, scale = 2)
    private BigDecimal simulatedBalance;

    @Column(name = "is_email_verified")
    private Boolean isEmailVerified;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "is_banned")
    private Boolean isBanned;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    /*
     * ============================================================================
     * RELATIONSHIP DEFINITIONS (Bidirectional)
     * ============================================================================
     */

    /** One user can have multiple OTP login attempts */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OtpCode> otpCodes = new ArrayList<>();

    /** Provider profile — applies only if user is a HYBRID_PROVIDER */
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ProviderProfile providerProfile;

    /** Customer who posted many jobs */
    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    private List<Job> jobsPosted = new ArrayList<>();

    /** Provider who applied to many jobs */
    @OneToMany(mappedBy = "provider", fetch = FetchType.LAZY)
    private List<Application> applicationsSubmitted = new ArrayList<>();

    /** All transactions where this user was the customer */
    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    private List<Transaction> customerTransactions = new ArrayList<>();

    /** All transactions where this user was the provider */
    @OneToMany(mappedBy = "provider", fetch = FetchType.LAZY)
    private List<Transaction> providerTransactions = new ArrayList<>();

    /** Disputes opened by the user */
    @OneToMany(mappedBy = "openedBy", fetch = FetchType.LAZY)
    private List<Dispute> disputesOpened = new ArrayList<>();

    /** Dispute appeals submitted by the user */
    @OneToMany(mappedBy = "appealedBy", fetch = FetchType.LAZY)
    private List<DisputeAppeal> appealsSubmitted = new ArrayList<>();

    /** Photos uploaded by the user inside disputes */
    @OneToMany(mappedBy = "uploadedBy", fetch = FetchType.LAZY)
    private List<DisputeEvidencePhoto> disputeEvidencePhotos = new ArrayList<>();

    /** Reviews the user wrote for others */
    @OneToMany(mappedBy = "reviewer", fetch = FetchType.LAZY)
    private List<Review> reviewsWritten = new ArrayList<>();

    /** Reviews the user received from others */
    @OneToMany(mappedBy = "reviewee", fetch = FetchType.LAZY)
    private List<Review> reviewsReceived = new ArrayList<>();

    /** Review reports filed by this user */
    @OneToMany(mappedBy = "reportedBy", fetch = FetchType.LAZY)
    private List<ReviewReport> reportsSubmitted = new ArrayList<>();

    /** System emails queued for this user */
    @OneToMany(mappedBy = "recipientUser", fetch = FetchType.LAZY)
    private List<EmailQueue> receivedEmails = new ArrayList<>();

    protected User() {
    }
}
