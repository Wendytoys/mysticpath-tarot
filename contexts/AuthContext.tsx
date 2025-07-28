
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { MiniKit, MiniKitUser } from '@worldcoin/minikit-js';

interface AuthContextType {
  user: MiniKitUser | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
  isConnected: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MiniKitUser | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initMiniKit = async () => {
      try {
        await MiniKit.init({
          appId: 'app_0a727a6d3167f5058844701558a5ed68',
        });

        // Check initial state
        if (MiniKit.user) {
          setUser(MiniKit.user);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('MiniKit initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initMiniKit();

    const handleConnect = (u: MiniKitUser) => {
      setUser(u);
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setUser(null);
      setIsConnected(false);
    };

    MiniKit.subscribe('connected', handleConnect);
    MiniKit.subscribe('disconnected', handleDisconnect);

    return () => {
      MiniKit.unsubscribe('connected', handleConnect);
      MiniKit.unsubscribe('disconnected', handleDisconnect);
    };
  }, []);

  const login = useCallback(() => {
    if (!isConnected) {
      MiniKit.connect();
    }
  }, [isConnected]);

  const logout = useCallback(() => {
    if (isConnected) {
      MiniKit.disconnect();
    }
  }, [isConnected]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isConnected }}>
      {children}
    </AuthContext.Provider>
  );
};
