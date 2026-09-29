import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.token) {
      localStorage.setItem('ignis_token', response.token);
      localStorage.setItem('ignis_user', JSON.stringify(response.user));
    }
    return response;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.token) {
      localStorage.setItem('ignis_token', response.token);
      localStorage.setItem('ignis_user', JSON.stringify(response.user));
    }
    return response;
  },

  async getProfile() {
    return await api.get('/auth/profile');
  },

  async updateProfile(data) {
    return await api.put('/auth/profile', data);
  },

  logout() {
    localStorage.removeItem('ignis_token');
    localStorage.removeItem('ignis_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('ignis_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};
