'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const API_URL = 'http://localhost:8000/api';

/* =====================
   TYPES & INTERFACES
===================== */

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  email_verified_at?: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  phone: string;
}

interface LoginData {
  login: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (login: string, password: string) => Promise<any>;
  register: (userData: RegisterData) => Promise<any>;
  verifyOtp: (otp: string) => Promise<any>;
  resendOtp: () => Promise<any>;
  logout: () => Promise<void>;
}

/* =====================
   AUTH CONTEXT
===================== */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* =====================
   AUTH PROVIDER
===================== */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /* =====================
     INITIAL AUTH CHECK
  ===================== */
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const otpIdentifier = localStorage.getItem('otp_identifier');
  
    // ❗ Jangan auto-login kalau masih OTP flow
    if (token && !otpIdentifier) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('access_token');
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      localStorage.removeItem('access_token');
    }
  };

  /* =====================
     REGISTER (STATELESS OTP)
  ===================== */
  const register = async (userData: RegisterData): Promise<any> => {
    setLoading(true);
    try {
      console.log('📝 [AUTH] Registration started');
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          password_confirmation: userData.password_confirmation,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone.replace(/\D/g, ''),
        }),
      });

      console.log('📡 [AUTH] Response status:', response.status);
      
      const data = await response.json();
      console.log('📡 [AUTH] Response data:', data);
      
      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Registration failed');
      }
      
      // ✅ Save OTP identifier for stateless verification
      if (data.otp_identifier) {
        localStorage.setItem('otp_identifier', data.otp_identifier);
        console.log('💾 [AUTH] OTP identifier saved to localStorage');
      } else {
        console.warn('⚠️ [AUTH] No otp_identifier in response');
      }
      
      toast.success('✅ Registrasi berhasil! Cek email untuk OTP');
      
      // ✅ HARD REDIRECT to verify-otp page (most reliable)
      console.log('🔄 [AUTH] Redirecting to /verify-otp');
      setTimeout(() => {
        window.location.href = '/verify-otp';
      }, 500);
      
      return data;
      
    } catch (error: any) {
      console.error('❌ [AUTH] Registration error:', error);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     VERIFY OTP (STATELESS)
  ===================== */
  const verifyOtp = async (otp: string): Promise<any> => {
    setLoading(true);
    try {
      console.log('🔐 [AUTH] OTP verification started');
      
      const otpIdentifier = localStorage.getItem('otp_identifier');
      console.log('🔑 [AUTH] OTP Identifier:', otpIdentifier ? 'Found' : 'Not found');
      
      if (!otpIdentifier) {
        throw new Error('Session expired. Please register/login again.');
      }

      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          otp,
          otp_identifier: otpIdentifier
        }),
      });

      console.log('📡 [AUTH] Response status:', response.status);
      
      const data = await response.json();
      console.log('📡 [AUTH] Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }
      
      // ✅ Clear OTP identifier after successful verification
      localStorage.removeItem('otp_identifier');
      console.log('🗑️ [AUTH] OTP identifier cleared');
      
      // ✅ Save access token and user data
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        console.log('💾 [AUTH] Access token saved to localStorage');
        
        setUser(data.user);
        console.log('👤 [AUTH] User state updated:', data.user);
        
        toast.success('✅ Email berhasil diverifikasi!');
        
        // ✅ HARD REDIRECT to dashboard
        console.log('🔄 [AUTH] Redirecting to /dashboard');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
      } else {
        throw new Error('No access token received');
      }
      
      return data;
      
    } catch (error: any) {
      console.error('❌ [AUTH] OTP verification error:', error);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     RESEND OTP (STATELESS)
  ===================== */
  const resendOtp = async (): Promise<any> => {
    setLoading(true);
    try {
      console.log('🔄 [AUTH] Resending OTP');
      
      const otpIdentifier = localStorage.getItem('otp_identifier');
      
      if (!otpIdentifier) {
        throw new Error('Session expired. Please register/login again.');
      }

      const response = await fetch(`${API_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          otp_identifier: otpIdentifier 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }
      
      // ✅ Update OTP identifier with new one
      if (data.otp_identifier) {
        localStorage.setItem('otp_identifier', data.otp_identifier);
        console.log('💾 [AUTH] Updated OTP identifier saved');
      }
      
      toast.success('✅ OTP baru telah dikirim');
      return data;
      
    } catch (error: any) {
      console.error('❌ [AUTH] Resend OTP error:', error);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     LOGIN (STATELESS OTP)
  ===================== */
  const login = async (loginIdentifier: string, password: string): Promise<any> => {
    setLoading(true);
    try {
      console.log('🔐 [AUTH] Login started');
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          login: loginIdentifier, 
          password 
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Login gagal');
      }
      
      // ✅ Save OTP identifier for login flow
      if (data.otp_identifier) {
        localStorage.setItem('otp_identifier', data.otp_identifier);
        console.log('💾 [AUTH] OTP identifier saved for login');
      }
      
      toast.success('✅ OTP dikirim ke email');
      
      // ✅ HARD REDIRECT to verify-otp page
      console.log('🔄 [AUTH] Redirecting to /verify-otp');
      setTimeout(() => {
        window.location.href = '/verify-otp';
      }, 500);
      
      return data;
      
    } catch (error: any) {
      console.error('❌ [AUTH] Login error:', error);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     LOGOUT
  ===================== */
  const logout = async (): Promise<void> => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      try {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      } catch (error) {
        console.error('❌ [AUTH] Logout API error:', error);
      }
    }
    
    // ✅ Clear all auth data
    localStorage.removeItem('access_token');
    localStorage.removeItem('otp_identifier');
    setUser(null);
    
    console.log('👋 [AUTH] User logged out');
    
    // ✅ Redirect to login page
    setTimeout(() => {
      window.location.href = '/login';
    }, 300);
  };

  /* =====================
     CONTEXT PROVIDER
  ===================== */
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login,
      register, 
      verifyOtp, 
      resendOtp, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/* =====================
   USE AUTH HOOK
===================== */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}