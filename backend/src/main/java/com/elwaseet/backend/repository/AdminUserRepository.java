package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================================
 * ADMIN USER REPOSITORY
 * ============================================================================
 * Handles database access for admin users responsible for platform moderation
 * and management.
 */
@Repository
public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {

    /**
     * Find an admin user by email (used for login & authentication).
     */
    Optional<AdminUser> findByEmail(String email);

    /**
     * Check if an admin account already exists with a given email.
     * Used during admin creation or invitation.
     */
    boolean existsByEmail(String email);

    /**
     * Retrieve all active admin users.
     * Useful for audit logs or admin management screens.
     */
    List<AdminUser> findByIsActiveTrue();

    /**
     * Retrieve all suspended or disabled admin users.
     */
    List<AdminUser> findByIsActiveFalse();
}
