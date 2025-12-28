package com.elwaseet.backend.controller;

import com.elwaseet.backend.dto.review.CreateReviewRequest;
import com.elwaseet.backend.dto.review.ReviewResponseDTO;
import com.elwaseet.backend.dto.review.UpdateReviewRequest;
import com.elwaseet.backend.entity.User;
import com.elwaseet.backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Slf4j
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * Create a new review
     * POST /api/reviews
     */
    @PostMapping
    public ResponseEntity<ReviewResponseDTO> createReview(
            @Valid @RequestBody CreateReviewRequest request,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Creating review for transaction {}", request.getTransactionId());
        ReviewResponseDTO response = reviewService.createReview(currentUser, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Update an existing review
     * PUT /api/reviews/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponseDTO> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReviewRequest request,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Updating review {}", id);
        ReviewResponseDTO response = reviewService.updateReview(id, currentUser, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get public reviews for a provider
     * GET /api/reviews/provider/{providerId}
     */
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<Page<ReviewResponseDTO>> getProviderReviews(
            @PathVariable Long providerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {
        
        log.info("Fetching public reviews for provider {}", providerId);
        
        Sort sort = direction.equalsIgnoreCase("ASC") ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ReviewResponseDTO> response = reviewService.getPublicProviderReviews(providerId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get reviews for a specific transaction
     * GET /api/reviews/transaction/{transactionId}
     */
    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<List<ReviewResponseDTO>> getTransactionReviews(
            @PathVariable Long transactionId,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Fetching reviews for transaction {}", transactionId);
        List<ReviewResponseDTO> response = reviewService.getTransactionReviews(transactionId, currentUser);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a review
     * DELETE /api/reviews/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Deleting review {}", id);
        reviewService.deleteReview(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get a specific review by ID
     * GET /api/reviews/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponseDTO> getReviewById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Fetching review {}", id);
        ReviewResponseDTO response = reviewService.getReviewById(id, currentUser);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all reviews written by the current user
     * GET /api/reviews/my-reviews
     */
    @GetMapping("/my-reviews")
    public ResponseEntity<List<ReviewResponseDTO>> getMyReviews(
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Fetching reviews written by user {}", currentUser.getUserId());
        List<ReviewResponseDTO> response = reviewService.getReviewsWrittenByUser(currentUser);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all reviews received by the current user
     * GET /api/reviews/received
     */
    @GetMapping("/received")
    public ResponseEntity<List<ReviewResponseDTO>> getReceivedReviews(
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Fetching reviews received by user {}", currentUser.getUserId());
        
        // Note: This would need a new method in ReviewService
        // For now, returning empty - implement if needed
        return ResponseEntity.ok(List.of());
    }
}