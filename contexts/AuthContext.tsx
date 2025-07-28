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

// --- Final Implementation Following Documentation and Error Logs ---

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
    
    // Strict check based on worlddoc.txt and the latest error message
    if (MiniKit.isInstalled()) {
      console.log('AuthProvider: MiniKit is installed. Proceeding with walletAuth.');
      try {
        MiniKit.commands.walletAuth({
          nonce: crypto.randomUUID(),
        });
      } catch (error) {
        console.error('AuthProvider: Error during MiniKit.commands.walletAuth():', error);
      }
    } else {
      // This is the most likely issue.
      console.error('AuthProvider: MiniKit.isInstalled() returned false. Ensure you are running inside the World App and that your app version is up to date.');
      alert('This app must be run inside World App.');
    }
  }, []);

  const logout = useCallback(() => {
    console.log('AuthProvider: logout function called.');
    if (MiniKit.isInstalled()) {
        try {
            MiniKit.disconnect();
        } catch(error) {
            console.error('AuthProvider: Error during MiniKit.disconnect():', error);
        }
    }
  }, []);

  const value = useMemo(() => ({ user, login, logout, loading, isConnected }), [user, login, logout, loading, isConnected]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};