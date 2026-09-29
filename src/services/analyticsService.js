import api from './api';

export const analyticsService = {
  async getKPIs() {
    return await api.get('/analytics/kpis');
  },

  async getCategories() {
    return await api.get('/analytics/categories');
  },

  async getRiskLevels() {
    return await api.get('/analytics/risk-levels');
  },

  async getFRPTimeline() {
    return await api.get('/analytics/frp-timeline');
  },

  async getRegions() {
    return await api.get('/analytics/regions');
  },

  async getHistoricalEvents(params = {}) {
    return await api.get('/historical', { params });
  }
};
