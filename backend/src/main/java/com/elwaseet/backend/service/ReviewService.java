package com.elwaseet.backend.service;

import com.elwaseet.backend.dto.review.CreateReviewRequest;
import com.elwaseet.backend.dto.review.ReviewResponseDTO;
import com.elwaseet.backend.dto.review.UpdateReviewRequest;
import com.elwaseet.backend.entity.*;
import com.elwaseet.backend.exception.BadRequestException;
import com.elwaseet.backend.exception.ConflictException;
import com.elwaseet.backend.exception.ResourceNotFoundException;
import com.elwaseet.backend.exception.UnauthorizedException;
import com.elwaseet.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final ProviderProfileRepository providerProfileRepository;
    

    @Transactional
    public ReviewResponseDTO createReview(User currentUser, CreateReviewRequest request) {
        log.info("Creating review for transaction {} by user {}", 
                 request.getTransactionId(), currentUser.getUserId());
        
        // 1. Get transaction
        Transaction transaction = transactionRepository.findById(request.getTransactionId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Transaction not found with ID: " + request.getTransactionId()));
        
        // 2. Validate transaction is CONFIRMED
        if (transaction.getStatus() != Transaction.TransactionStatus.CONFIRMED) {
            throw new BadRequestException(
                    "Can only review transactions with CONFIRMED status. Current status: " + 
                    transaction.getStatus());
        }
        
        // 3. Validate user is part of transaction
        boolean isCustomer = transaction.getCustomer().getUserId().equals(currentUser.getUserId());
        boolean isProvider = transaction.getProvider().getUserId().equals(currentUser.getUserId());
        
        if (!isCustomer && !isProvider) {
            throw new UnauthorizedException(
                    "You are not authorized to review this transaction. You are not the customer or provider.");
        }
        
        // 4. Check not already reviewed
        if (reviewRepository.existsByTransactionTransactionIdAndReviewerUserId(
                transaction.getTransactionId(), currentUser.getUserId())) {
            throw new ConflictException("You have already reviewed this transaction.");
        }
        
        // 5. Determine reviewee and visibility
        User reviewee;
        boolean isPublic;
        
        if (isCustomer) {
            // Customer reviewing provider → PUBLIC
            reviewee = transaction.getProvider();
            isPublic = true;
        } else {
            // Provider reviewing customer → PRIVATE
            reviewee = transaction.getCustomer();
            isPublic = false;
        }
        
        // 6. Create review
        Review review = new Review(transaction, currentUser, reviewee, request.getRating());
        review.setComment(request.getComment());
        review.setIsPublic(isPublic);
        
        // Set edit deadline to 48 hours from now
        review.setEditDeadline(LocalDateTime.now().plusHours(48));
        
        Review savedReview = reviewRepository.save(review);
        log.info("Review created successfully with ID: {}", savedReview.getReviewId());
        
        // 7. Update reviewee's average rating if review is public
        if (isPublic && reviewee.isProvider()) {
            updateProviderAverageRating(reviewee.getUserId());
        }
        
        return new ReviewResponseDTO(savedReview);
    }
    
    /**
     * Edit an existing review
     * Users can edit their reviews within 48 hours of creation
     */
    @Transactional
    public ReviewResponseDTO updateReview(Long reviewId, User currentUser, UpdateReviewRequest request) {
        log.info("Updating review {} by user {}", reviewId, currentUser.getUserId());
        
        // 1. Get review with details
        Review review = reviewRepository.findByIdWithDetails(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Review not found with ID: " + reviewId));
        
        // 2. Validate ownership
        if (!review.getReviewer().getUserId().equals(currentUser.getUserId())) {
            throw new UnauthorizedException("You are not authorized to edit this review.");
        }
        
        // 3. Check if edit deadline has passed
        if (!review.canEdit()) {
            throw new BadRequestException("Review can only be edited within 48 hours of creation.");
        }
        
        // 4. Update fields if provided
        boolean ratingChanged = false;
        BigDecimal oldRating = null;
        
        if (request.hasRating()) {
            oldRating = BigDecimal.valueOf(review.getRating());
            review.setRating(request.getRating());
            ratingChanged = true;
        }
        
        if (request.hasComment()) {
            review.setComment(request.getComment());
        }
        
        Review updatedReview = reviewRepository.save(review);
        log.info("Review {} updated successfully", reviewId);
        
        // 5. Recalculate average rating if rating changed and review is public
        if (ratingChanged && review.getIsPublic() && review.getReviewee().isProvider()) {
            updateProviderAverageRating(review.getReviewee().getUserId());
        }
        
        return new ReviewResponseDTO(updatedReview);
    }
    
    /**
     * Get public reviews for a provider
     * Used on provider profile page
     */
    @Transactional(readOnly = true)
    public Page<ReviewResponseDTO> getPublicProviderReviews(Long providerId, Pageable pageable) {
        log.info("Fetching public reviews for provider: {}", providerId);
        
        // Verify provider exists and is a provider
        User provider = userRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with ID: " + providerId));
        
        if (!provider.isProvider()) {
            throw new BadRequestException("User with ID " + providerId + " is not a provider.");
        }
        
        Page<Review> reviews = reviewRepository.findPublicReviewsByProviderId(providerId, pageable);
        
        return reviews.map(ReviewResponseDTO::new);
    }
    
    /**
     * Get reviews for a specific transaction
     * Only accessible by transaction participants
     */
    @Transactional(readOnly = true)
    public List<ReviewResponseDTO> getTransactionReviews(Long transactionId, User currentUser) {
        log.info("Fetching reviews for transaction {} by user {}", 
                 transactionId, currentUser.getUserId());
        
        // 1. Get transaction
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Transaction not found with ID: " + transactionId));
        
        // 2. Verify user is part of transaction
        boolean isCustomer = transaction.getCustomer().getUserId().equals(currentUser.getUserId());
        boolean isProvider = transaction.getProvider().getUserId().equals(currentUser.getUserId());
        
        if (!isCustomer && !isProvider) {
            throw new UnauthorizedException(
                    "You are not authorized to view reviews for this transaction.");
        }
        
        // 3. Get reviews
        List<Review> reviews = reviewRepository.findByTransactionTransactionId(transactionId);
        
        return reviews.stream()
                .map(ReviewResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Delete a review (admin only or for moderation)
     */
    @Transactional
    public void deleteReview(Long reviewId, User currentUser) {
        log.info("Deleting review {} by user {}", reviewId, currentUser.getUserId());
        
        // 1. Get review
        Review review = reviewRepository.findByIdWithDetails(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Review not found with ID: " + reviewId));
        
        // 2. Check permissions: owner or admin
        boolean isOwner = review.getReviewer().getUserId().equals(currentUser.getUserId());
        boolean isAdmin = currentUser.getAccountType() == User.AccountType.HYBRID_PROVIDER && 
                         currentUser.getProviderProfile() != null && 
                         currentUser.getProviderProfile().isVerified();
        
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException(
                    "You are not authorized to delete this review.");
        }
        
        // 3. Store reviewee info for rating recalculation
        User reviewee = review.getReviewee();
        boolean wasPublic = review.getIsPublic();
        
        // 4. Delete review
        reviewRepository.delete(review);
        log.info("Review {} deleted successfully", reviewId);
        
        // 5. Recalculate average rating if review was public and reviewee is provider
        if (wasPublic && reviewee.isProvider()) {
            updateProviderAverageRating(reviewee.getUserId());
        }
    }
    
    /**
     * Calculate and update provider's average rating
     * Only counts PUBLIC reviews
     */
    private void updateProviderAverageRating(Long providerId) {
        log.debug("Updating average rating for provider: {}", providerId);
        
        List<Review> publicReviews = reviewRepository.findPublicReviewsForProvider(providerId);
        
        if (publicReviews.isEmpty()) {
            // No reviews, reset to zero
            ProviderProfile profile = providerProfileRepository.findByUser_UserId(providerId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Provider profile not found for user ID: " + providerId));
            
            profile.setAverageRating(BigDecimal.ZERO);
            profile.setTotalReviews(0);
            providerProfileRepository.save(profile);
            return;
        }
        
        // Calculate average
        BigDecimal total = BigDecimal.ZERO;
        for (Review review : publicReviews) {
            total = total.add(BigDecimal.valueOf(review.getRating()));
        }
        
        BigDecimal average = total.divide(
                BigDecimal.valueOf(publicReviews.size()), 2, RoundingMode.HALF_UP);
        
        // Update provider profile
        ProviderProfile profile = providerProfileRepository.findByUser_UserId(providerId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Provider profile not found for user ID: " + providerId));
        
        profile.setAverageRating(average);
        profile.setTotalReviews(publicReviews.size());
        providerProfileRepository.save(profile);
        
        log.debug("Provider {} average rating updated to: {}", providerId, average);
    }
    
    /**
     * Get all reviews written by a user
     */
    @Transactional(readOnly = true)
    public List<ReviewResponseDTO> getReviewsWrittenByUser(User currentUser) {
        log.info("Fetching reviews written by user: {}", currentUser.getUserId());
        
        List<Review> reviews = reviewRepository.findByReviewerUserId(currentUser.getUserId());
        
        return reviews.stream()
                .map(ReviewResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get review by ID
     */
    @Transactional(readOnly = true)
    public ReviewResponseDTO getReviewById(Long reviewId, User currentUser) {
        log.info("Fetching review {} by user {}", reviewId, currentUser.getUserId());
        
        Review review = reviewRepository.findByIdWithDetails(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Review not found with ID: " + reviewId));
        
        // Check if user can view this review
        // Owner, reviewee, or admin can view
        boolean isOwner = review.getReviewer().getUserId().equals(currentUser.getUserId());
        boolean isReviewee = review.getReviewee().getUserId().equals(currentUser.getUserId());
        boolean isAdmin = currentUser.getAccountType() == User.AccountType.HYBRID_PROVIDER && 
                         currentUser.getProviderProfile() != null && 
                         currentUser.getProviderProfile().isVerified();
        
        // Private reviews can only be seen by owner, reviewee, or admin
        if (!review.getIsPublic() && !isOwner && !isReviewee && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to view this private review.");
        }
        
        return new ReviewResponseDTO(review);
    }
}