import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
const api: AxiosInstance = axios.create({
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
  (response: AxiosResponse) => {
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

// API Types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  role: {
    id: number;
    name: string;
  };
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface Doctor {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  specialty: string;
  subSpecialty?: string;
  licenseNumber: string;
  qualification: string;
  yearsOfExperience: number;
  biography?: string;
  hospitalAffiliation?: string;
  consultationFee: number;
  consultationType: string;
  isAvailable: boolean;
  averageRating?: number;
  totalReviews?: number;
  morningStartTime?: string;
  morningEndTime?: string;
  eveningStartTime?: string;
  eveningEndTime?: string;
  slotDurationMinutes?: number;
  clinicAddress?: string;
}

export interface Appointment {
  id: number;
  patient: User;
  doctor: Doctor;
  appointmentDateTime: string;
  endDateTime: string;
  appointmentType: string;
  status: string;
  durationMinutes: number;
  consultationFee: number;
  chiefComplaint?: string;
  symptoms?: string;
  doctorNotes?: string;
  prescriptionNotes?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  type: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
}

export interface AppointmentRequest {
  doctorId: number;
  appointmentDateTime: string;
  appointmentType: string;
  durationMinutes: number;
  chiefComplaint?: string;
  symptoms?: string;
}

// Auth API
export const authAPI = {
  login: (data: LoginRequest): Promise<AxiosResponse<LoginResponse>> =>
    api.post('/auth/login', data),
  
  signup: (data: SignupRequest): Promise<AxiosResponse<{ message: string }>> =>
    api.post('/auth/signup', data),
  
  getCurrentUser: (): Promise<AxiosResponse<User>> =>
    api.get('/auth/me'),
  
  logout: (): Promise<AxiosResponse<{ message: string }>> =>
    api.post('/auth/logout'),
};

// User API
export const userAPI = {
  getAllUsers: (params?: any): Promise<AxiosResponse<PagedResponse<User>>> =>
    api.get('/users', { params }),

  getUserById: (id: number): Promise<AxiosResponse<User>> =>
    api.get(`/users/${id}`),

  createUser: (data: any): Promise<AxiosResponse<User>> =>
    api.post('/users', data),

  updateUser: (id: number, data: any): Promise<AxiosResponse<User>> =>
    api.put(`/users/${id}`, data),

  deleteUser: (id: number): Promise<AxiosResponse<{ message: string }>> =>
    api.delete(`/users/${id}`),
};

// Paginated Response Interface
export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Doctor API
export const doctorAPI = {
  getAllDoctors: (params?: any): Promise<AxiosResponse<PagedResponse<Doctor>>> =>
    api.get('/doctors', { params }),

  getDoctorById: (id: number): Promise<AxiosResponse<Doctor>> =>
    api.get(`/doctors/${id}`),

  searchDoctors: (params: any): Promise<AxiosResponse<PagedResponse<Doctor>>> =>
    api.get('/doctors/search', { params }),

  getDoctorsBySpecialty: (specialty: string): Promise<AxiosResponse<PagedResponse<Doctor>>> =>
    api.get(`/doctors/specialty/${specialty}`),
  
  getDoctorAvailability: (doctorId: number, date: string): Promise<AxiosResponse<string[]>> =>
    api.get(`/doctors/${doctorId}/availability`, { params: { date } }),
};

// Appointment API
export const appointmentAPI = {
  createAppointment: (data: AppointmentRequest): Promise<AxiosResponse<Appointment>> =>
    api.post('/appointments/book', data),
  
  getMyAppointments: (params?: any): Promise<AxiosResponse<Appointment[]>> =>
    api.get('/appointments/my-appointments', { params }),
  
  getAppointmentById: (id: number): Promise<AxiosResponse<Appointment>> =>
    api.get(`/appointments/${id}`),
  
  updateAppointment: (id: number, data: Partial<Appointment>): Promise<AxiosResponse<Appointment>> =>
    api.put(`/appointments/${id}`, data),
  
  cancelAppointment: (id: number, reason?: string): Promise<AxiosResponse<{ message: string }>> =>
    api.put(`/appointments/${id}/cancel`, { reason }),
  
  rescheduleAppointment: (id: number, newDateTime: string): Promise<AxiosResponse<Appointment>> =>
    api.put(`/appointments/${id}/reschedule`, { newDateTime }),
};

// ML API
export const mlAPI = {
  predictSpecialty: (data: { symptoms: string; age?: number; gender?: string }): Promise<AxiosResponse<any>> =>
    api.post('/ml/predict-specialty', data),
  
  getSpecialties: (): Promise<AxiosResponse<string[]>> =>
    api.get('/ml/specialties'),
};

// Chatbot API
export const chatbotAPI = {
  sendMessage: (data: { message: string; context?: any }): Promise<AxiosResponse<any>> =>
    api.post('/chatbot/chat', data),
  
  getIntents: (): Promise<AxiosResponse<any>> =>
    api.get('/chatbot/intents'),
};

// Smart Features API
export const smartFeaturesAPI = {
  explainCondition: (conditionName: string): Promise<AxiosResponse<any>> =>
    api.get(`/smart-features/conditions/${conditionName}`),
  
  searchConditions: (query: string): Promise<AxiosResponse<any>> =>
    api.get('/smart-features/conditions/search', { params: { query } }),
  
  getHealthTips: (): Promise<AxiosResponse<any>> =>
    api.get('/smart-features/health-tips'),
  
  getWellnessScore: (): Promise<AxiosResponse<any>> =>
    api.get('/smart-features/wellness-score'),
  
  getEmergencyContacts: (): Promise<AxiosResponse<any>> =>
    api.get('/smart-features/emergency-contacts'),
};

export default api;
