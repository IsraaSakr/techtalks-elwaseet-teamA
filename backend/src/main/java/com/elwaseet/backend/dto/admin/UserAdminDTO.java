package com.elwaseet.backend.dto.admin;

import com.elwaseet.backend.entity.User;
import java.time.LocalDateTime;

/**
 * ============================================================================
 * USER ADMIN DTO
 * ============================================================================
 * Used by admin dashboard for user management.
 *
 * Exposes only safe, admin-relevant fields.
 */
public class UserAdminDTO {

    private Long userId;
    private String email;
    private String name;
    private User.AccountType accountType;

    private Boolean isVerified;
    private Boolean isBanned;

    private LocalDateTime createdAt;

    // -------------------------------------------------------------------------
    // CONSTRUCTORS
    // -------------------------------------------------------------------------

    public UserAdminDTO() {
        // Default constructor for serialization
    }

    public UserAdminDTO(
            Long userId,
            String email,
            String name,
            User.AccountType accountType,
            Boolean isVerified,
            Boolean isBanned,
            LocalDateTime createdAt) {
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.accountType = accountType;
        this.isVerified = isVerified;
        this.isBanned = isBanned;
        this.createdAt = createdAt;
    }

    // -------------------------------------------------------------------------
    // GETTERS & SETTERS
    // -------------------------------------------------------------------------

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User.AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(User.AccountType accountType) {
        this.accountType = accountType;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean verified) {
        isVerified = verified;
    }

    public Boolean getIsBanned() {
        return isBanned;
    }

    public void setIsBanned(Boolean banned) {
        isBanned = banned;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
