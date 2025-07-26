import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authAPI, LoginRequest, SignupRequest } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (userData: SignupRequest) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app start
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser && storedUser !== 'undefined') {
          try {
            const userData = JSON.parse(storedUser);
            setToken(storedToken);
            setUser(userData);

            // Verify token in background (don't block UI)
            setTimeout(async () => {
              try {
                const response = await authAPI.getCurrentUser();
                setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
              } catch (error) {
                console.warn('Token validation failed:', error);
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                setToken(null);
                setUser(null);
              }
            }, 100);
          } catch (error) {
            console.warn('Error parsing stored user data:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(credentials);
      const { accessToken, id, email, firstName, lastName, role } = response.data;

      // Create user object from response fields
      const userData: User = {
        id,
        email,
        firstName,
        lastName,
        role: {
          id: 1, // Default role ID, will be updated from profile if needed
          name: role
        },
        phoneNumber: undefined,
        dateOfBirth: undefined,
        gender: undefined,
        address: undefined,
        isActive: true,
        emailVerified: true,
        createdAt: new Date().toISOString()
      };

      setToken(accessToken);
      setUser(userData);

      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupRequest) => {
    try {
      setIsLoading(true);
      await authAPI.signup(userData);
      // After successful signup, user needs to login
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Call logout API (optional, for server-side cleanup)
    authAPI.logout().catch(() => {
      // Ignore errors on logout
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    signup,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
