import api from './api';

export const providerService = {

    registerProvider: (providerData) =>
        api.post('/providers/register', providerData),

    registerProviderWithDocuments: (formData) =>
        api.post('/providers/register', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    getProviders: (params) =>
        api.get('/providers', { params }),

    getProviderById: (id) =>
        api.get(`/providers/${id}`),

    getMyProviderProfile: () =>
        api.get('/providers/my-profile'),

    updateProviderProfile: (profileData) =>
        api.put('/providers/profile', profileData),

    updateProviderProfileWithFiles: (formData) =>
        api.put('/providers/profile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    getProviderJobs: (providerId, params) =>
        api.get(`/providers/${providerId}/jobs`, { params }),

    getProviderReviews: (providerId, params) =>
        api.get(`/providers/${providerId}/reviews`, { params }),

    getProviderStats: (providerId) =>
        api.get(`/providers/${providerId}/stats`),

    getProviderPortfolio: (providerId) =>
        api.get(`/providers/${providerId}/portfolio`),

    addPortfolioItem: (formData) =>
        api.post('/providers/portfolio', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    updatePortfolioItem: (itemId, formData) =>
        api.put(`/providers/portfolio/${itemId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    deletePortfolioItem: (itemId) =>
        api.delete(`/providers/portfolio/${itemId}`),


    requestVerification: (verificationData) =>
        api.post('/providers/verify', verificationData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),


    getProviderCertifications: (providerId) =>
        api.get(`/providers/${providerId}/certifications`),


    addCertification: (certificationData) =>
        api.post('/providers/certifications', certificationData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    deleteCertification: (certificationId) =>
        api.delete(`/providers/certifications/${certificationId}`),

    getFeaturedProviders: (params) =>
        api.get('/providers/featured', { params }),


    searchProvidersBySkills: (skills, params) =>
        api.get('/providers/search', {
            params: { skills: skills.join(','), ...params }
        }),

    getNearbyProviders: (params) =>
        api.get('/providers/nearby', { params }),

    followProvider: (providerId) =>
        api.post(`/providers/${providerId}/follow`),

    unfollowProvider: (providerId) =>
        api.delete(`/providers/${providerId}/follow`),

    getProviderFollowers: (providerId) =>
        api.get(`/providers/${providerId}/followers`),

    reportProvider: (providerId, reportData) =>
        api.post(`/providers/${providerId}/report`, reportData),
};

export default providerService;