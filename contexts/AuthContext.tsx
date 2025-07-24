
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUser: User = {
  id: '12345',
  name: 'Radhe Sakha',
  email: 'devotee@mysticpath.com',
  avatar: 'https://i.pravatar.cc/150?u=radhesakha',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('mystic_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('mystic_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = () => {
    setLoading(true);
    // In a real app, this would be an API call to a backend for OAuth
    setTimeout(() => {
      localStorage.setItem('mystic_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setLoading(false);
    }, 500); // Simulate network delay
  };

  const logout = () => {
    localStorage.removeItem('mystic_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
