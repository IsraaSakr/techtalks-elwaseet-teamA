/**
 * Authentication Service
 * 
 * Location: frontend/src/services/authService.js
 * 
 * Handles all authentication-related API calls:
 * - User registration and login
 * - Admin login
 * - OTP verification
 * - Password management
 * - Session management
 */

import api from './api';

export const authService = {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @param {string} userData.username - Username
     * @param {string} userData.email - Email address
     * @param {string} userData.password - Password
     * @param {string} userData.phone - Phone number
     * @returns {Promise} Response with user data and token
     */
    register: (userData) =>
        api.post('/auth/register', userData),

    /**
     * Login with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} Response with user data and token
     */
    login: (email, password) =>
        api.post('/auth/login', { email, password }),

    /**
     * Admin login
     * @param {string} email - Admin email
     * @param {string} password - Admin password
     * @returns {Promise} Response with admin data and token
     */
    adminLogin: (email, password) =>
        api.post('/auth/admin/login', { email, password }),

    /**
     * Verify OTP code
     * @param {string} email - User email
     * @param {string} code - OTP code
     * @returns {Promise} Verification status
     */
    verifyOtp: (email, code) =>
        api.post('/auth/verify-otp', { email, code }),

    /**
     * Resend OTP code
     * @param {string} email - User email
     * @returns {Promise} Response confirming OTP sent
     */
    resendOtp: (email) =>
        api.post('/auth/resend-otp', { email }),

    /**
     * Get current authenticated user
     * @returns {Promise} Current user data
     */
    getMe: () =>
        api.get('/auth/me'),

    /**
     * Logout current user
     * @returns {Promise} Logout confirmation
     */
    logout: () =>
        api.post('/auth/logout'),

    /**
     * Change user password
     * @param {string} oldPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Promise} Password change confirmation
     */
    changePassword: (oldPassword, newPassword) =>
        api.put('/auth/password', { oldPassword, newPassword }),

    /**
     * Request password reset
     * @param {string} email - User email
     * @returns {Promise} Reset email sent confirmation
     */
    forgotPassword: (email) =>
        api.post('/auth/forgot-password', { email }),

    /**
     * Reset password with token
     * @param {string} token - Reset token from email
     * @param {string} newPassword - New password
     * @returns {Promise} Password reset confirmation
     */
    resetPassword: (token, newPassword) =>
        api.post('/auth/reset-password', { token, newPassword }),

    /**
     * Refresh authentication token
     * @returns {Promise} New token
     */
    refreshToken: () =>
        api.post('/auth/refresh-token'),

    /**
     * Verify email with token
     * @param {string} token - Email verification token
     * @returns {Promise} Verification confirmation
     */
    verifyEmail: (token) =>
        api.post('/auth/verify-email', { token }),
};

export default authService;