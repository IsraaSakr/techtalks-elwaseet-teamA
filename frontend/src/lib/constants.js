// Application Constants

// User Roles
export const USER_ROLES = {
    CUSTOMER: 'CUSTOMER',
    HYBRID: 'HYBRID_PROVIDER',
    ADMIN: 'ADMIN',
};

// Job Statuses
export const JOB_STATUS = {
    OPEN: 'OPEN',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CONFIRMED: 'CONFIRMED',
    DISPUTED: 'DISPUTED',
};

// Application Statuses
export const APPLICATION_STATUS = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
};

// Transaction/Escrow Statuses
export const TRANSACTION_STATUS = {
    HELD: 'HELD',
    RELEASED: 'RELEASED',
    REFUNDED: 'REFUNDED',
    SPLIT: 'SPLIT',
    DISPUTED: 'DISPUTED',
};

// Dispute Statuses
export const DISPUTE_STATUS = {
    PENDING: 'PENDING',
    UNDER_REVIEW: 'UNDER_REVIEW',
    RESOLVED: 'RESOLVED',
    CLOSED: 'CLOSED',
};

// Dispute Decisions
export const DISPUTE_DECISION = {
    RELEASE: 'RELEASE',
    REFUND: 'REFUND',
    SPLIT: 'SPLIT',
    FIX: 'FIX',
};

// Notification Types
export const NOTIFICATION_TYPE = {
    APPLICATION_ACCEPTED: 'APPLICATION_ACCEPTED',
    NEW_JOB: 'NEW_JOB',
    PAYMENT_RELEASED: 'PAYMENT_RELEASED',
    DISPUTE_OPENED: 'DISPUTE_OPENED',
    JOB_STARTED: 'JOB_STARTED',
    JOB_COMPLETED: 'JOB_COMPLETED',
    APPLICATION_RECEIVED: 'APPLICATION_RECEIVED',
};

// Service Categories
export const SERVICE_CATEGORIES = [
    'Plumbing',
    'Electrical',
    'Cleaning',
    'Tutoring',
    'Carpentry',
    'Painting',
    'Landscaping',
    'Moving',
    'Handyman',
    'HVAC',
    'Other',
];

// Validation Rules
export const VALIDATION = {
    PASSWORD_MIN_LENGTH: 8,
    JOB_TITLE_MAX_LENGTH: 100,
    JOB_DESCRIPTION_MAX_LENGTH: 1000,
    PROVIDER_MESSAGE_MAX_LENGTH: 500,
    MAX_JOB_PHOTOS: 5,
    MAX_PORTFOLIO_PHOTOS: 10,
    MAX_FILE_SIZE_MB: 5,
    ALLOWED_IMAGE_TYPES: ['.jpeg', '.jpg', '.png', '.webp'],
    OTP_RESEND_COOLDOWN: 60, // seconds
};

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
};

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    VERIFY_OTP: '/auth/verify-otp',
    LOGOUT: '/auth/logout',

    // Jobs
    JOBS: '/jobs',
    MY_JOBS: '/jobs/my-jobs',
    JOB_DETAIL: (id) => `/jobs/${id}`,
    JOB_APPLICATIONS: (id) => `/jobs/${id}/applications`,
    ACCEPT_APPLICATION: (jobId, providerId) => `/jobs/${jobId}/accept/${providerId}`,
    START_JOB: (id) => `/jobs/${id}/start`,
    COMPLETE_JOB: (id) => `/jobs/${id}/complete`,
    CONFIRM_JOB: (id) => `/jobs/${id}/confirm`,
    DISPUTE_JOB: (id) => `/jobs/${id}/dispute`,
    APPLY_TO_JOB: (id) => `/jobs/${id}/apply`, 

    // Providers
    PROVIDERS: '/providers',
    PROVIDER_DETAIL: (id) => `/providers/${id}`,

    // User Profile
    MY_PROFILE: '/users/me/profile',

    // Notifications
    NOTIFICATIONS: '/notifications',
    MARK_NOTIFICATION_READ: (id) => `/notifications/${id}/read`,

    // Admin
    ADMIN_DISPUTES: '/admin/disputes',
    RESOLVE_DISPUTE: (id) => `/admin/disputes/${id}/resolve`,

    // Transactions
    TRANSACTIONS: '/transactions',
};

// Status Badge Colors
export const STATUS_COLORS = {
    [JOB_STATUS.OPEN]: 'bg-blue-100 text-blue-800',
    [JOB_STATUS.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
    [JOB_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
    [JOB_STATUS.CONFIRMED]: 'bg-emerald-100 text-emerald-800',
    [JOB_STATUS.DISPUTED]: 'bg-red-100 text-red-800',

    [APPLICATION_STATUS.PENDING]: 'bg-gray-100 text-gray-800',
    [APPLICATION_STATUS.ACCEPTED]: 'bg-green-100 text-green-800',
    [APPLICATION_STATUS.REJECTED]: 'bg-red-100 text-red-800',
};

// Routes
export const ROUTES = {
    // Public
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    VERIFY_EMAIL: '/verify-email',

    // Customer
    CUSTOMER_DASHBOARD: '/customer/dashboard',
    POST_JOB: '/customer/post-job',
    CUSTOMER_JOB_DETAILS: (id) => `/customer/jobs/${id}`,
    CUSTOMER_JOB_DISPUTE: (id) => `/customer/jobs/${id}/dispute`,
    CUSTOMER_RATE_PROVIDER: (id) => `/customer/jobs/${id}/rate`,
    JOB_APPLICATIONS_VIEW: (id) => `/customer/jobs/${id}/applications`,
    BROWSE_PROVIDERS: '/customer/browse-providers',
    PROVIDER_PROFILE: (id) => `/customer/providers/${id}`,

    // Provider
    PROVIDER_DASHBOARD: '/provider/dashboard',
    BROWSE_JOBS: '/provider/browse-jobs',
    PROVIDER_JOB_DETAILS: (id) => `/provider/jobs/${id}`,
    MY_APPLICATIONS: '/provider/applications',
    EDIT_PROFILE: '/provider/profile/edit',

    // Admin
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_USERS: '/admin/users',
    ADMIN_JOBS: '/admin/jobs',
    ADMIN_JOB_DETAILS: (id) => `/admin/jobs/${id}`,
    ADMIN_REVENUE: '/admin/revenue',
    ADMIN_DISPUTES: '/admin/disputes',
    ADMIN_DISPUTE_DETAILS: (id) => `/admin/disputes/${id}`,
    ADMIN_USER_DETAILS: (id) => `/admin/users/${id}`,

    // Shared
    BROWSE_JOBS: '/browse-jobs',
    BROWSE_JOB_DETAILS: (id) => `/browse-jobs/${id}`,
    PROFILE: '/profile',
    NOTIFICATIONS: '/notifications',
    TRANSACTIONS: '/transactions',
    SETTINGS: '/settings',
    
};
