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

// --- Full SIWE Flow Implementation ---

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MiniKitUser | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentNonce, setCurrentNonce] = useState<string | null>(null);

  useEffect(() => {
    const handleWalletAuthResponse = async (payload: MiniAppWalletAuthSuccessPayload) => {
      console.log('AuthProvider: Received walletAuth response from MiniKit', payload);
      
      if (payload.status === 'success' && currentNonce) {
        try {
          console.log('AuthProvider: Verifying signature with backend...');
          const response = await fetch('/api/verify-siwe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payload, nonce: currentNonce }),
          });

          const verificationResult = await response.json();

          if (response.ok && verificationResult.success) {
            console.log('AuthProvider: Backend verification successful.');
            setUser(verificationResult.user);
            setIsConnected(true);
          } else {
            throw new Error(verificationResult.error || 'Backend verification failed');
          }
        } catch (error) {
          console.error('AuthProvider: SIWE verification process failed:', error);
          alert('Sorry, we could not verify your sign-in. Please try again.');
          setIsConnected(false);
          setUser(null);
        }
      } else {
        console.error('Wallet auth failed or nonce is missing:', payload);
      }
    };

    MiniKit.subscribe('miniapp-wallet-auth', handleWalletAuthResponse);
    setLoading(false);

    return () => {
      MiniKit.unsubscribe('miniapp-wallet-auth', handleWalletAuthResponse);
    };
  }, [currentNonce]);

  const login = useCallback(async () => {
    console.log('AuthProvider: login function called.');

    if (!MiniKit.isInstalled()) {
      alert("Please use the World App to sign in.");
      return;
    }

    try {
      const response = await fetch('/api/nonce');
      const { nonce } = await response.json();
      if (!nonce) throw new Error('Nonce not received from backend.');
      
      setCurrentNonce(nonce); // Store nonce to use in the verification step
      
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
    setIsConnected(false);
    setUser(null);
    setCurrentNonce(null);
    MiniKit.disconnect();
  }, []);

  const value = useMemo(() => ({ user, login, logout, loading, isConnected }), [user, login, logout, loading, isConnected]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};