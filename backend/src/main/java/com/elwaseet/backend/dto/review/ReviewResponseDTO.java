package com.elwaseet.backend.dto.review;

import com.elwaseet.backend.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseDTO {

    private Long reviewId;
    private Long transactionId;
    
    // Reviewer info
    private Long reviewerId;
    private String reviewerName;
    private String reviewerProfilePhotoUrl;
    
    // Reviewee info
    private Long revieweeId;
    private String revieweeName;
    
    private Integer rating;
    private String comment;
    private Boolean isPublic;
    private Boolean isEdited;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime editDeadline;
    private Boolean canEdit;
    
    // Constructor from Review entity
    public ReviewResponseDTO(Review review) {
        this.reviewId = review.getReviewId();
        this.transactionId = review.getTransaction().getTransactionId();
        
        // Reviewer info
        this.reviewerId = review.getReviewer().getUserId();
        this.reviewerName = review.getReviewer().getName();
        this.reviewerProfilePhotoUrl = review.getReviewer().getProfilePhotoUrl();
        
        // Reviewee info
        this.revieweeId = review.getReviewee().getUserId();
        this.revieweeName = review.getReviewee().getName();
        
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.isPublic = review.getIsPublic();
        this.isEdited = review.getIsEdited();
        this.createdAt = review.getCreatedAt();
        this.updatedAt = review.getUpdatedAt();
        this.editDeadline = review.getEditDeadline();
        this.canEdit = review.canEdit();
    }
}