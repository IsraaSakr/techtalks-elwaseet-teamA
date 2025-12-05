package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "otp_codes")
public class OtpCode {

    /**
     * ============================================================================
     * OTP CODE ENTITY
     * ============================================================================
     * Stores login verification codes for users (email OTPs).
     *
     * RELATIONSHIP SUMMARY:
     * - Many OTP codes → belong to one User
     */

    public enum OtpPurpose {
        LOGIN,
        PASSWORD_RESET,
        EMAIL_VERIFICATION
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "otp_id")
    private Long otpId;

    /** User associated with this OTP */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(length = 10, nullable = false)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "purpose", length = 30)
    private OtpPurpose purpose;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    protected OtpCode() {
    }
}
