import React, { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { MiniKit, MiniKitUser, MiniAppWalletAuthSuccessPayload } from '@worldcoin/minikit-js';

interface AuthContextType {
  user: MiniKitUser | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
  isConnected: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Implementation based on worlddoc.txt SIWE Flow ---

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MiniKitUser | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // This effect handles the response from MiniKit after a command is sent
  useEffect(() => {
    const handleWalletAuthResponse = async (payload: MiniAppWalletAuthSuccessPayload) => {
      console.log('AuthProvider: Received walletAuth response from MiniKit', payload);
      
      // For now, we will just mark the user as connected on the frontend.
      // In the next step, we will send this payload to our backend for verification.
      if (payload.status === 'success') {
        // This is a temporary connection state. Real connection happens after backend verification.
        setIsConnected(true); 
        // We don't have the full user object yet, that comes after verification.
      } else {
        console.error('Wallet auth failed:', payload);
      }
    };

    // Subscribe to the specific event for Wallet Auth
    MiniKit.subscribe('miniapp-wallet-auth', handleWalletAuthResponse);
    
    // Set loading to false once subscriptions are set up
    setLoading(false);

    return () => {
      MiniKit.unsubscribe('miniapp-wallet-auth', handleWalletAuthResponse);
    };
  }, []);

  // This is the login function that starts the SIWE process
  const login = useCallback(async () => {
    console.log('AuthProvider: login function called.');

    if (!MiniKit.isInstalled()) {
      console.error("MiniKit is not installed. Please run in World App.");
      alert("Please use the World App to sign in.");
      return;
    }

    try {
      // Step 1: Fetch the nonce from our backend
      console.log('AuthProvider: Fetching nonce from /api/nonce...');
      const response = await fetch('/api/nonce');
      const { nonce } = await response.json();

      if (!nonce) {
        throw new Error('Nonce not received from backend.');
      }
      console.log('AuthProvider: Nonce received:', nonce);

      // Step 2: Call walletAuth with the received nonce
      console.log('AuthProvider: Calling MiniKit.commands.walletAuth...');
      MiniKit.commands.walletAuth({
        nonce: nonce,
        statement: 'Welcome to Mystic Path! Sign in to begin your journey.',
      });

    } catch (error) {
      console.error('AuthProvider: SIWE login process failed:', error);
      alert('Login failed. Could not get a security token from the server.');
    }
  }, []);

  const logout = useCallback(() => {
    console.log('AuthProvider: logout function called.');
    // We will implement a full logout later which might involve clearing backend session
    setIsConnected(false);
    setUser(null);
    MiniKit.disconnect();
  }, []);

  const value = useMemo(() => ({ user, login, logout, loading, isConnected }), [user, login, logout, loading, isConnected]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
