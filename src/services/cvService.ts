import api from './api';

export const cvService = {
  analyzeAndSuggestJobs: async (formData: FormData) => {
    const response = await api.post('/Cv/analyze-and-suggest-jobs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getMyCvs: async () => {
    const response = await api.get('/Cv/my-cvs');
    return response.data;
  },
  downloadCv: async (fileName: string) => {
    return await api.get(`/Cv/download/${fileName}`, {
      responseType: 'blob',
    });
  }
};
