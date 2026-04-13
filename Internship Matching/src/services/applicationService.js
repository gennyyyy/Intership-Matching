import api from './api';

export const applicationService = {
    // Submit an application (Student only)
    async apply(internshipId, coverLetter) {
        const response = await api.post('/applications', {
            internship_id: internshipId,
            cover_letter: coverLetter
        });
        return response.data;
    },

    // Get applications (Student: their own, Employer: their listings)
    async getApplications() {
        const response = await api.get('/applications');
        return response.data;
    },

    // Get single application
    async getApplication(id) {
        const response = await api.get(`/applications/${id}`);
        return response.data;
    },

    // Get applicants for a specific internship (Employer only)
    async getInternshipApplicants(internshipId) {
        const response = await api.get(`/applications/internship/${internshipId}/applicants`);
        return response.data;
    },

    // Update application status (Employer: accept/reject, Student: withdraw)
    async updateStatus(id, status) {
        const response = await api.put(`/applications/${id}/status`, { status });
        return response.data;
    }
};

export default applicationService;
