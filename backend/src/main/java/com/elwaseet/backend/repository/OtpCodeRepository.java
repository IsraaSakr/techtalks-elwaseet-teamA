package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.OtpCode;
import com.elwaseet.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OtpCodeRepository extends JpaRepository<OtpCode, Long> {

    // ✅ REQUIRED for your current OtpService
    Optional<OtpCode> findByCode(String code);

    // Strict + safe: OTP tied to user, unused, newest by createdAt
    Optional<OtpCode> findTopByUserAndCodeAndIsUsedFalseOrderByCreatedAtDesc(User user, String code);

    // Useful for "latest OTP wins"
    Optional<OtpCode> findTopByUserAndIsUsedFalseOrderByCreatedAtDesc(User user);

    // Find all OTPs for a user
    List<OtpCode> findByUser(User user);

    // Delete all OTPs for a user
    void deleteByUser(User user);

    // Convenience method: safer lookup combining user + code validation
    default Optional<OtpCode> findByCodeAndUser(String code, User user) {
        return findTopByUserAndCodeAndIsUsedFalseOrderByCreatedAtDesc(user, code);
    }

    @Modifying
    @Query("UPDATE OtpCode o SET o.isUsed = true WHERE o.user.userId = :userId AND o.isUsed = false")
    int markAllActiveAsUsed(@Param("userId") Long userId);
}