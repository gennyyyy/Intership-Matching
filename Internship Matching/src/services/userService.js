import api from './api';

export const userService = {
    async getMyProfile() {
        const response = await api.get('/users/me');
        return response.data;
    },

    async updateMyProfile(profileData) {
        const response = await api.put('/users/me', profileData);
        return response.data;
    }
};

export default userService;
