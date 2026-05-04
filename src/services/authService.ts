import api from './api';

export const authService = {
  login: async (credentials: any) => {
    const response = await api.post('/Auth/login', credentials);
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/Auth/register', userData);
    return response.data;
  }
};
