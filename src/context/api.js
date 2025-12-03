import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ====== AXIOS INSTANCE ======
const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ====== REQUEST INTERCEPTOR ======
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ====== RESPONSE INTERCEPTOR ======
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // Extract error message
      const errorMessage = data?.error || data?.message || 'An error occurred';
      
      // Handle 401 - Unauthorized
      if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      // Attach formatted error message
      error.message = errorMessage;
    } else {
      // Network error
      error.message = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

// ====== AUTH ENDPOINTS ======
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (updates) => api.put('/auth/profile', updates),
  changePassword: (passwords) => api.put('/auth/change-password', passwords),
  
  // Admin only
  getAllUsers: (params) => api.get('/auth/users', { params }),
  updateUserRole: (userId, role) => api.put(`/auth/users/${userId}/role`, { role }),
  toggleUserStatus: (userId) => api.put(`/auth/users/${userId}/toggle-status`),
};

// ====== VIDEO ENDPOINTS ======
export const videoAPI = {
  // Upload video with FormData
  upload: (formData, onUploadProgress) => 
    api.post('/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),
  
  // Get all videos with filters
  getAll: (params) => api.get('/videos', { params }),
  
  // Get single video
  getById: (id) => api.get(`/videos/${id}`),
  
  // Update video
  update: (id, data) => api.put(`/videos/${id}`, data),
  
  // Delete video
  delete: (id) => api.delete(`/videos/${id}`),
  
  // Get statistics
  getStats: () => api.get('/videos/stats'),
  
  // Get video frames
  getFrames: (id) => api.get(`/videos/${id}/frames`),
  
  // Get stream URL (doesn't use axios, just returns URL)
  getStreamUrl: (id) => {
    const token = localStorage.getItem('token');
    return `${API_BASE}/api/videos/${id}/stream?token=${token}`;
  },
};

// ====== HELPER FUNCTIONS ======
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const clearAuth = () => {
  localStorage.removeItem('token');
};

export default api;
