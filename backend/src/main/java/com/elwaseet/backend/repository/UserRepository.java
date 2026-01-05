package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * ============================================================================
 * USER REPOSITORY
 * ============================================================================
 * Handles persistence and lookup operations for platform users.
 * Used by authentication, admin dashboard, and statistics services.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // -------------------------------------------------------------------------
    // AUTH & IDENTITY
    // -------------------------------------------------------------------------

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByPhone(String phone);

    boolean existsByPhone(String phone);

    // -------------------------------------------------------------------------
    // ADMIN / PLATFORM STATS
    // -------------------------------------------------------------------------

    /**
     * Count users who are currently active.
     */
    long countByIsActiveTrue();

    /**
     * Count users who are banned.
     */
    long countByIsBannedTrue();

    /**
     * Count users who have verified email.
     */
    long countByIsEmailVerifiedTrue();

    /**
     * Count users by account type (CUSTOMER / HYBRID_PROVIDER).
     */
    long countByAccountType(User.AccountType accountType);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.providerProfile WHERE u.userId = :userId")
    Optional<User> findByIdWithProfile(@Param("userId") Long userId);
}