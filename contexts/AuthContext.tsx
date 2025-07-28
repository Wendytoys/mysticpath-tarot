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

// --- The Correct Implementation based on Docs and Console Logs ---

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

  // Login function using the correct `walletAuth` command
  const login = useCallback(() => {
    console.log('AuthProvider: login function called.');
    try {
      // This is the correct command as per the documentation
      console.log('AuthProvider: Calling MiniKit.commands.walletAuth()...');
      MiniKit.commands.walletAuth({
        nonce: crypto.randomUUID(), // Using a client-side nonce for testing. In production, this should come from a backend.
      });
    } catch (error) {
      console.error('AuthProvider: Error during MiniKit.commands.walletAuth():', error);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    console.log('AuthProvider: logout function called.');
    try {
        MiniKit.disconnect();
    } catch(error) {
        console.error('AuthProvider: Error during MiniKit.disconnect():', error);
    }
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ user, login, logout, loading, isConnected }), [user, login, logout, loading, isConnected]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
