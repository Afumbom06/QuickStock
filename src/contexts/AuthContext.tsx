import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { db } from '../utils/db';
import { useOnlineStatus } from '../utils/offline';
import { determineUserRole } from '../utils/roleUtils';

export type UserRole = 'admin' | 'user';

interface AuthUser {
  id: string;
  name: string;
  emailOrPhone: string;
  shopName: string;
  shopCategory: string;
  lastLogin: string;
  role: UserRole;
  email?: string;
  phone?: string;
  avatar?: string;
  currency?: string;
  createdAt?: string;
  lastSync?: string;
}

interface SignupData {
  name: string;
  emailOrPhone: string;
  shopName: string;
  shopCategory: string;
  password: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isOnline: boolean;
  loading: boolean;
  login: (emailOrPhone: string, password: string, rememberMe: boolean) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  offlineLogin: (emailOrPhone: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await db.init();
      
      // Check for stored auth session
      const authSession = localStorage.getItem('auth_session');
      if (authSession) {
        const session = JSON.parse(authSession);
        const storedUser = await db.get<AuthUser>('user', session.userId);
        if (storedUser) {
          setUser(storedUser);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (emailOrPhone: string, password: string, rememberMe: boolean): Promise<boolean> => {
    try {
      // In a real app, this would call an API
      // For demo, we'll simulate authentication
      
      // Check if user exists in IndexedDB
      const users = await db.getAll<AuthUser>('user');
      const existingUser = users.find(u => u.emailOrPhone === emailOrPhone);

      if (existingUser) {
        // Update last login
        const updatedUser = {
          ...existingUser,
          lastLogin: new Date().toISOString(),
        };
        await db.put('user', updatedUser);
        setUser(updatedUser);

        // Store auth session
        if (rememberMe) {
          localStorage.setItem('auth_session', JSON.stringify({
            userId: existingUser.id,
            emailOrPhone,
            timestamp: new Date().toISOString(),
          }));
        } else {
          sessionStorage.setItem('auth_session', JSON.stringify({
            userId: existingUser.id,
            emailOrPhone,
            timestamp: new Date().toISOString(),
          }));
        }

        return true;
      }

      // For demo: Create mock user if doesn't exist
      const userRole = determineUserRole(emailOrPhone);
      const newUser: AuthUser = {
        id: `user-${Date.now()}`,
        name: emailOrPhone.includes('@') && emailOrPhone.endsWith('@admin.com') ? 'Admin User' : 'Demo User',
        emailOrPhone,
        shopName: userRole === 'admin' ? 'Admin Panel' : 'My Shop',
        shopCategory: 'general',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        role: userRole,
        email: emailOrPhone.includes('@') ? emailOrPhone : undefined,
        phone: !emailOrPhone.includes('@') ? emailOrPhone : undefined,
        currency: 'XAF',
      };
      
      await db.add('user', newUser);
      setUser(newUser);

      if (rememberMe) {
        localStorage.setItem('auth_session', JSON.stringify({
          userId: newUser.id,
          emailOrPhone,
          timestamp: new Date().toISOString(),
        }));
      }

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    try {
      // Check if user already exists
      const users = await db.getAll<AuthUser>('user');
      const existingUser = users.find(u => u.emailOrPhone === data.emailOrPhone);

      if (existingUser) {
        return false; // User already exists
      }

      // Determine role based on email
      const userRole = determineUserRole(data.emailOrPhone);

      // Create new user
      const newUser: AuthUser = {
        id: `user-${Date.now()}`,
        name: data.name,
        emailOrPhone: data.emailOrPhone,
        shopName: data.shopName,
        shopCategory: data.shopCategory,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        role: userRole,
        email: data.emailOrPhone.includes('@') ? data.emailOrPhone : undefined,
        phone: !data.emailOrPhone.includes('@') ? data.emailOrPhone : undefined,
        currency: 'XAF',
      };

      await db.add('user', newUser);
      setUser(newUser);

      // Store auth session
      localStorage.setItem('auth_session', JSON.stringify({
        userId: newUser.id,
        emailOrPhone: data.emailOrPhone,
        timestamp: new Date().toISOString(),
      }));

      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  const offlineLogin = async (emailOrPhone: string): Promise<boolean> => {
    try {
      // Check for cached credentials
      const authSession = localStorage.getItem('auth_session');
      if (!authSession) {
        return false;
      }

      const session = JSON.parse(authSession);
      if (session.emailOrPhone !== emailOrPhone) {
        return false;
      }

      // Load user from IndexedDB
      const storedUser = await db.get<AuthUser>('user', session.userId);
      if (storedUser) {
        setUser(storedUser);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Offline login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('auth_session');
      sessionStorage.removeItem('auth_session');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isOnline,
    loading,
    login,
    signup,
    logout,
    offlineLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}