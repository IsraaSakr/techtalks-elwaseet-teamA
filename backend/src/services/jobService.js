/**
 * Job Service
 * 
 * Location: frontend/src/services/jobService.js
 * 
 * Handles all job-related API calls:
 * - Job creation and management
 * - Job browsing and search
 * - Job status updates
 */

import api from './api';

export const jobService = {
    /**
     * Create a new job posting
     * @param {FormData} formData - Job data with optional images
     * @returns {Promise} Created job data
     */
    createJob: (formData) =>
        api.post('/jobs', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    /**
     * Browse/search jobs with filters
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Jobs per page
     * @param {string} params.category - Filter by category
     * @param {string} params.location - Filter by location
     * @param {number} params.minBudget - Minimum budget
     * @param {number} params.maxBudget - Maximum budget
     * @param {string} params.search - Search query
     * @param {string} params.status - Filter by status (open, in_progress, completed)
     * @param {string} params.sortBy - Sort field (createdAt, budget, deadline)
     * @param {string} params.order - Sort order (asc, desc)
     * @returns {Promise} List of jobs
     */
    browseJobs: (params) =>
        api.get('/jobs', { params }),

    /**
     * Get job by ID
     * @param {string} id - Job ID
     * @returns {Promise} Job details
     */
    getJobById: (id) =>
        api.get(`/jobs/${id}`),

    /**
     * Get jobs posted by current user
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Jobs per page
     * @param {string} params.status - Filter by status
     * @returns {Promise} List of user's jobs
     */
    getMyJobs: (params) =>
        api.get('/jobs/my-jobs', { params }),

    /**
     * Update a job
     * @param {string} id - Job ID
     * @param {FormData} formData - Updated job data
     * @returns {Promise} Updated job data
     */
    updateJob: (id, formData) =>
        api.put(`/jobs/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    /**
     * Delete a job
     * @param {string} id - Job ID
     * @returns {Promise} Deletion confirmation
     */
    deleteJob: (id) =>
        api.delete(`/jobs/${id}`),

    /**
     * Update job status
     * @param {string} id - Job ID
     * @param {string} status - New status (open, in_progress, completed, cancelled)
     * @returns {Promise} Updated job data
     */
    updateJobStatus: (id, status) =>
        api.patch(`/jobs/${id}/status`, { status }),

    /**
     * Close a job (mark as filled)
     * @param {string} id - Job ID
     * @returns {Promise} Updated job data
     */
    closeJob: (id) =>
        api.patch(`/jobs/${id}/close`),

    /**
     * Reopen a job
     * @param {string} id - Job ID
     * @returns {Promise} Updated job data
     */
    reopenJob: (id) =>
        api.patch(`/jobs/${id}/reopen`),

    /**
     * Mark job as completed
     * @param {string} id - Job ID
     * @returns {Promise} Updated job data
     */
    markJobCompleted: (id) =>
        api.patch(`/jobs/${id}/complete`),

    /**
     * Get featured jobs
     * @param {Object} params - Query parameters
     * @returns {Promise} List of featured jobs
     */
    getFeaturedJobs: (params) =>
        api.get('/jobs/featured', { params }),

    /**
     * Get recommended jobs for current user
     * @param {Object} params - Query parameters
     * @returns {Promise} List of recommended jobs
     */
    getRecommendedJobs: (params) =>
        api.get('/jobs/recommended', { params }),

    /**
     * Search jobs by keyword
     * @param {string} query - Search query
     * @param {Object} params - Additional filters
     * @returns {Promise} Search results
     */
    searchJobs: (query, params = {}) =>
        api.get('/jobs/search', { params: { q: query, ...params } }),

    /**
     * Get jobs by category
     * @param {string} categoryId - Category ID
     * @param {Object} params - Query parameters
     * @returns {Promise} List of jobs in category
     */
    getJobsByCategory: (categoryId, params) =>
        api.get(`/jobs/category/${categoryId}`, { params }),

    /**
     * Get jobs near a location
     * @param {Object} params - Location and radius parameters
     * @param {number} params.latitude - Latitude
     * @param {number} params.longitude - Longitude
     * @param {number} params.radius - Radius in kilometers
     * @returns {Promise} List of nearby jobs
     */
    getNearbyJobs: (params) =>
        api.get('/jobs/nearby', { params }),

    /**
     * Get job statistics
     * @param {string} id - Job ID
     * @returns {Promise} Job statistics (views, applications, etc.)
     */
    getJobStats: (id) =>
        api.get(`/jobs/${id}/stats`),

    /**
     * Report a job
     * @param {string} id - Job ID
     * @param {Object} reportData - Report details
     * @param {string} reportData.reason - Reason for report
     * @param {string} reportData.description - Detailed description
     * @returns {Promise} Report confirmation
     */
    reportJob: (id, reportData) =>
        api.post(`/jobs/${id}/report`, reportData),

    /**
     * Boost/promote a job
     * @param {string} id - Job ID
     * @param {Object} boostData - Boost options
     * @returns {Promise} Boost confirmation
     */
    boostJob: (id, boostData) =>
        api.post(`/jobs/${id}/boost`, boostData),
};

export default jobService;