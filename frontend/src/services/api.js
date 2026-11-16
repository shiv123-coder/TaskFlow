import axios from 'axios';

let apiBaseURL = import.meta.env.VITE_API_URL || '/api';
if (apiBaseURL.startsWith('http') && !apiBaseURL.endsWith('/api')) {
  apiBaseURL = `${apiBaseURL.replace(/\/+$/, '')}/api`;
}

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('task_manager_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for session expiration handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('task_manager_token');
      localStorage.removeItem('task_manager_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

