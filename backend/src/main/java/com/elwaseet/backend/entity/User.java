package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
@Table(
    name = "users",
    indexes = {
        @Index(name = "idx_users_email", columnList = "email"),
        @Index(name = "idx_users_account_type", columnList = "account_type"),
        @Index(name = "idx_users_location", columnList = "location")
    }
)
public class User {

    /**
     * Account type enum - matches PostgreSQL type
     * CREATE TYPE account_type AS ENUM ('CUSTOMER', 'HYBRID_PROVIDER');
     */
    public enum AccountType {
        CUSTOMER,
        HYBRID_PROVIDER
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @NotBlank(message = "Password hash is required")
    @Size(max = 255, message = "Password hash must not exceed 255 characters")
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @NotBlank(message = "Phone is required")
    @Size(max = 20, message = "Phone must not exceed 20 characters")
    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @NotBlank(message = "Location is required")
    @Size(max = 255, message = "Location must not exceed 255 characters")
    @Column(name = "location", nullable = false, length = 255)
    private String location;

    @NotNull(message = "Account type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false)
    private AccountType accountType;

    @Size(max = 500, message = "Profile photo URL must not exceed 500 characters")
    @Column(name = "profile_photo_url", length = 500)
    private String profilePhotoUrl;

    @Column(name = "simulated_balance", nullable = false, precision = 10, scale = 2)
    private BigDecimal simulatedBalance = BigDecimal.ZERO;

    @Column(name = "is_email_verified", nullable = false)
    private Boolean isEmailVerified = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "is_banned", nullable = false)
    private Boolean isBanned = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
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

    /*
     * ============================================================================
     * LIFECYCLE CALLBACKS
     * ============================================================================
     */

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        if (updatedAt == null) {
            updatedAt = now;
        }
        if (simulatedBalance == null) {
            simulatedBalance = BigDecimal.ZERO;
        }
        if (isEmailVerified == null) {
            isEmailVerified = false;
        }
        if (isActive == null) {
            isActive = true;
        }
        if (isBanned == null) {
            isBanned = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /*
     * ============================================================================
     * CONSTRUCTORS
     * ============================================================================
     */

    protected User() {
        // JPA requires no-arg constructor
    }

    public User(String email, String passwordHash, String name, String phone, 
                String location, AccountType accountType) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.name = name;
        this.phone = phone;
        this.location = location;
        this.accountType = accountType;
        this.simulatedBalance = BigDecimal.ZERO;
        this.isEmailVerified = false;
        this.isActive = true;
        this.isBanned = false;
    }

    /*
     * ============================================================================
     * GETTERS & SETTERS
     * ============================================================================
     */

    public Long getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public String getProfilePhotoUrl() {
        return profilePhotoUrl;
    }

    public void setProfilePhotoUrl(String profilePhotoUrl) {
        this.profilePhotoUrl = profilePhotoUrl;
    }

    public BigDecimal getSimulatedBalance() {
        return simulatedBalance;
    }

    public void setSimulatedBalance(BigDecimal simulatedBalance) {
        this.simulatedBalance = simulatedBalance;
    }

    public Boolean getIsEmailVerified() {
        return isEmailVerified;
    }

    public void setIsEmailVerified(Boolean isEmailVerified) {
        this.isEmailVerified = isEmailVerified;
    }

    public boolean isEmailVerified() {
        return isEmailVerified != null && isEmailVerified;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public boolean isActive() {
        return isActive != null && isActive;
    }

    public Boolean getIsBanned() {
        return isBanned;
    }

    public void setIsBanned(Boolean isBanned) {
        this.isBanned = isBanned;
    }

    public boolean isBanned() {
        return isBanned != null && isBanned;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }

    public List<OtpCode> getOtpCodes() {
        return otpCodes;
    }

    public ProviderProfile getProviderProfile() {
        return providerProfile;
    }

    public void setProviderProfile(ProviderProfile providerProfile) {
        this.providerProfile = providerProfile;
    }

    public List<Job> getJobsPosted() {
        return jobsPosted;
    }

    public List<Application> getApplicationsSubmitted() {
        return applicationsSubmitted;
    }

    public List<Transaction> getCustomerTransactions() {
        return customerTransactions;
    }

    public List<Transaction> getProviderTransactions() {
        return providerTransactions;
    }

    public List<Dispute> getDisputesOpened() {
        return disputesOpened;
    }

    public List<DisputeAppeal> getAppealsSubmitted() {
        return appealsSubmitted;
    }

    public List<DisputeEvidencePhoto> getDisputeEvidencePhotos() {
        return disputeEvidencePhotos;
    }

    public List<Review> getReviewsWritten() {
        return reviewsWritten;
    }

    public List<Review> getReviewsReceived() {
        return reviewsReceived;
    }

    public List<ReviewReport> getReportsSubmitted() {
        return reportsSubmitted;
    }

    public List<EmailQueue> getReceivedEmails() {
        return receivedEmails;
    }

    /*
     * ============================================================================
     * BUSINESS LOGIC
     * ============================================================================
     */

    public boolean isProvider() {
        return accountType == AccountType.HYBRID_PROVIDER;
    }

    public boolean isCustomer() {
        return accountType == AccountType.CUSTOMER;
    }

    public boolean canAccessPlatform() {
        return isActive() && !isBanned();
    }

    public void verifyEmail() {
        this.isEmailVerified = true;
    }

    public void activate() {
        this.isActive = true;
    }

    public void deactivate() {
        this.isActive = false;
    }

    public void ban() {
        this.isBanned = true;
        this.isActive = false;
    }

    public void unban() {
        this.isBanned = false;
        this.isActive = true;
    }

    public void recordLogin() {
        this.lastLogin = LocalDateTime.now();
    }

    public void addToBalance(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) > 0) {
            this.simulatedBalance = this.simulatedBalance.add(amount);
        }
    }

    public void deductFromBalance(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) > 0) {
            this.simulatedBalance = this.simulatedBalance.subtract(amount);
        }
    }

    public boolean hasSufficientBalance(BigDecimal amount) {
        return simulatedBalance.compareTo(amount) >= 0;
    }

    public boolean hasProviderProfile() {
        return providerProfile != null;
    }

    public int getTotalJobsPosted() {
        return jobsPosted != null ? jobsPosted.size() : 0;
    }

    public int getTotalApplicationsSubmitted() {
        return applicationsSubmitted != null ? applicationsSubmitted.size() : 0;
    }

    public int getTotalReviewsWritten() {
        return reviewsWritten != null ? reviewsWritten.size() : 0;
    }

    public int getTotalReviewsReceived() {
        return reviewsReceived != null ? reviewsReceived.size() : 0;
    }

    /*
     * ============================================================================
     * EQUALS, HASHCODE, TOSTRING
     * ============================================================================
     */

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return userId != null && userId.equals(user.getUserId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", accountType=" + accountType +
                ", isActive=" + isActive +
                ", isBanned=" + isBanned +
                '}';
    }
}