import api from './api';

export const alertService = {
  async getAlerts(params = {}) {
    return await api.get('/alerts', { params });
  },

  async getAlertStats() {
    return await api.get('/alerts/stats');
  },

  async createAlert(alertData) {
    return await api.post('/alerts', alertData);
  },

  async updateAlertStatus(id, status) {
    return await api.patch(`/alerts/${id}`, { status });
  },

  async deleteAlert(id) {
    return await api.delete(`/alerts/${id}`);
  }
};
