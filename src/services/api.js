import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Doctors API
export const doctorsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/doctors', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  getBySpecialty: async (specialty) => {
    const response = await api.get(`/doctors/specialty/${specialty}`);
    return response.data;
  },

  getAvailableSlots: async (doctorId, date) => {
    const response = await api.get(`/doctors/${doctorId}/available-slots`, {
      params: { date }
    });
    return response.data;
  },

  register: async (doctorData) => {
    const response = await api.post('/doctors/register', doctorData);
    return response.data;
  }
};

// Appointments API
export const appointmentsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  create: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  update: async (id, appointmentData) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  cancel: async (id, reason) => {
    const response = await api.put(`/appointments/${id}/cancel`, { reason });
    return response.data;
  },

  reschedule: async (id, newDateTime) => {
    const response = await api.put(`/appointments/${id}/reschedule`, { newDateTime });
    return response.data;
  }
};

// Medical Reports API
export const medicalReportsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/medical-reports', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/medical-reports/${id}`);
    return response.data;
  },

  upload: async (formData) => {
    const response = await api.post('/medical-reports/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/medical-reports/${id}`);
    return response.data;
  }
};

// Prescriptions API
export const prescriptionsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/prescriptions', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/prescriptions/${id}`);
    return response.data;
  },

  create: async (prescriptionData) => {
    const response = await api.post('/prescriptions', prescriptionData);
    return response.data;
  }
};

// AI Services API
export const aiAPI = {
  analyzeSymptoms: async (symptoms) => {
    const response = await api.post('/ai/analyze-symptoms', { symptoms });
    return response.data;
  },

  chatbot: async (message) => {
    const response = await api.post('/ai/chatbot', { message });
    return response.data;
  }
};

// Admin API
export const adminAPI = {
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getAllDoctors: async (params = {}) => {
    const response = await api.get('/admin/doctors', { params });
    return response.data;
  },

  getSystemHealth: async () => {
    const response = await api.get('/admin/system-health');
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await api.put(`/admin/users/${userId}/status`, { status });
    return response.data;
  }
};

// Health API
export const healthAPI = {
  check: async () => {
    const response = await api.get('/actuator/health');
    return response.data;
  },

  test: async () => {
    const response = await api.get('/test');
    return response.data;
  }
};

export default api;
