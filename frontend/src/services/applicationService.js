import api from './api';

export const applicationService = {
    createApplication: (applicationData) =>
        api.post('/applications', applicationData),

    createApplicationWithFiles: (formData) =>
        api.post('/applications', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    getApplications: (params) =>
        api.get('/applications', { params }),

    getMyApplications: (params) =>
        api.get('/applications/my-applications', { params }),

    getReceivedApplications: (params) =>
        api.get('/applications/received', { params }),

    getApplicationById: (id) =>
        api.get(`/applications/${id}`),

    getApplicationsByJob: (jobId, params) =>
        api.get(`/applications/job/${jobId}`, { params }),

    updateApplicationStatus: (id, status) =>
        api.patch(`/applications/${id}/status`, { status }),

    acceptApplication: (id) =>
        api.patch(`/applications/${id}/accept`),

    rejectApplication: (id, reason = '') =>
        api.patch(`/applications/${id}/reject`, { reason }),

    withdrawApplication: (id) =>
        api.patch(`/applications/${id}/withdraw`),

    updateApplication: (id, updateData) =>
        api.put(`/applications/${id}`, updateData),


    deleteApplication: (id) =>
        api.delete(`/applications/${id}`),

    getApplicationStats: () =>
        api.get('/applications/stats'),

    sendApplicationMessage: (id, message) =>
        api.post(`/applications/${id}/message`, { message }),

    getApplicationMessages: (id) =>
        api.get(`/applications/${id}/messages`),


    scheduleInterview: (id, interviewData) =>
        api.post(`/applications/${id}/interview`, interviewData),

    shortlistApplication: (id) =>
        api.patch(`/applications/${id}/shortlist`),

    unshortlistApplication: (id) =>
        api.patch(`/applications/${id}/unshortlist`),
};

export default applicationService;