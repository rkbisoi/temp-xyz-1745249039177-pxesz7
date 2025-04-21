import React, { createContext, useContext, useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { API_URL } from '../data';
import toast from 'react-hot-toast';

interface UserData {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  updateSeqNo: number;
  orgId: number;
  active: boolean;
  admin: boolean;
  isEnabled2FA: boolean;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; otpVerificationRequired: boolean; sessionId: string }>;
  forgotPassword: (email: string) => Promise<boolean>;
  verifyOTP: (email: string, otp: string, sessionId: string) => Promise<{ success: boolean }>;
  verifyForgotPasswordOTP: (email: string, otp: string, sessionId: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const encryptPassword = (password: string) => {
  const encryptedPassword = CryptoJS.SHA256(password).toString();
  return encryptedPassword;
};

const getSessionFromLocalStorage = () => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error retrieving session from localStorage', error);
    return null;
  }
};

const setSessionInLocalStorage = (userData: UserData) => {
  try {
    localStorage.setItem('user', JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving session to localStorage', error);
  }
};

const clearSessionFromLocalStorage = () => {
  try {
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error clearing session from localStorage', error);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const userData = getSessionFromLocalStorage();
    setUser(userData);
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    password = encryptPassword(password);
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // This is important for handling cookies
      });

      const data = await response.json();

      if (data.success) {
        const userData = data.data.userData;
        if (userData) {
          setUser(userData);
          setSessionInLocalStorage(userData);
          return {
            success: true,
            otpVerificationRequired: false,
            sessionId: ''
          };
        } else if (data.data.otpVerificationRequired) {
          return {
            success: true,
            otpVerificationRequired: data.data.otpVerificationRequired,
            sessionId: data.data.sessionId
          }
        } else {
          return {
            success: false,
            otpVerificationRequired: false,
            sessionId: ''
          }
        }

      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const forgotPassword = async (email: string) => {

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/forgot-password?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        return true
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error("Error Sending OTP : " + error)
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string, sessionId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/verify_otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, sessionId }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'OTP verification failed');
      }

      const data = await response.json();
      if (data.success) {
        setUser(data.data.userData);
        setSessionInLocalStorage(data.data.userData);
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const verifyForgotPasswordOTP = async (email: string, otp: string, newPassword: string) => {
    newPassword = encryptPassword(newPassword);
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/verify-otp-reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'OTP verification failed');
      }

      const data = await response.json();
      if (data.success) {
        return true;
      } else {
        return false
      };

    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Call logout endpoint to invalidate session
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      clearSessionFromLocalStorage(); // Remove session data from localStorage
      // Clear cookies
      document.cookie = 'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, verifyOTP, signOut, forgotPassword, verifyForgotPasswordOTP }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}