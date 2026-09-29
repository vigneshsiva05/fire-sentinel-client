import api from './api';

export const clusterService = {
  async getClusters(params = {}) {
    return await api.get('/clusters', { params });
  },

  async getClusterById(id) {
    return await api.get(`/clusters/${id}`);
  },

  async getClusterHotspots(id) {
    return await api.get(`/clusters/${id}/hotspots`);
  },

  async updateClusterStatus(id, status) {
    return await api.patch(`/clusters/${id}/status`, { status });
  }
};
