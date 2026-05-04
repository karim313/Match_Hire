import api from './api';

export const jobService = {
  getAllJobs: async () => {
    const response = await api.get('/Jobs');
    return response.data;
  },
  scrapeJobs: async (keyword: string) => {
    const response = await api.get(`/Jobs/scrape`, {
      params: { keyword }
    });
    return response.data;
  }
};
