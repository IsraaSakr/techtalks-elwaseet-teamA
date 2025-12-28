package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    /**
     * Check if user already reviewed this transaction
     * Used to enforce one review per transaction per reviewer
     */
    boolean existsByTransactionTransactionIdAndReviewerUserId(
        @Param("transactionId") Long transactionId,
        @Param("reviewerId") Long reviewerId
    );

    /**
     * Get all PUBLIC reviews for a provider (paginated)
     * Used for provider profile page
     */
    @Query("SELECT r FROM Review r " +
           "WHERE r.reviewee.userId = :providerId " +
           "AND r.isPublic = true " +
           "ORDER BY r.createdAt DESC")
    Page<Review> findPublicReviewsByProviderId(
        @Param("providerId") Long providerId,
        Pageable pageable
    );

    /**
     * Get reviews for a specific transaction
     * Returns both customer and provider reviews
     */
    List<Review> findByTransactionTransactionId(@Param("transactionId") Long transactionId);

    /**
     * Get all reviews written by a user
     */
    List<Review> findByReviewerUserId(@Param("reviewerId") Long reviewerId);

    /**
     * Find specific review by transaction and reviewer
     */
    Optional<Review> findByTransactionTransactionIdAndReviewerUserId(
        @Param("transactionId") Long transactionId,
        @Param("reviewerId") Long reviewerId
    );

    /**
     * Get all PUBLIC reviews for calculating average rating for a provider
     * Only counts public reviews (customer → provider)
     */
    @Query("SELECT r FROM Review r " +
           "WHERE r.reviewee.userId = :providerId " +
           "AND r.isPublic = true")
    List<Review> findPublicReviewsForProvider(@Param("providerId") Long providerId);

    /**
     * Find review by ID with transaction and users fetched
     */
    @Query("SELECT r FROM Review r " +
           "LEFT JOIN FETCH r.transaction t " +
           "LEFT JOIN FETCH r.reviewer reviewer " +
           "LEFT JOIN FETCH r.reviewee reviewee " +
           "WHERE r.reviewId = :reviewId")
    Optional<Review> findByIdWithDetails(@Param("reviewId") Long reviewId);

    /**
     * Check if user can review a transaction (user is part of transaction)
     */
    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END " +
           "FROM Transaction t " +
           "WHERE t.transactionId = :transactionId " +
           "AND (t.customer.userId = :userId OR t.provider.userId = :userId)")
    boolean isUserPartOfTransaction(
        @Param("transactionId") Long transactionId,
        @Param("userId") Long userId
    );

    /**
     * Count total public reviews for a provider
     */
    long countByRevieweeUserIdAndIsPublicTrue(@Param("providerId") Long providerId);
}