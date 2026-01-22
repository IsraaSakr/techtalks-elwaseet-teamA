/**
 * Axios API Instance with JWT Authentication
 * 
 * This file creates a configured axios instance that:
 * 1. Automatically adds JWT tokens to all requests
 * 2. Handles authentication errors globally
 * 3. Provides consistent error handling across the app
 */

import axios from 'axios';

// Base URL - uses Vite environment variable or defaults to localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Create axios instance with default configuration
 */
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

/**
 * REQUEST INTERCEPTOR
 * 
 * Runs before every request is sent
 * Purpose: Automatically attach JWT token to requests
 * 
 * Flow:
 * 1. Check if token exists in localStorage
 * 2. If yes, add it to Authorization header
 * 3. If no, continue without token (for public endpoints)
 */
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        // If token exists, add it to request headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request for debugging (remove in production)
        if (import.meta.env.DEV) {
            console.log(`📤 ${config.method.toUpperCase()} ${config.url}`, {
                headers: config.headers,
                data: config.data,
            });
        }

        return config;
    },
    (error) => {
        // Handle request configuration errors
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

/**
 * RESPONSE INTERCEPTOR
 * 
 * Runs after every response is received
 * Purpose: Handle errors globally
 * 
 * Error Handling:
 * - 401 Unauthorized: Token expired/invalid → logout user
 * - 403 Forbidden: No permission → show error
 * - 500 Server Error: Backend issue → show generic error
 * - Network Error: Cannot connect → show connection error
 */
api.interceptors.response.use(
    (response) => {
        // Success response - log for debugging
        if (import.meta.env.DEV) {
            console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
        }
        return response;
    },
    (error) => {
        // Check if error has a response from server
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // Unauthorized - token expired or invalid
                    console.error('🔒 Unauthorized: Token expired or invalid');

                    // Clear authentication data
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');

                    // Redirect to login page
                    // Only redirect if not already on login/register page
                    if (!window.location.pathname.includes('/login') &&
                        !window.location.pathname.includes('/register')) {
                        window.location.href = '/login';
                    }
                    break;

                case 403:
                    // Forbidden - user doesn't have permission
                    console.error('🚫 Forbidden: Insufficient permissions');
                    // You can show a toast/notification here
                    error.message = 'You do not have permission to perform this action';
                    break;

                case 404:
                    // Not Found
                    console.error('🔍 Not Found:', error.config.url);
                    error.message = 'The requested resource was not found';
                    break;

                case 500:
                    // Internal Server Error
                    console.error('💥 Server Error:', data);
                    error.message = 'Something went wrong on the server. Please try again later.';
                    break;

                default:
                    // Other HTTP errors
                    console.error(`⚠️ HTTP Error ${status}:`, data);
                    error.message = data.message || 'An error occurred';
            }
        } else if (error.request) {
            // Request was made but no response received (network error)
            console.error('🌐 Network Error: Cannot connect to server');
            error.message = 'Cannot connect to the server. Please check your internet connection.';
        } else {
            // Something else happened
            console.error('❌ Error:', error.message);
        }

        return Promise.reject(error);
    }
);

/**
 * Utility function to check if user is authenticated
 */
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

/**
 * Utility function to get current user from localStorage
 */
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    try {
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
};

/**
 * Utility function to logout user
 */
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

export default api;