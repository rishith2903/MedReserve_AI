import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { api } from '../services/api';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    }))
  }
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock window.location
const mockLocation = {
  href: ''
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

describe('API Service', () => {
  let mockAxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAxiosInstance = {
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };
    axios.create.mockReturnValue(mockAxiosInstance);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should create axios instance with correct base URL', () => {
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  });

  it('should add authorization header when token exists', () => {
    localStorageMock.getItem.mockReturnValue('mock-token');
    
    // Simulate request interceptor
    const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
    const config = { headers: {} };
    
    const result = requestInterceptor(config);
    
    expect(result.headers.Authorization).toBe('Bearer mock-token');
  });

  it('should not add authorization header when token does not exist', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
    const config = { headers: {} };
    
    const result = requestInterceptor(config);
    
    expect(result.headers.Authorization).toBeUndefined();
  });

  it('should handle successful responses', () => {
    const responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][0];
    const response = { data: 'test data' };
    
    const result = responseInterceptor(response);
    
    expect(result).toBe(response);
  });

  it('should handle 401 errors by clearing storage and redirecting', () => {
    const errorHandler = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
    const error = {
      response: { status: 401 }
    };
    
    errorHandler(error);
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('authToken');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
    expect(mockLocation.href).toBe('/login');
  });

  it('should handle 403 errors with proper logging', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const errorHandler = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
    const error = {
      response: { 
        status: 403,
        data: 'Forbidden'
      }
    };
    
    errorHandler(error);
    
    expect(consoleSpy).toHaveBeenCalledWith('403 Forbidden - insufficient permissions:', 'Forbidden');
    
    consoleSpy.mockRestore();
  });

  it('should handle network errors', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const errorHandler = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
    const error = {
      response: { status: 0 },
      message: 'Network Error'
    };
    
    errorHandler(error);
    
    expect(consoleSpy).toHaveBeenCalledWith('Network error - check your connection');
    
    consoleSpy.mockRestore();
  });

  it('should handle CORS errors', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const errorHandler = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
    const error = {
      message: 'CORS error detected'
    };
    
    errorHandler(error);
    
    expect(consoleSpy).toHaveBeenCalledWith('CORS error - check server configuration');
    
    consoleSpy.mockRestore();
  });

  it('should handle timeout errors', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const errorHandler = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
    const error = {
      code: 'ECONNABORTED',
      message: 'timeout of 10000ms exceeded'
    };
    
    errorHandler(error);
    
    expect(consoleSpy).toHaveBeenCalledWith('Request timeout - server may be slow');
    
    consoleSpy.mockRestore();
  });

  it('should log request details when token is present', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    localStorageMock.getItem.mockReturnValue('mock-token-12345');
    
    const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
    const config = { 
      headers: {},
      url: '/test-endpoint'
    };
    
    requestInterceptor(config);
    
    expect(consoleSpy).toHaveBeenCalledWith('🔐 API Request to /test-endpoint with token:', 'mock-token-12345...');
    
    consoleSpy.mockRestore();
  });

  it('should log request details when token is not present', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    localStorageMock.getItem.mockReturnValue(null);
    
    const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
    const config = { 
      headers: {},
      url: '/test-endpoint'
    };
    
    requestInterceptor(config);
    
    expect(consoleSpy).toHaveBeenCalledWith('🚫 API Request to /test-endpoint without token');
    
    consoleSpy.mockRestore();
  });
});
