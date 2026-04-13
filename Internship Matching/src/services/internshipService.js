import api from './api';

export const internshipService = {
    // Get all internships with optional filters
    async getInternships(params = {}) {
        const response = await api.get('/internships', { params });
        return response.data;
    },

    // Get a single internship
    async getInternship(id) {
        const response = await api.get(`/internships/${id}`);
        return response.data;
    },

    // Create new internship (Employer only)
    async createInternship(internshipData) {
        const response = await api.post('/internships', internshipData);
        return response.data;
    },

    // Update internship (Employer only)
    async updateInternship(id, updateData) {
        const response = await api.put(`/internships/${id}`, updateData);
        return response.data;
    },

    // Delete internship (Employer only)
    async deleteInternship(id) {
        await api.delete(`/internships/${id}`);
    },

    // Get current employer's own postings
    async getMyPostings() {
        const response = await api.get('/internships/employer/my-postings');
        return response.data;
    }
};

export default internshipService;
