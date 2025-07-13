import { createContext, useContext, useState, useEffect } from 'react';
import { 
  isAuthenticated, 
  setAuthenticated, 
  getCurrentUser, 
  setCurrentUser, 
  logout as logoutUtil,
  isWalletConnected,
  setWalletConnected
} from './auth';

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
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      const currentUser = getCurrentUser();
      const walletStatus = isWalletConnected();
      
      setAuth(authStatus);
      setUser(currentUser);
      setWallet(walletStatus);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setAuth(true);
    setAuthenticated(true);
    setCurrentUser(userData);
  };

  const logout = () => {
    setUser(null);
    setAuth(false);
    setWallet(false);
    logoutUtil();
  };

  const connectWallet = () => {
    setWallet(true);
    setWalletConnected(true);
    return { success: true, address: '0x1234...5678' }; // Simulated wallet address
  };

  const disconnectWallet = () => {
    setWallet(false);
    setWalletConnected(false);
  };

  const value = {
    user,
    authenticated,
    walletConnected,
    loading,
    login,
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