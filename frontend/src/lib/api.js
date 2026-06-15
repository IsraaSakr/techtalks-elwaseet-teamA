import axios from 'axios';
import { storage } from './utils';
import { MOCK_USERS, MOCK_JOBS, MOCK_APPLICATIONS, MOCK_NOTIFICATIONS, mockDelay, mockLogin, mockVerifyOTP } from './mockData';

// Enable mock mode for development (set to false when backend is ready)
const USE_MOCK_API = false;

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = storage.get('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
                storage.remove('authToken');
                storage.remove('user');
                window.location.href = '/login';
            }

            return Promise.reject(data);
        } else if (error.request) {
            return Promise.reject({ message: 'Network error. Please check your connection.' });
        } else {
            return Promise.reject({ message: error.message });
        }
    }
);

// API Methods with Mock Support
export const authAPI = {
    register: async (data) => {
        if (USE_MOCK_API) {
            await mockDelay();
            const newUser = {
                id: 'user-' + Date.now(),
                ...data,
                isVerified: false,
                createdAt: new Date().toISOString(),
            };
            // Add to MOCK_USERS so verifyOTP can find it
            // MOCK_USERS is an object, so we'll add it by key. 
            // We use email as key or just a new key like 'newUser' + timestamp, 
            // but MOCK_USERS structure seems to be key-based (customer, provider, etc).
            // Let's just add it with a generated key.
            MOCK_USERS['user_' + Date.now()] = newUser;
            
            return { success: true, message: 'Registration successful' };
        }
        return api.post('/auth/register', data);
    },

    login: async (data) => {
        if (USE_MOCK_API) {
            return mockLogin(data.email, data.password);
        }
        return api.post('/auth/login', data);
    },

    verifyOTP: async (data) => {
        if (USE_MOCK_API) {
            return mockVerifyOTP(data.email, data.otp);
        }
        return api.post('/auth/verify-otp', data);
    },

    logout: () => api.post('/auth/logout'),
};

export const jobsAPI = {
    create: async (data) => {
        if (USE_MOCK_API) {
            await mockDelay();
            const newJob = {
                id: 'job-' + Date.now(),
                ...data,
                status: 'OPEN',
                customerId: storage.get('user')?.id,
                providerId: null,
                createdAt: new Date().toISOString(),
            };
            
            // PERSISTENCE: Get existing jobs from storage or fallback to initial mock data
            const existingJobs = storage.get('mock_jobs') || MOCK_JOBS;
            const updatedJobs = [newJob, ...existingJobs]; // Prepend new job
            storage.set('mock_jobs', updatedJobs);
            
            return { job: newJob };
        }
        return api.post('/jobs', data);
    },

    getAll: async (params) => {
        return api.get('/api/jobs', { params });
    },

    getMyJobs: async (params) => {
        const user = storage.get('user');
        return api.get('/api/jobs', { params: { ...params, customerId: user?.userId } });
    },

    getAll: async (params) => {
        return api.get('/api/jobs', { params });
    },

    getById: async (id) => {
        return api.get(`/api/jobs/${id}`);
    },

    update: (id, data) => api.put(`/api/jobs/${id}`, data),
    deleteJob: (id) => api.delete(`/api/jobs/${id}`),
    start: (id) => api.put(`/api/jobs/${id}/start`),
    complete: (id) => api.put(`/api/jobs/${id}/complete`),
    confirm: async (id) => api.post(`/api/jobs/${id}/confirm`),
    dispute: async (id, data) => api.post(`/api/jobs/${id}/dispute`, data),
};

export const applicationsAPI = {
    apply: async (jobId, data) => {
        if (USE_MOCK_API) {
            await mockDelay();
            const newApp = {
                id: 'app-' + Date.now(),
                jobId,
                providerId: storage.get('user')?.id,
                ...data,
                status: 'PENDING',
                createdAt: new Date().toISOString(),
            };
            MOCK_APPLICATIONS.push(newApp);
            return { application: newApp };
        }
        return api.post(`/jobs/${jobId}/apply`, data);
    },

    getByJob: async (jobId) => {
        if (USE_MOCK_API) {
            await mockDelay();
            const applications = MOCK_APPLICATIONS.filter(a => a.jobId === jobId);
            return { applications };
        }
        return api.get(`/jobs/${jobId}/applications`);
    },

    accept: (jobId, providerId) => api.post(`/jobs/${jobId}/accept/${providerId}`),

    getMyApplications: async (params) => {
        if (USE_MOCK_API) {
            await mockDelay();
            const userId = storage.get('user')?.id;
            const applications = MOCK_APPLICATIONS.filter(a => a.providerId === userId);
            return { applications };
        }
        return api.get('/applications/my-applications', { params });
    },
};

export const providersAPI = {
    getAll: async (params) => {
        if (USE_MOCK_API) {
            await mockDelay();
            // MOCK_USERS is an object, convert to array for filtering
            const providers = Object.values(MOCK_USERS).filter(
                u => u.role === 'provider' || u.role === 'hybrid'
            );
            return { providers, total: providers.length };
        }
        return api.get('/providers', { params });
    },

    getById: async (id) => {
        if (USE_MOCK_API) {
            await mockDelay();
            // MOCK_USERS is an object (hash map by id)
            const provider = MOCK_USERS[id];
            
            if (!provider) throw new Error('Provider not found');
            return { provider };
        }
        return api.get(`/providers/${id}`);
    },

    updateProfile: (data) => api.put('/users/me/profile', data),
};

export const notificationsAPI = {
    getAll: async (params) => {
        if (USE_MOCK_API) {
            await mockDelay();
            const userId = storage.get('user')?.id;
            const notifications = MOCK_NOTIFICATIONS.filter(n => n.userId === userId);
            const unreadCount = notifications.filter(n => !n.isRead).length;
            return { notifications, unreadCount };
        }
        return api.get('/notifications', { params });
    },

    markAsRead: async (id) => {
        if (USE_MOCK_API) {
            await mockDelay();
            const notif = MOCK_NOTIFICATIONS.find(n => n.id === id);
            if (notif) notif.isRead = true;
            return { success: true };
        }
        return api.put(`/notifications/${id}/read`);
    },

    markAllAsRead: async () => {
        if (USE_MOCK_API) {
            await mockDelay();
            const userId = storage.get('user')?.id;
            MOCK_NOTIFICATIONS.forEach(n => {
                if (n.userId === userId) n.isRead = true;
            });
            return { success: true };
        }
        return api.put('/notifications/read-all');
    },
};

export const adminAPI = {
    getDisputes: (params) => api.get('/admin/disputes', { params }),
    getDisputeById: (id) => api.get(`/admin/disputes/${id}`),
    resolveDispute: (id, data) => api.post(`/admin/disputes/${id}/resolve`, data),
    getDashboardStats: () => api.get('/admin/dashboard/stats'),
};

export const transactionsAPI = {
    getAll: (params) => api.get('/transactions', { params }),
    getById: (id) => api.get(`/transactions/${id}`),
};

export const userAPI = {
    getProfile: () => api.get('/users/me/profile'),
    updateProfile: (data) => api.put('/users/me/profile', data),
    changePassword: (data) => api.put('/users/me/password', data),
};

export default api;
