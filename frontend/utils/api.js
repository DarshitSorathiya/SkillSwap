import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Hardcoded for now to ensure it works
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Log the request (helpful for debugging)
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    
    // Add auth token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error - Backend server might be down');
      throw new Error('Unable to connect to the server. Please check if the backend server is running.');
    }

    if (!error.response) {
      throw error;
    }

    // Handle 401 - Unauthorized
    if (error.response.status === 401) {
      // Clear auth tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

// Test connection function
export const testBackendConnection = async () => {
  try {
    const response = await api.get('/test');
    console.log('Backend connection test:', response.data);
    return true;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return false;
  }
};

// Auth endpoints
export const auth = {
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    const { accessToken, refreshToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return response.data;
  },
  
  register: async (formData) => {
    const response = await api.post('/users/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const { accessToken, refreshToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return response.data;
  },
  
  logout: async () => {
    try {
      await api.post('/users/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
};

export default api;
