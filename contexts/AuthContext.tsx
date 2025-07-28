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
    console.log('AuthProvider: Mounting...');
    const initMiniKit = async () => {
      try {
        console.log('AuthProvider: Initializing MiniKit...');
        await MiniKit.init({
          appId: 'app_0a727a6d3167f5058844701558a5ed68',
        });
        console.log('AuthProvider: MiniKit Initialized Successfully.');

        if (MiniKit.user) {
          console.log('AuthProvider: User already connected.', MiniKit.user);
          setUser(MiniKit.user);
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
    MiniKit.subscribe('connected', handleConnect);
    MiniKit.subscribe('disconnected', handleDisconnect);

    return () => {
      console.log('AuthProvider: Unsubscribing from MiniKit events.');
      MiniKit.unsubscribe('connected', handleConnect);
      MiniKit.unsubscribe('disconnected', handleDisconnect);
    };
  }, []);

  const login = useCallback(() => {
    console.log('AuthProvider: login function called.');
    if (!isConnected) {
      try {
        console.log('AuthProvider: Calling MiniKit.connect()...');
        MiniKit.connect();
      } catch (error) {
        console.error('AuthProvider: Error during MiniKit.connect():', error);
      }
    } else {
      console.log('AuthProvider: Already connected, login call ignored.');
    }
  }, [isConnected]);

  const logout = useCallback(() => {
    console.log('AuthProvider: logout function called.');
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