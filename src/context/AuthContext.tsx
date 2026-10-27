import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isStaff: boolean;
  isTailor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check saved session in localStorage
    const savedUser = localStorage.getItem('mystyle_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('mystyle_user', JSON.stringify(data.user));
        if (data.token) localStorage.setItem('mystyle_token', data.token);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login error', e);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('mystyle_user', JSON.stringify(data.user));
        if (data.token) localStorage.setItem('mystyle_token', data.token);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Register error', e);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mystyle_user');
    localStorage.removeItem('mystyle_token');
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  };

  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff' || isAdmin;
  const isTailor = user?.role === 'tailor' || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAdmin,
        isStaff,
        isTailor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
