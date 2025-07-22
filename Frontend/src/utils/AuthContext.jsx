import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api.js';
import { ethers } from 'ethers';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authenticated, setAuth] = useState(false);
  const [walletConnected, setWallet] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      try {
        const token = apiService.getAuthToken();
        if (token) {
          // Try to get current user from API
          const userData = await apiService.getCurrentUser();
          setUser(userData);
          setAuth(true);
          setWallet(!!userData.walletAddress);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // If API call fails, clear invalid token
        apiService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      setUser(response.user);
      setAuth(true);
      setWallet(!!response.user.walletAddress);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      await apiService.register(userData);
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setAuth(false);
    setWallet(false);
    apiService.logout();
  };

  // Real MetaMask wallet connect
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      // Get challenge from backend
      const challengeResponse = await apiService.walletChallenge(walletAddress);

      // Ask user to sign the challenge
      const signature = await signer.signMessage(challengeResponse.challenge);

      // Verify with backend
      const verifyResponse = await apiService.walletVerify({
        walletAddress,
        signature,
        challenge: challengeResponse.challenge,
      });

      setWallet(true);
      setUser(verifyResponse.user);
      setAuth(true);

      return { success: true, address: walletAddress };
    } catch (error) {
      console.error('Wallet connection failed:', error);
      return { success: false, error: error.message };
    }
  };

  const disconnectWallet = () => {
    setWallet(false);
    // Note: Backend doesn't have a disconnect endpoint, so we just update local state
  };

  const value = {
    user,
    authenticated,
    walletConnected,
    loading,
    login,
    register,
    logout,
    connectWallet,
    disconnectWallet
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 