package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "otp_codes")
public class OtpCode {

    /**
     * ============================================================================
     * OTP CODE ENTITY
     * ============================================================================
     * Stores verification codes for users (email OTPs).
     *
     * RELATIONSHIP SUMMARY:
     * - Many OTP codes → belong to one User
     * 
     * NOTE: The schema does NOT include a 'purpose' field. If you need to 
     * differentiate OTP types, you'll need to add it to the schema first.
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "otp_id")
    private Long otpId;

    /** User associated with this OTP */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank(message = "OTP code is required")
    @Size(min = 6, max = 6, message = "OTP code must be exactly 6 characters")
    @Pattern(regexp = "\\d{6}", message = "OTP code must be 6 digits")
    @Column(name = "code", nullable = false, length = 6)
    private String code;

    @NotNull(message = "Expiration time is required")
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "is_used", nullable = false)
    private Boolean isUsed = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

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
        if (isUsed == null) {
            isUsed = false;
        }
    }

    /*
     * ============================================================================
     * CONSTRUCTORS
     * ============================================================================
     */

    protected OtpCode() {
    }

    public OtpCode(User user, String code, LocalDateTime expiresAt) {
        this.user = user;
        this.code = code;
        this.expiresAt = expiresAt;
    }

    /*
     * ============================================================================
     * GETTERS & SETTERS
     * ============================================================================
     */

    public Long getOtpId() {
        return otpId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Boolean getIsUsed() {
        return isUsed;
    }

    public void setIsUsed(Boolean isUsed) {
        this.isUsed = isUsed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    /*
     * ============================================================================
     * BUSINESS LOGIC
     * ============================================================================
     */

    /**
     * Check if OTP is expired
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    /**
     * Check if OTP is valid (not used and not expired)
     */
    public boolean isValid() {
        return !isUsed && !isExpired();
    }

    /**
     * Mark OTP as used
     */
    public void markAsUsed() {
        this.isUsed = true;
    }

    /**
     * Check if code matches
     */
    public boolean matches(String inputCode) {
        return this.code.equals(inputCode);
    }

    /*
     * ============================================================================
     * EQUALS, HASHCODE, TOSTRING
     * ============================================================================
     */

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OtpCode)) return false;
        OtpCode otpCode = (OtpCode) o;
        return otpId != null && otpId.equals(otpCode.getOtpId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "OtpCode{" +
                "otpId=" + otpId +
                ", code='" + code + '\'' +
                ", expiresAt=" + expiresAt +
                ", isUsed=" + isUsed +
                ", createdAt=" + createdAt +
                '}';
    }
}