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

// --- The Correct Way to Use This Specific MiniKit Version ---

// The imported `MiniKit` is a class with static methods. We call them directly.
// There is no `init` method. The connection is established by calling `connect`.

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MiniKitUser | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true); // Start with loading true

  useEffect(() => {
    console.log('AuthProvider: Mounting...');
    
    // Define the handlers for MiniKit events
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

    // Subscribe to the events
    console.log('AuthProvider: Subscribing to MiniKit events.');
    MiniKit.subscribe('connected', handleConnect);
    MiniKit.subscribe('disconnected', handleDisconnect);
    
    // We assume the library is "initialized" by the time we subscribe.
    // We can't know if the user is already connected without trying to connect,
    // so we'll set loading to false here.
    setLoading(false);
    console.log('AuthProvider: Ready. Loading state set to false.');

    // Cleanup on unmount
    return () => {
      console.log('AuthProvider: Unsubscribing from MiniKit events.');
      MiniKit.unsubscribe('connected', handleConnect);
      MiniKit.unsubscribe('disconnected', handleDisconnect);
    };
  }, []);

  // Login function
  const login = useCallback(() => {
    console.log('AuthProvider: login function called.');
    if (!isConnected) {
      try {
        console.log('AuthProvider: Calling MiniKit.connect()...');
        // The connect method doesn't need appId here, it's handled by World App
        MiniKit.connect({
            appId: 'app_0a727a6d3167f5058844701558a5ed68'
        });
      } catch (error) {
        console.error('AuthProvider: Error during MiniKit.connect():', error);
      }
    } else {
      console.log('AuthProvider: Already connected, login call ignored.');
    }
  }, [isConnected]);

  // Logout function
  const logout = useCallback(() => {
    console.log('AuthProvider: logout function called.');
    if (isConnected) {
      MiniKit.disconnect();
    }
  }, [isConnected]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ user, login, logout, loading, isConnected }), [user, login, logout, loading, isConnected]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
