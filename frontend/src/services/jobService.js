/**
 * Job Service
 * 
 * Handles all job-related API operations for the marketplace.
 * This service manages job creation, retrieval, updates, and deletions.
 * 
 * Key Features:
 * - Multipart/form-data support for file uploads
 * - Automatic error handling and transformation
 * - Clean separation of API logic from components
 */

import api from './api'; // Your axios instance with interceptors

/**
 * Job Service Object
 * Contains all methods for interacting with the Jobs API
 */
const jobService = {
  /**
   * Create a new job posting
   * 
   * @param {FormData} formData - FormData object containing:
   *   - 'data': JSON string with job details (title, description, categoryId, etc.)
   *   - 'photos': Array of image files (optional, max 5 files, max 5MB each)
   * 
   * @returns {Promise<Object>} Created job object with jobId
   * 
   * @example
   * const formData = new FormData();
   * formData.append('data', JSON.stringify({
   *   title: 'Fix leaking sink',
   *   description: 'Kitchen sink needs repair...',
   *   categoryId: 1,
   *   budgetMin: 50.00,
   *   budgetMax: 150.00,
   *   location: 'BEIRUT',
   *   urgency: 'HIGH'
   * }));
   * photos.forEach(photo => formData.append('photos', photo));
   * 
   * const response = await jobService.createJob(formData);
   * 
   * @throws {Error} 400 - Validation errors
   * @throws {Error} 401 - Unauthorized (not logged in)
   * @throws {Error} 403 - Forbidden (not a customer)
   */
  createJob: async (formData) => {
    // IMPORTANT: Do NOT set Content-Type header manually!
    // The browser will automatically set it to multipart/form-data
    // with the correct boundary parameter
    const response = await api.post('/api/jobs', formData, {
      headers: {
        // Let browser set Content-Type with boundary automatically
        // 'Content-Type': 'multipart/form-data' // DON'T DO THIS!
      }
    });
    return response;
  },

  /**
   * Get all jobs (with optional filters)
   * 
   * @param {Object} params - Query parameters for filtering
   * @param {string} [params.status] - Filter by status (OPEN, IN_PROGRESS, COMPLETED, CANCELLED)
   * @param {number} [params.categoryId] - Filter by category
   * @param {string} [params.location] - Filter by location
   * @param {string} [params.urgency] - Filter by urgency level
   * @param {number} [params.page=0] - Page number for pagination
   * @param {number} [params.size=10] - Page size
   * 
   * @returns {Promise<Object>} Paginated list of jobs
   */
  getJobs: async (params = {}) => {
    const response = await api.get('/api/jobs', { params });
    return response;
  },

  /**
   * Get a specific job by ID
   * 
   * @param {number|string} jobId - The job's unique identifier
   * @returns {Promise<Object>} Job details including photos and applications
   */
  getJobById: async (jobId) => {
    const response = await api.get(`/api/jobs/${jobId}`);
    return response;
  },

  /**
   * Get jobs posted by the current customer
   * 
   * @param {Object} params - Query parameters for filtering/pagination
   * @param {number} [params.page=0] - Page number (0-indexed)
   * @param {number} [params.size=10] - Items per page
   * @param {string} [params.status] - Filter by status (OPEN, IN_PROGRESS, COMPLETED, CONFIRMED, DISPUTED)
   * @param {string} [params.sortBy='postedAt'] - Sort field
   * @param {string} [params.sortDir='desc'] - Sort direction (asc/desc)
   * 
   * @returns {Promise<Object>} Paginated list of customer's jobs
   * 
   * @example
   * // Get first page of all jobs
   * const response = await jobService.getMyJobs({ page: 0, size: 10 });
   * 
   * // Get open jobs only
   * const response = await jobService.getMyJobs({ page: 0, size: 10, status: 'OPEN' });
   * 
   * Response format:
   * {
   *   content: [...jobs],
   *   pageable: { pageNumber: 0, pageSize: 10 },
   *   totalElements: 15,
   *   totalPages: 2,
   *   last: false,
   *   first: true
   * }
   */
  getMyJobs: async (params = {}) => {
    const response = await api.get('/api/jobs/my-jobs', { params });
    return response;
  },

  /**
   * Update an existing job
   * 
   * @param {number|string} jobId - The job's unique identifier
   * @param {FormData} formData - Updated job data (same format as createJob)
   * @returns {Promise<Object>} Updated job object
   */
  updateJob: async (jobId, formData) => {
    const response = await api.put(`/api/jobs/${jobId}`, formData);
    return response;
  },

  /**
   * Cancel/Delete a job
   * 
   * @param {number|string} jobId - The job's unique identifier
   * @returns {Promise<void>}
   */
  deleteJob: async (jobId) => {
    const response = await api.delete(`/api/jobs/${jobId}`);
    return response;
  },

  /**
   * Update job status
   * 
   * @param {number|string} jobId - The job's unique identifier
   * @param {string} status - New status (OPEN, IN_PROGRESS, COMPLETED, CANCELLED)
   * @returns {Promise<Object>} Updated job object
   */
  updateJobStatus: async (jobId, status) => {
    const response = await api.patch(`/api/jobs/${jobId}/status`, { status });
    return response;
  },

  /**
   * Get jobs available for providers to browse
   * 
   * @param {Object} params - Filter and pagination parameters
   * @returns {Promise<Object>} List of open jobs
   */
  getBrowseJobs: async (params = {}) => {
    const response = await api.get('/api/jobs/browse', { 
      params: { ...params, status: 'OPEN' } 
    });
    return response;
  }
};

export default jobService;