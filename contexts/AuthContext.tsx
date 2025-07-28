import React, { createContext, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

// Log the imported object to see its structure
console.log('Inspecting the imported MiniKit object:', MiniKit);

// Dummy context for now
export const AuthContext = createContext<any>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    console.log('AuthProvider mounted. Check the inspection log above.');
  }, []);

  const value = {
    user: null,
    login: () => console.log('Login clicked, but functionality is disabled for debugging.'),
    logout: () => console.log('Logout clicked.'),
    loading: false,
    isConnected: false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};