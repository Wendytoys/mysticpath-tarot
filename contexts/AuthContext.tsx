
import React, { createContext, ReactNode, useCallback } from 'react';
import { useMiniKit, MiniKitUser } from '@worldcoin/minikit-react';

interface AuthContextType {
  user: MiniKitUser | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
  isConnected: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isInstalled, isConnected, user, connect, disconnect } = useMiniKit();

  const login = useCallback(() => {
    if (isInstalled && !isConnected) {
      connect();
    }
  }, [isInstalled, isConnected, connect]);

  const logout = useCallback(() => {
    if (isConnected) {
      disconnect();
    }
  }, [isConnected, disconnect]);

  // The loading state can be inferred from the MiniKit's connection status
  // For simplicity, we'll consider it not loading once we know if the wallet is connected.
  const loading = !isInstalled; 

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isConnected }}>
      {children}
    </AuthContext.Provider>
  );
};
