package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "admin_users",
    indexes = {
        @Index(name = "idx_admin_email", columnList = "email")
    }
)
public class AdminUser {

    /**
     * ============================================================================
     * ADMIN USER ENTITY
     * ============================================================================
     * Represents administrative users who can manage the platform.
     *
     * RELATIONSHIP SUMMARY:
     * - One admin → resolves many Disputes (resolved_by)
     * - One admin → reviews many DisputeAppeals (reviewed_by)
     * - One admin → reviews many ReviewReports (reviewed_by)
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Long adminId;

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

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    /*
     * ============================================================================
     * RELATIONSHIPS
     * ============================================================================
     */

    /** Disputes resolved by this admin */
    @OneToMany(mappedBy = "resolvedBy", fetch = FetchType.LAZY)
    private List<Dispute> disputesResolved = new ArrayList<>();

    /** Dispute appeals reviewed by this admin */
    @OneToMany(mappedBy = "reviewedBy", fetch = FetchType.LAZY)
    private List<DisputeAppeal> appealsReviewed = new ArrayList<>();

    /** Review reports reviewed by this admin */
    @OneToMany(mappedBy = "reviewedBy", fetch = FetchType.LAZY)
    private List<ReviewReport> reviewReportsReviewed = new ArrayList<>();

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
        if (isActive == null) {
            isActive = true;
        }
    }

    /*
     * ============================================================================
     * CONSTRUCTORS
     * ============================================================================
     */

    protected AdminUser() {
        // JPA requires no-arg constructor
    }

    public AdminUser(String email, String passwordHash, String name) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.name = name;
        this.isActive = true;
    }

    /*
     * ============================================================================
     * GETTERS & SETTERS
     * ============================================================================
     */

    public Long getAdminId() {
        return adminId;
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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    /**
     * Alternative boolean getter (common convention)
     */
    public boolean isActive() {
        return isActive != null && isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }

    public List<Dispute> getDisputesResolved() {
        return disputesResolved;
    }

    public List<DisputeAppeal> getAppealsReviewed() {
        return appealsReviewed;
    }

    public List<ReviewReport> getReviewReportsReviewed() {
        return reviewReportsReviewed;
    }

    /*
     * ============================================================================
     * BUSINESS LOGIC
     * ============================================================================
     */

    /**
     * Record a successful login
     */
    public void recordLogin() {
        this.lastLogin = LocalDateTime.now();
    }

    /**
     * Deactivate this admin account
     */
    public void deactivate() {
        this.isActive = false;
    }

    /**
     * Activate this admin account
     */
    public void activate() {
        this.isActive = true;
    }

    /**
     * Check if admin can perform actions
     */
    public boolean canPerformActions() {
        return isActive();
    }

    /**
     * Get total number of disputes resolved
     */
    public int getDisputesResolvedCount() {
        return disputesResolved != null ? disputesResolved.size() : 0;
    }

    /**
     * Get total number of appeals reviewed
     */
    public int getAppealsReviewedCount() {
        return appealsReviewed != null ? appealsReviewed.size() : 0;
    }

    /**
     * Get total number of review reports reviewed
     */
    public int getReviewReportsReviewedCount() {
        return reviewReportsReviewed != null ? reviewReportsReviewed.size() : 0;
    }

    /*
     * ============================================================================
     * EQUALS, HASHCODE, TOSTRING
     * ============================================================================
     */

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AdminUser)) return false;
        AdminUser adminUser = (AdminUser) o;
        return adminId != null && adminId.equals(adminUser.getAdminId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "AdminUser{" +
                "adminId=" + adminId +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", isActive=" + isActive +
                ", createdAt=" + createdAt +
                ", lastLogin=" + lastLogin +
                '}';
    }
}