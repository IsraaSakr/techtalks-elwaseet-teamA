import api from './api';

export const userService = {
    getProfile: () =>
        api.get('/user/profile'),

    updateProfile: (profileData) =>
        api.put('/user/profile', profileData),

    updateProfileWithImage: (formData) =>
        api.put('/user/profile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    uploadProfilePicture: (imageFile) => {
        const formData = new FormData();
        formData.append('profilePicture', imageFile);
        return api.post('/user/profile-picture', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    getUserById: (userId) =>
        api.get(`/user/${userId}`),

    deleteAccount: (password) =>
        api.delete('/user/account', { data: { password } }),

    getSettings: () =>
        api.get('/user/settings'),

    updateSettings: (settings) =>
        api.put('/user/settings', settings),


    getStats: () =>
        api.get('/user/stats'),

    getActivityHistory: (params) =>
        api.get('/user/activity', { params }),

    getNotifications: (params) =>
        api.get('/user/notifications', { params }),

    markNotificationRead: (notificationId) =>
        api.put(`/user/notifications/${notificationId}/read`),

    markAllNotificationsRead: () =>
        api.put('/user/notifications/read-all'),

    deleteNotification: (notificationId) =>
        api.delete(`/user/notifications/${notificationId}`),

    getSavedJobs: (params) =>
        api.get('/user/saved-jobs', { params }),

    saveJob: (jobId) =>
        api.post('/user/saved-jobs', { jobId }),


    unsaveJob: (jobId) =>
        api.delete(`/user/saved-jobs/${jobId}`),
};

export default userService;