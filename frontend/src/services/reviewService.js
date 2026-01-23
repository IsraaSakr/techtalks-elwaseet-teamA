/**
 * Review Service
 * 
 * Location: frontend/src/services/reviewService.js
 * 
 * Handles all review and rating-related API calls:
 * - Creating and managing reviews
 * - Rating jobs and providers
 * - Review moderation
 */

import api from './api';

export const reviewService = {
    /**
     * Create a new review
     * @param {Object} reviewData - Review data
     * @param {string} reviewData.targetId - ID of job or provider being reviewed
     * @param {string} reviewData.targetType - Type (job or provider)
     * @param {number} reviewData.rating - Rating (1-5)
     * @param {string} reviewData.comment - Review comment
     * @returns {Promise} Created review data
     */
    createReview: (reviewData) =>
        api.post('/reviews', reviewData),

    /**
     * Create review with images
     * @param {FormData} formData - Review data with images
     * @returns {Promise} Created review data
     */
    createReviewWithImages: (formData) =>
        api.post('/reviews', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    /**
     * Get all reviews
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.targetType - Filter by type (job, provider)
     * @param {number} params.minRating - Minimum rating filter
     * @returns {Promise} List of reviews
     */
    getReviews: (params) =>
        api.get('/reviews', { params }),

    /**
     * Get review by ID
     * @param {string} id - Review ID
     * @returns {Promise} Review details
     */
    getReviewById: (id) =>
        api.get(`/reviews/${id}`),

    /**
     * Get reviews for a specific target (job or provider)
     * @param {string} targetId - Target ID
     * @param {string} targetType - Target type (job or provider)
     * @param {Object} params - Query parameters
     * @returns {Promise} List of reviews
     */
    getReviewsByTarget: (targetId, targetType, params) =>
        api.get('/reviews/target', {
            params: { targetId, targetType, ...params }
        }),

    /**
     * Get reviews written by current user
     * @param {Object} params - Query parameters
     * @returns {Promise} User's reviews
     */
    getMyReviews: (params) =>
        api.get('/reviews/my-reviews', { params }),

    /**
     * Get reviews received by current user
     * @param {Object} params - Query parameters
     * @returns {Promise} Reviews received
     */
    getReceivedReviews: (params) =>
        api.get('/reviews/received', { params }),

    /**
     * Update a review
     * @param {string} id - Review ID
     * @param {Object} reviewData - Updated review data
     * @returns {Promise} Updated review data
     */
    updateReview: (id, reviewData) =>
        api.put(`/reviews/${id}`, reviewData),

    /**
     * Update review with images
     * @param {string} id - Review ID
     * @param {FormData} formData - Updated review data with images
     * @returns {Promise} Updated review data
     */
    updateReviewWithImages: (id, formData) =>
        api.put(`/reviews/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    /**
     * Delete a review
     * @param {string} id - Review ID
     * @returns {Promise} Deletion confirmation
     */
    deleteReview: (id) =>
        api.delete(`/reviews/${id}`),

    /**
     * Reply to a review (for providers/job posters)
     * @param {string} reviewId - Review ID
     * @param {string} reply - Reply text
     * @returns {Promise} Updated review with reply
     */
    replyToReview: (reviewId, reply) =>
        api.post(`/reviews/${reviewId}/reply`, { reply }),

    /**
     * Update review reply
     * @param {string} reviewId - Review ID
     * @param {string} reply - Updated reply text
     * @returns {Promise} Updated review
     */
    updateReviewReply: (reviewId, reply) =>
        api.put(`/reviews/${reviewId}/reply`, { reply }),

    /**
     * Delete review reply
     * @param {string} reviewId - Review ID
     * @returns {Promise} Updated review
     */
    deleteReviewReply: (reviewId) =>
        api.delete(`/reviews/${reviewId}/reply`),

    /**
     * Mark review as helpful
     * @param {string} reviewId - Review ID
     * @returns {Promise} Updated review
     */
    markReviewHelpful: (reviewId) =>
        api.post(`/reviews/${reviewId}/helpful`),

    /**
     * Remove helpful mark from review
     * @param {string} reviewId - Review ID
     * @returns {Promise} Updated review
     */
    unmarkReviewHelpful: (reviewId) =>
        api.delete(`/reviews/${reviewId}/helpful`),

    /**
     * Report a review
     * @param {string} reviewId - Review ID
     * @param {Object} reportData - Report details
     * @param {string} reportData.reason - Report reason
     * @param {string} reportData.description - Detailed description
     * @returns {Promise} Report confirmation
     */
    reportReview: (reviewId, reportData) =>
        api.post(`/reviews/${reviewId}/report`, reportData),

    /**
     * Get review statistics for a target
     * @param {string} targetId - Target ID
     * @param {string} targetType - Target type (job or provider)
     * @returns {Promise} Review statistics
     */
    getReviewStats: (targetId, targetType) =>
        api.get('/reviews/stats', {
            params: { targetId, targetType }
        }),

    /**
     * Get rating distribution for a target
     * @param {string} targetId - Target ID
     * @param {string} targetType - Target type
     * @returns {Promise} Rating distribution (count per star)
     */
    getRatingDistribution: (targetId, targetType) =>
        api.get('/reviews/rating-distribution', {
            params: { targetId, targetType }
        }),

    /**
     * Get featured reviews for a target
     * @param {string} targetId - Target ID
     * @param {string} targetType - Target type
     * @param {number} limit - Number of reviews
     * @returns {Promise} Featured reviews
     */
    getFeaturedReviews: (targetId, targetType, limit = 5) =>
        api.get('/reviews/featured', {
            params: { targetId, targetType, limit }
        }),

    /**
     * Verify review (confirm user completed the job)
     * @param {string} reviewId - Review ID
     * @returns {Promise} Verified review
     */
    verifyReview: (reviewId) =>
        api.patch(`/reviews/${reviewId}/verify`),

    /**
     * Pin review (for providers to highlight)
     * @param {string} reviewId - Review ID
     * @returns {Promise} Updated review
     */
    pinReview: (reviewId) =>
        api.patch(`/reviews/${reviewId}/pin`),

    /**
     * Unpin review
     * @param {string} reviewId - Review ID
     * @returns {Promise} Updated review
     */
    unpinReview: (reviewId) =>
        api.patch(`/reviews/${reviewId}/unpin`),

    /**
     * Get average rating for a target
     * @param {string} targetId - Target ID
     * @param {string} targetType - Target type
     * @returns {Promise} Average rating data
     */
    getAverageRating: (targetId, targetType) =>
        api.get('/reviews/average-rating', {
            params: { targetId, targetType }
        }),

    /**
     * Get recent reviews
     * @param {number} limit - Number of reviews
     * @returns {Promise} Recent reviews
     */
    getRecentReviews: (limit = 10) =>
        api.get('/reviews/recent', { params: { limit } }),

    /**
     * Get top-rated items
     * @param {string} targetType - Type (job or provider)
     * @param {number} limit - Number of items
     * @returns {Promise} Top-rated items
     */
    getTopRated: (targetType, limit = 10) =>
        api.get('/reviews/top-rated', {
            params: { targetType, limit }
        }),
};

export default reviewService;