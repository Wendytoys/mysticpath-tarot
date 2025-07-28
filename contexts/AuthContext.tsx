import React, { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { MiniKit, MiniKitUser } from '@worldcoin/minikit-js';

interface AuthContextType {
  user: MiniKitUser | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
  isConnected: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a single instance of MiniKit
const miniKit = new MiniKit({
  appId: 'app_0a727a6d3167f5058844701558a5ed68',
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MiniKitUser | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Mounting...');
    const initMiniKit = async () => {
      try {
        console.log('AuthProvider: Initializing MiniKit instance...');
        await miniKit.init();
        console.log('AuthProvider: MiniKit Initialized Successfully.');

        if (miniKit.user) {
          console.log('AuthProvider: User already connected.', miniKit.user);
          setUser(miniKit.user);
          setIsConnected(true);
        } else {
          console.log('AuthProvider: User not connected initially.');
        }
      } catch (error) {
        console.error('AuthProvider: MiniKit initialization failed:', error);
      } finally {
        setLoading(false);
        console.log('AuthProvider: Loading state set to false.');
      }
    };

    initMiniKit();

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
    miniKit.subscribe('connected', handleConnect);
    miniKit.subscribe('disconnected', handleDisconnect);

    return () => {
      console.log('AuthProvider: Unsubscribing from MiniKit events.');
      miniKit.unsubscribe('connected', handleConnect);
      miniKit.unsubscribe('disconnected', handleDisconnect);
    };
  }, []);

  const login = useCallback(() => {
    console.log('AuthProvider: login function called.');
    if (!isConnected) {
      try {
        console.log('AuthProvider: Calling miniKit.connect()...');
        miniKit.connect();
      } catch (error) {
        console.error('AuthProvider: Error during miniKit.connect():', error);
      }
    } else {
      console.log('AuthProvider: Already connected, login call ignored.');
    }
  }, [isConnected]);

  const logout = useCallback(() => {
    console.log('AuthProvider: logout function called.');
    if (isConnected) {
      miniKit.disconnect();
    }
  }, [isConnected]);

  const value = useMemo(() => ({ user, login, logout, loading, isConnected }), [user, login, logout, loading, isConnected]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
