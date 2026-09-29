import api from './api';

export const uploadService = {
  async uploadFile(file, onUploadProgress) {
    const formData = new FormData();
    formData.append('dataset', file);

    return await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },

  async ingestFromUrl(url) {
    return await api.post('/upload/url', { url });
  },

  async fetchNasaFirms(params = {}) {
    return await api.post('/upload/nasa-firms', params);
  },

  async getFirmsSources() {
    return await api.get('/upload/firms-sources');
  },

  async loadDemoDataset(datasetType = 'mixed') {
    return await api.post('/upload/demo', { datasetType });
  },

  async resetData() {
    return await api.post('/upload/reset');
  },

  async getUploadBatches() {
    return await api.get('/upload/batches');
  }
};

