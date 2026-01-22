/**
 * Admin Service
 * 
 * Location: frontend/src/services/adminService.js
 * 
 * Handles all admin-related API calls:
 * - Dashboard statistics
 * - User management
 * - Content moderation
 * - System settings
 */

import api from './api';

export const adminService = {
    /**
     * Get dashboard statistics
     * @param {Object} params - Query parameters
     * @param {string} params.period - Time period (today, week, month, year)
     * @returns {Promise} Dashboard stats
     */
    getStats: (params) =>
        api.get('/admin/stats', { params }),

    /**
     * Get detailed analytics
     * @param {Object} params - Query parameters
     * @returns {Promise} Analytics data
     */
    getAnalytics: (params) =>
        api.get('/admin/analytics', { params }),

    // ═══════════════════════════════════════
    // USER MANAGEMENT
    // ═══════════════════════════════════════

    /**
     * Get all users
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.role - Filter by role
     * @param {string} params.status - Filter by status
     * @param {string} params.search - Search query
     * @returns {Promise} List of users
     */
    getUsers: (params) =>
        api.get('/admin/users', { params }),

    /**
     * Get user by ID
     * @param {string} userId - User ID
     * @returns {Promise} User details
     */
    getUserById: (userId) =>
        api.get(`/admin/users/${userId}`),

    /**
     * Update user status
     * @param {string} userId - User ID
     * @param {string} status - New status (active, suspended, banned)
     * @returns {Promise} Updated user data
     */
    updateUserStatus: (userId, status) =>
        api.patch(`/admin/users/${userId}/status`, { status }),

    /**
     * Suspend user account
     * @param {string} userId - User ID
     * @param {Object} suspensionData - Suspension details
     * @param {string} suspensionData.reason - Suspension reason
     * @param {string} suspensionData.duration - Suspension duration
     * @returns {Promise} Suspension confirmation
     */
    suspendUser: (userId, suspensionData) =>
        api.post(`/admin/users/${userId}/suspend`, suspensionData),

    /**
     * Ban user account
     * @param {string} userId - User ID
     * @param {string} reason - Ban reason
     * @returns {Promise} Ban confirmation
     */
    banUser: (userId, reason) =>
        api.post(`/admin/users/${userId}/ban`, { reason }),

    /**
     * Unban user account
     * @param {string} userId - User ID
     * @returns {Promise} Unban confirmation
     */
    unbanUser: (userId) =>
        api.post(`/admin/users/${userId}/unban`),

    /**
     * Delete user account
     * @param {string} userId - User ID
     * @returns {Promise} Deletion confirmation
     */
    deleteUser: (userId) =>
        api.delete(`/admin/users/${userId}`),

    /**
     * Update user role
     * @param {string} userId - User ID
     * @param {string} role - New role (user, provider, admin)
     * @returns {Promise} Updated user data
     */
    updateUserRole: (userId, role) =>
        api.patch(`/admin/users/${userId}/role`, { role }),

    /**
     * Verify user account
     * @param {string} userId - User ID
     * @returns {Promise} Verification confirmation
     */
    verifyUser: (userId) =>
        api.post(`/admin/users/${userId}/verify`),

    // ═══════════════════════════════════════
    // JOB MANAGEMENT
    // ═══════════════════════════════════════

    /**
     * Get all jobs (admin view)
     * @param {Object} params - Query parameters
     * @returns {Promise} List of jobs
     */
    getJobs: (params) =>
        api.get('/admin/jobs', { params }),

    /**
     * Get job by ID (admin view)
     * @param {string} jobId - Job ID
     * @returns {Promise} Job details
     */
    getJobById: (jobId) =>
        api.get(`/admin/jobs/${jobId}`),

    /**
     * Update job status
     * @param {string} jobId - Job ID
     * @param {string} status - New status
     * @returns {Promise} Updated job data
     */
    updateJobStatus: (jobId, status) =>
        api.patch(`/admin/jobs/${jobId}/status`, { status }),

    /**
     * Approve job
     * @param {string} jobId - Job ID
     * @returns {Promise} Approval confirmation
     */
    approveJob: (jobId) =>
        api.post(`/admin/jobs/${jobId}/approve`),

    /**
     * Reject job
     * @param {string} jobId - Job ID
     * @param {string} reason - Rejection reason
     * @returns {Promise} Rejection confirmation
     */
    rejectJob: (jobId, reason) =>
        api.post(`/admin/jobs/${jobId}/reject`, { reason }),

    /**
     * Delete job
     * @param {string} jobId - Job ID
     * @returns {Promise} Deletion confirmation
     */
    deleteJob: (jobId) =>
        api.delete(`/admin/jobs/${jobId}`),

    /**
     * Feature job
     * @param {string} jobId - Job ID
     * @param {Object} featureData - Feature details
     * @returns {Promise} Feature confirmation
     */
    featureJob: (jobId, featureData) =>
        api.post(`/admin/jobs/${jobId}/feature`, featureData),

    // ═══════════════════════════════════════
    // TRANSACTION MANAGEMENT
    // ═══════════════════════════════════════

    /**
     * Get all transactions
     * @param {Object} params - Query parameters
     * @returns {Promise} List of transactions
     */
    getTransactions: (params) =>
        api.get('/admin/transactions', { params }),

    /**
     * Get transaction by ID
     * @param {string} transactionId - Transaction ID
     * @returns {Promise} Transaction details
     */
    getTransactionById: (transactionId) =>
        api.get(`/admin/transactions/${transactionId}`),

    /**
     * Approve refund request
     * @param {string} transactionId - Transaction ID
     * @returns {Promise} Approval confirmation
     */
    approveRefund: (transactionId) =>
        api.post(`/admin/transactions/${transactionId}/approve-refund`),

    /**
     * Reject refund request
     * @param {string} transactionId - Transaction ID
     * @param {string} reason - Rejection reason
     * @returns {Promise} Rejection confirmation
     */
    rejectRefund: (transactionId, reason) =>
        api.post(`/admin/transactions/${transactionId}/reject-refund`, { reason }),

    // ═══════════════════════════════════════
    // REVIEW MANAGEMENT
    // ═══════════════════════════════════════

    /**
     * Get all reviews
     * @param {Object} params - Query parameters
     * @returns {Promise} List of reviews
     */
    getReviews: (params) =>
        api.get('/admin/reviews', { params }),

    /**
     * Get flagged reviews
     * @param {Object} params - Query parameters
     * @returns {Promise} List of flagged reviews
     */
    getFlaggedReviews: (params) =>
        api.get('/admin/reviews/flagged', { params }),

    /**
     * Approve review
     * @param {string} reviewId - Review ID
     * @returns {Promise} Approval confirmation
     */
    approveReview: (reviewId) =>
        api.post(`/admin/reviews/${reviewId}/approve`),

    /**
     * Reject review
     * @param {string} reviewId - Review ID
     * @param {string} reason - Rejection reason
     * @returns {Promise} Rejection confirmation
     */
    rejectReview: (reviewId, reason) =>
        api.post(`/admin/reviews/${reviewId}/reject`, { reason }),

    /**
     * Delete review
     * @param {string} reviewId - Review ID
     * @returns {Promise} Deletion confirmation
     */
    deleteReview: (reviewId) =>
        api.delete(`/admin/reviews/${reviewId}`),

    // ═══════════════════════════════════════
    // DISPUTE MANAGEMENT
    // ═══════════════════════════════════════

    /**
     * Get all disputes
     * @param {Object} params - Query parameters
     * @returns {Promise} List of disputes
     */
    getDisputes: (params) =>
        api.get('/admin/disputes', { params }),

    /**
     * Get dispute by ID
     * @param {string} disputeId - Dispute ID
     * @returns {Promise} Dispute details
     */
    getDisputeById: (disputeId) =>
        api.get(`/admin/disputes/${disputeId}`),

    /**
     * Assign dispute to mediator
     * @param {string} disputeId - Dispute ID
     * @param {string} mediatorId - Mediator ID
     * @returns {Promise} Assignment confirmation
     */
    assignDispute: (disputeId, mediatorId) =>
        api.post(`/admin/disputes/${disputeId}/assign`, { mediatorId }),

    /**
     * Resolve dispute (admin decision)
     * @param {string} disputeId - Dispute ID
     * @param {Object} resolutionData - Resolution details
     * @returns {Promise} Resolution confirmation
     */
    resolveDispute: (disputeId, resolutionData) =>
        api.post(`/admin/disputes/${disputeId}/resolve`, resolutionData),

    // ═══════════════════════════════════════
    // REPORTS AND MODERATION
    // ═══════════════════════════════════════

    /**
     * Get all reports
     * @param {Object} params - Query parameters
     * @param {string} params.type - Report type (job, user, review)
     * @param {string} params.status - Report status
     * @returns {Promise} List of reports
     */
    getReports: (params) =>
        api.get('/admin/reports', { params }),

    /**
     * Get report by ID
     * @param {string} reportId - Report ID
     * @returns {Promise} Report details
     */
    getReportById: (reportId) =>
        api.get(`/admin/reports/${reportId}`),

    /**
     * Update report status
     * @param {string} reportId - Report ID
     * @param {string} status - New status (pending, reviewing, resolved, dismissed)
     * @returns {Promise} Updated report
     */
    updateReportStatus: (reportId, status) =>
        api.patch(`/admin/reports/${reportId}/status`, { status }),

    /**
     * Resolve report
     * @param {string} reportId - Report ID
     * @param {Object} resolutionData - Resolution details
     * @returns {Promise} Resolution confirmation
     */
    resolveReport: (reportId, resolutionData) =>
        api.post(`/admin/reports/${reportId}/resolve`, resolutionData),

    /**
     * Dismiss report
     * @param {string} reportId - Report ID
     * @param {string} reason - Dismissal reason
     * @returns {Promise} Dismissal confirmation
     */
    dismissReport: (reportId, reason) =>
        api.post(`/admin/reports/${reportId}/dismiss`, { reason }),

    // ═══════════════════════════════════════
    // CATEGORY MANAGEMENT
    // ═══════════════════════════════════════

    /**
     * Create category
     * @param {Object} categoryData - Category data
     * @returns {Promise} Created category
     */
    createCategory: (categoryData) =>
        api.post('/admin/categories', categoryData),

    /**
     * Update category
     * @param {string} categoryId - Category ID
     * @param {Object} categoryData - Updated data
     * @returns {Promise} Updated category
     */
    updateCategory: (categoryId, categoryData) =>
        api.put(`/admin/categories/${categoryId}`, categoryData),

    /**
     * Delete category
     * @param {string} categoryId - Category ID
     * @returns {Promise} Deletion confirmation
     */
    deleteCategory: (categoryId) =>
        api.delete(`/admin/categories/${categoryId}`),

    // ═══════════════════════════════════════
    // SYSTEM SETTINGS
    // ═══════════════════════════════════════

    /**
     * Get system settings
     * @returns {Promise} System settings
     */
    getSettings: () =>
        api.get('/admin/settings'),

    /**
     * Update system settings
     * @param {Object} settings - Settings to update
     * @returns {Promise} Updated settings
     */
    updateSettings: (settings) =>
        api.put('/admin/settings', settings),

    /**
     * Get platform statistics
     * @param {Object} params - Query parameters
     * @returns {Promise} Platform statistics
     */
    getPlatformStats: (params) =>
        api.get('/admin/platform-stats', { params }),

    /**
     * Get revenue statistics
     * @param {Object} params - Query parameters
     * @returns {Promise} Revenue statistics
     */
    getRevenueStats: (params) =>
        api.get('/admin/revenue-stats', { params }),

    /**
     * Export data
     * @param {Object} exportParams - Export parameters
     * @param {string} exportParams.type - Data type to export
     * @param {string} exportParams.format - Export format (csv, xlsx, json)
     * @returns {Promise} Export file
     */
    exportData: (exportParams) =>
        api.post('/admin/export', exportParams, {
            responseType: 'blob'
        }),

    /**
     * Get activity logs
     * @param {Object} params - Query parameters
     * @returns {Promise} Activity logs
     */
    getActivityLogs: (params) =>
        api.get('/admin/logs', { params }),

    /**
     * Send system notification
     * @param {Object} notificationData - Notification details
     * @returns {Promise} Notification sent confirmation
     */
    sendSystemNotification: (notificationData) =>
        api.post('/admin/notifications', notificationData),

    /**
     * Backup database
     * @returns {Promise} Backup confirmation
     */
    backupDatabase: () =>
        api.post('/admin/backup'),

    /**
     * Clear cache
     * @returns {Promise} Cache clear confirmation
     */
    clearCache: () =>
        api.post('/admin/clear-cache'),
};

export default adminService;