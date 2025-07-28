import React, { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { MiniKit, MiniKitUser } from '@worldcoin/minikit-js';

// Define the interface for our context
interface AuthContextType {
  user: MiniKitUser | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
  isConnected: boolean;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MiniKitUser | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Mounting...');
    
    const handleConnect = (u: MiniKitUser) => {
      console.log('AuthProvider: "connected" event received.', u);
      setUser(u);
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log('AuthProvider: "disconnected" event received.');
      setUser(null);
      setIsConnected(false);
    };

    console.log('AuthProvider: Subscribing to MiniKit events.');
    MiniKit.subscribe('connected', handleConnect);
    MiniKit.subscribe('disconnected', handleDisconnect);
    
    setLoading(false);
    console.log('AuthProvider: Ready. Loading state set to false.');

    return () => {
      console.log('AuthProvider: Unsubscribing from MiniKit events.');
      MiniKit.unsubscribe('connected', handleConnect);
      MiniKit.unsubscribe('disconnected', handleDisconnect);
    };
  }, []);

  const login = useCallback(() => {
    console.log('AuthProvider: login function called.');
    if (typeof MiniKit.connect === 'function') {
      try {
        console.log('AuthProvider: Calling MiniKit.connect()...');
        MiniKit.connect({
            appId: 'app_0a727a6d3167f5058844701558a5ed68'
        });
      } catch (error) {
        console.error('AuthProvider: Error during MiniKit.connect():', error);
      }
    } else {
      console.error('AuthProvider: MiniKit.connect is not a function. MiniKit object:', MiniKit);
    }
  }, []);

  const logout = useCallback(() => {
    console.log('AuthProvider: logout function called.');
    if (typeof MiniKit.disconnect === 'function') {
      MiniKit.disconnect();
    } else {
      console.error('AuthProvider: MiniKit.disconnect is not a function.');
    }
  }, []);

  const value = useMemo(() => ({ user, login, logout, loading, isConnected }), [user, login, logout, loading, isConnected]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};