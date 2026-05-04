import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api(config);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    
    // Robust Error Handling
    if (axiosError.response) {
      // Server responded with a status code outside of 2xx range
      console.error('API Error:', axiosError.response.data);
      throw new Error(
        (axiosError.response.data as any)?.message || 'An error occurred while fetching data'
      );
    } else if (axiosError.request) {
      // Request was made but no response was received
      console.error('Network Error:', axiosError.request);
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something else happened in setting up the request
      console.error('Error:', axiosError.message);
      throw new Error('An unexpected error occurred.');
    }
  }
};

export default apiRequest;
