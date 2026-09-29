import api from './api';

export const settingsService = {
  async getSettings() {
    return await api.get('/settings');
  },

  async updateSettings(settingsData) {
    return await api.put('/settings', settingsData);
  }
};
