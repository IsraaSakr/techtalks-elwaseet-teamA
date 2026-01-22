/**
 * Dispute Service
 * 
 * Location: frontend/src/services/disputeService.js
 * 
 * Handles all dispute and conflict resolution API calls:
 * - Creating and managing disputes
 * - Dispute resolution process
 * - Evidence submission
 */

import api from './api';

export const disputeService = {
    /**
     * Create a new dispute
     * @param {Object} disputeData - Dispute data
     * @param {string} disputeData.jobId - Job ID
     * @param {string} disputeData.reason - Dispute reason
     * @param {string} disputeData.description - Detailed description
     * @param {string} disputeData.type - Dispute type (payment, quality, cancellation)
     * @returns {Promise} Created dispute data
     */
    createDispute: (disputeData) =>
        api.post('/disputes', disputeData),

    /**
     * Create dispute with evidence files
     * @param {FormData} formData - Dispute data with evidence files
     * @returns {Promise} Created dispute data
     */
    createDisputeWithEvidence: (formData) =>
        api.post('/disputes', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    /**
     * Get all disputes
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.status - Filter by status
     * @param {string} params.type - Filter by type
     * @returns {Promise} List of disputes
     */
    getDisputes: (params) =>
        api.get('/disputes', { params }),

    /**
     * Get dispute by ID
     * @param {string} id - Dispute ID
     * @returns {Promise} Dispute details
     */
    getDisputeById: (id) =>
        api.get(`/disputes/${id}`),

    /**
     * Get disputes created by current user
     * @param {Object} params - Query parameters
     * @returns {Promise} User's disputes
     */
    getMyDisputes: (params) =>
        api.get('/disputes/my-disputes', { params }),

    /**
     * Get disputes against current user
     * @param {Object} params - Query parameters
     * @returns {Promise} Disputes filed against user
     */
    getDisputesAgainstMe: (params) =>
        api.get('/disputes/against-me', { params }),

    /**
     * Get disputes for a specific job
     * @param {string} jobId - Job ID
     * @returns {Promise} Job's disputes
     */
    getDisputesByJob: (jobId) =>
        api.get(`/disputes/job/${jobId}`),

    /**
     * Update dispute
     * @param {string} id - Dispute ID
     * @param {Object} updateData - Data to update
     * @returns {Promise} Updated dispute data
     */
    updateDispute: (id, updateData) =>
        api.put(`/disputes/${id}`, updateData),

    /**
     * Update dispute status
     * @param {string} id - Dispute ID
     * @param {string} status - New status (pending, under_review, resolved, closed)
     * @returns {Promise} Updated dispute data
     */
    updateDisputeStatus: (id, status) =>
        api.patch(`/disputes/${id}/status`, { status }),

    /**
     * Submit evidence for dispute
     * @param {string} disputeId - Dispute ID
     * @param {FormData} formData - Evidence data with files
     * @returns {Promise} Submitted evidence
     */
    submitEvidence: (disputeId, formData) =>
        api.post(`/disputes/${disputeId}/evidence`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    /**
     * Get evidence for a dispute
     * @param {string} disputeId - Dispute ID
     * @returns {Promise} List of evidence
     */
    getDisputeEvidence: (disputeId) =>
        api.get(`/disputes/${disputeId}/evidence`),

    /**
     * Delete evidence
     * @param {string} disputeId - Dispute ID
     * @param {string} evidenceId - Evidence ID
     * @returns {Promise} Deletion confirmation
     */
    deleteEvidence: (disputeId, evidenceId) =>
        api.delete(`/disputes/${disputeId}/evidence/${evidenceId}`),

    /**
     * Add message to dispute
     * @param {string} disputeId - Dispute ID
     * @param {string} message - Message text
     * @returns {Promise} Message added confirmation
     */
    addDisputeMessage: (disputeId, message) =>
        api.post(`/disputes/${disputeId}/messages`, { message }),

    /**
     * Get messages for a dispute
     * @param {string} disputeId - Dispute ID
     * @returns {Promise} List of messages
     */
    getDisputeMessages: (disputeId) =>
        api.get(`/disputes/${disputeId}/messages`),

    /**
     * Propose resolution
     * @param {string} disputeId - Dispute ID
     * @param {Object} resolutionData - Resolution proposal
     * @param {string} resolutionData.resolution - Proposed resolution
     * @param {number} resolutionData.refundAmount - Refund amount (if applicable)
     * @returns {Promise} Proposed resolution data
     */
    proposeResolution: (disputeId, resolutionData) =>
        api.post(`/disputes/${disputeId}/propose-resolution`, resolutionData),

    /**
     * Accept resolution
     * @param {string} disputeId - Dispute ID
     * @returns {Promise} Acceptance confirmation
     */
    acceptResolution: (disputeId) =>
        api.patch(`/disputes/${disputeId}/accept-resolution`),

    /**
     * Reject resolution
     * @param {string} disputeId - Dispute ID
     * @param {string} reason - Rejection reason
     * @returns {Promise} Rejection confirmation
     */
    rejectResolution: (disputeId, reason) =>
        api.patch(`/disputes/${disputeId}/reject-resolution`, { reason }),

    /**
     * Escalate dispute to admin/mediator
     * @param {string} disputeId - Dispute ID
     * @param {string} reason - Escalation reason
     * @returns {Promise} Escalation confirmation
     */
    escalateDispute: (disputeId, reason) =>
        api.post(`/disputes/${disputeId}/escalate`, { reason }),

    /**
     * Resolve dispute (admin only)
     * @param {string} disputeId - Dispute ID
     * @param {Object} resolutionData - Resolution details
     * @param {string} resolutionData.resolution - Final resolution
     * @param {string} resolutionData.winner - Winner of dispute (if applicable)
     * @param {number} resolutionData.refundAmount - Refund amount
     * @returns {Promise} Resolution confirmation
     */
    resolveDispute: (disputeId, resolutionData) =>
        api.post(`/disputes/${disputeId}/resolve`, resolutionData),

    /**
     * Close dispute
     * @param {string} disputeId - Dispute ID
     * @param {string} reason - Closure reason
     * @returns {Promise} Closure confirmation
     */
    closeDispute: (disputeId, reason) =>
        api.patch(`/disputes/${disputeId}/close`, { reason }),

    /**
     * Withdraw dispute
     * @param {string} disputeId - Dispute ID
     * @returns {Promise} Withdrawal confirmation
     */
    withdrawDispute: (disputeId) =>
        api.patch(`/disputes/${disputeId}/withdraw`),

    /**
     * Get dispute statistics
     * @returns {Promise} Dispute stats
     */
    getDisputeStats: () =>
        api.get('/disputes/stats'),

    /**
     * Get dispute timeline
     * @param {string} disputeId - Dispute ID
     * @returns {Promise} Timeline of dispute events
     */
    getDisputeTimeline: (disputeId) =>
        api.get(`/disputes/${disputeId}/timeline`),

    /**
     * Request mediation
     * @param {string} disputeId - Dispute ID
     * @returns {Promise} Mediation request confirmation
     */
    requestMediation: (disputeId) =>
        api.post(`/disputes/${disputeId}/request-mediation`),

    /**
     * Get mediation details
     * @param {string} disputeId - Dispute ID
     * @returns {Promise} Mediation information
     */
    getMediationDetails: (disputeId) =>
        api.get(`/disputes/${disputeId}/mediation`),

    /**
     * Schedule mediation session
     * @param {string} disputeId - Dispute ID
     * @param {Object} sessionData - Session details
     * @param {string} sessionData.date - Session date
     * @param {string} sessionData.time - Session time
     * @returns {Promise} Session scheduled confirmation
     */
    scheduleMediationSession: (disputeId, sessionData) =>
        api.post(`/disputes/${disputeId}/mediation/schedule`, sessionData),

    /**
     * Rate dispute resolution
     * @param {string} disputeId - Dispute ID
     * @param {Object} ratingData - Rating details
     * @param {number} ratingData.rating - Rating (1-5)
     * @param {string} ratingData.feedback - Feedback comment
     * @returns {Promise} Rating submitted confirmation
     */
    rateResolution: (disputeId, ratingData) =>
        api.post(`/disputes/${disputeId}/rate`, ratingData),
};

export default disputeService;