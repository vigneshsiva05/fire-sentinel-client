import api from './api';

export const hotspotService = {
  async getHotspots(params = {}) {
    return await api.get('/hotspots', { params });
  },

  async getHotspotById(id) {
    return await api.get(`/hotspots/${id}`);
  },

  async createHotspot(hotspotData) {
    return await api.post('/hotspots', hotspotData);
  },

  async deleteHotspot(id) {
    return await api.delete(`/hotspots/${id}`);
  }
};
