import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const api = axios.create({
  baseURL: '/api/proxy',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to add Authorization Token
api.interceptors.request.use(
  async (config) => {
    // Only fetch session on the client side
    if (typeof window !== 'undefined') {
      try {
        const session = await getSession();
        const token = (session as any)?.user?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Request interceptor session error:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if it's a 401 Unauthorized
    if (error.response?.status === 401) {
      console.warn('Unauthorized request - session may have expired');
      // We could trigger a redirect here, but let the components handle it
      // or use a more controlled way to sign out.
    }
    
    // Ensure we reject with a proper error object
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    const enhancedError = new Error(errorMessage);
    (enhancedError as any).response = error.response;
    (enhancedError as any).status = error.response?.status;
    
    return Promise.reject(enhancedError);
  }
);

export default api;
