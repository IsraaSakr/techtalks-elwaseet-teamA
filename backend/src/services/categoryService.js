/**
 * Category Service
 * 
 * Location: frontend/src/services/categoryService.js
 * 
 * Handles all category-related API calls:
 * - Browsing categories
 * - Category details
 * - Subcategories
 */

import api from './api';

export const categoryService = {
    /**
     * Get all categories
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {boolean} params.includeSubcategories - Include subcategories
     * @returns {Promise} List of categories
     */
    getCategories: (params) =>
        api.get('/categories', { params }),

    /**
     * Get category by ID
     * @param {string} id - Category ID
     * @returns {Promise} Category details
     */
    getCategoryById: (id) =>
        api.get(`/categories/${id}`),

    /**
     * Get category by slug
     * @param {string} slug - Category slug
     * @returns {Promise} Category details
     */
    getCategoryBySlug: (slug) =>
        api.get(`/categories/slug/${slug}`),

    /**
     * Get parent categories (top-level)
     * @returns {Promise} List of parent categories
     */
    getParentCategories: () =>
        api.get('/categories/parents'),

    /**
     * Get subcategories of a category
     * @param {string} parentId - Parent category ID
     * @returns {Promise} List of subcategories
     */
    getSubcategories: (parentId) =>
        api.get(`/categories/${parentId}/subcategories`),

    /**
     * Search categories
     * @param {string} query - Search query
     * @returns {Promise} Search results
     */
    searchCategories: (query) =>
        api.get('/categories/search', { params: { q: query } }),

    /**
     * Get popular categories
     * @param {number} limit - Number of categories
     * @returns {Promise} List of popular categories
     */
    getPopularCategories: (limit = 10) =>
        api.get('/categories/popular', { params: { limit } }),

    /**
     * Get category statistics
     * @param {string} categoryId - Category ID
     * @returns {Promise} Category statistics (job count, provider count, etc.)
     */
    getCategoryStats: (categoryId) =>
        api.get(`/categories/${categoryId}/stats`),

    /**
     * Get jobs in category
     * @param {string} categoryId - Category ID
     * @param {Object} params - Query parameters
     * @returns {Promise} List of jobs in category
     */
    getCategoryJobs: (categoryId, params) =>
        api.get(`/categories/${categoryId}/jobs`, { params }),

    /**
     * Get providers in category
     * @param {string} categoryId - Category ID
     * @param {Object} params - Query parameters
     * @returns {Promise} List of providers in category
     */
    getCategoryProviders: (categoryId, params) =>
        api.get(`/categories/${categoryId}/providers`, { params }),

    /**
     * Get category tree (hierarchical structure)
     * @returns {Promise} Category tree structure
     */
    getCategoryTree: () =>
        api.get('/categories/tree'),

    /**
     * Get breadcrumb path for category
     * @param {string} categoryId - Category ID
     * @returns {Promise} Breadcrumb path
     */
    getCategoryBreadcrumb: (categoryId) =>
        api.get(`/categories/${categoryId}/breadcrumb`),

    /**
     * Get related categories
     * @param {string} categoryId - Category ID
     * @returns {Promise} List of related categories
     */
    getRelatedCategories: (categoryId) =>
        api.get(`/categories/${categoryId}/related`),

    /**
     * Get trending categories
     * @param {Object} params - Query parameters
     * @param {string} params.period - Time period (week, month)
     * @returns {Promise} List of trending categories
     */
    getTrendingCategories: (params) =>
        api.get('/categories/trending', { params }),

    /**
     * Get category icon/image
     * @param {string} categoryId - Category ID
     * @returns {Promise} Category icon URL
     */
    getCategoryIcon: (categoryId) =>
        api.get(`/categories/${categoryId}/icon`),

    // Admin-only functions (if user has admin role)

    /**
     * Create a new category (admin only)
     * @param {Object} categoryData - Category data
     * @param {string} categoryData.name - Category name
     * @param {string} categoryData.description - Description
     * @param {string} categoryData.parentId - Parent category ID (optional)
     * @returns {Promise} Created category
     */
    createCategory: (categoryData) =>
        api.post('/categories', categoryData),

    /**
     * Create category with icon (admin only)
     * @param {FormData} formData - Category data with icon image
     * @returns {Promise} Created category
     */
    createCategoryWithIcon: (formData) =>
        api.post('/categories', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    /**
     * Update category (admin only)
     * @param {string} id - Category ID
     * @param {Object} categoryData - Updated category data
     * @returns {Promise} Updated category
     */
    updateCategory: (id, categoryData) =>
        api.put(`/categories/${id}`, categoryData),

    /**
     * Update category with icon (admin only)
     * @param {string} id - Category ID
     * @param {FormData} formData - Updated data with icon
     * @returns {Promise} Updated category
     */
    updateCategoryWithIcon: (id, formData) =>
        api.put(`/categories/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    /**
     * Delete category (admin only)
     * @param {string} id - Category ID
     * @returns {Promise} Deletion confirmation
     */
    deleteCategory: (id) =>
        api.delete(`/categories/${id}`),

    /**
     * Reorder categories (admin only)
     * @param {Array} categoryOrder - Array of category IDs in new order
     * @returns {Promise} Reorder confirmation
     */
    reorderCategories: (categoryOrder) =>
        api.put('/categories/reorder', { categoryOrder }),

    /**
     * Merge categories (admin only)
     * @param {string} sourceId - Source category ID
     * @param {string} targetId - Target category ID
     * @returns {Promise} Merge confirmation
     */
    mergeCategories: (sourceId, targetId) =>
        api.post('/categories/merge', { sourceId, targetId }),

    /**
     * Toggle category visibility (admin only)
     * @param {string} categoryId - Category ID
     * @param {boolean} visible - Visibility status
     * @returns {Promise} Updated category
     */
    toggleCategoryVisibility: (categoryId, visible) =>
        api.patch(`/categories/${categoryId}/visibility`, { visible }),

    /**
     * Feature category (admin only)
     * @param {string} categoryId - Category ID
     * @returns {Promise} Updated category
     */
    featureCategory: (categoryId) =>
        api.patch(`/categories/${categoryId}/feature`),

    /**
     * Unfeature category (admin only)
     * @param {string} categoryId - Category ID
     * @returns {Promise} Updated category
     */
    unfeatureCategory: (categoryId) =>
        api.patch(`/categories/${categoryId}/unfeature`),
};

export default categoryService;