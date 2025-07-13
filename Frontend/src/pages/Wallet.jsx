import { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { Link } from 'react-router-dom';
import apiService from '../services/api.js';

const Wallet = () => {
  const { walletConnected, connectWallet, disconnectWallet } = useAuth();
  const [connecting, setConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletData, setWalletData] = useState({
    balance: '0',
    currency: 'DAG',
    usdValue: '$0.00',
    transactions: []
  });
  const [loading, setLoading] = useState(false);

  // Load wallet data when connected
  useEffect(() => {
    if (walletConnected) {
      loadWalletData();
    }
  }, [walletConnected]);

  const loadWalletData = async () => {
    setLoading(true);
    try {
      // In a real app, you'd fetch actual wallet data from the backend
      // For now, we'll use mock data
      const mockData = {
        balance: '2,450.75',
        currency: 'DAG',
        usdValue: '$12,253.75',
        transactions: [
          { id: 1, type: 'received', amount: '+500 DAG', from: '0xabcd...efgh', time: '2 hours ago' },
          { id: 2, type: 'sent', amount: '-150 DAG', to: '0x1234...5678', time: '1 day ago' },
          { id: 3, type: 'received', amount: '+750 DAG', from: '0x9876...5432', time: '3 days ago' }
        ]
      };
      
      setWalletData(mockData);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    setConnecting(true);
    try {
      // Generate a mock wallet address for demo
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      
      const result = await connectWallet(mockAddress);
      if (result.success) {
        setWalletAddress(result.address);
      } else {
        console.error('Wallet connection failed:', result.error);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    setWalletAddress('');
    setWalletData({
      balance: '0',
      currency: 'DAG',
      usdValue: '$0.00',
      transactions: []
    });
  };

  const getTransactionIcon = (type) => {
    return type === 'received' ? '📥' : '📤';
  };

  const getTransactionColor = (type) => {
    return type === 'received' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Wallet</h1>
              <p className="text-gray-300 mt-1">Manage your DAGVerse wallet</p>
            </div>
            <Link
              to="/dashboard"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Wallet Connection Status */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 mb-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            {walletConnected ? (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Wallet Connected</h2>
                <p className="text-gray-300 mb-6">Your wallet is successfully connected to DAGVerse</p>
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-400 mb-1">Wallet Address</p>
                  <p className="text-white font-mono text-lg">{walletAddress}</p>
                </div>
                <button
                  onClick={handleDisconnectWallet}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Disconnect Wallet
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
                <p className="text-gray-300 mb-6">Connect your wallet to start using DAGVerse features</p>
                <button
                  onClick={handleConnectWallet}
                  disabled={connecting}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {connecting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Connecting...
                    </div>
                  ) : (
                    'Connect Wallet'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Wallet Balance */}
        {walletConnected && (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 mb-8">
            <h3 className="text-xl font-semibold text-white mb-6">Wallet Balance</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-gray-300 text-sm mb-2">DAG Balance</p>
                  <p className="text-3xl font-bold text-white">{walletData.balance}</p>
                  <p className="text-gray-400 text-sm">{walletData.currency}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-300 text-sm mb-2">USD Value</p>
                  <p className="text-3xl font-bold text-white">{walletData.usdValue}</p>
                  <p className="text-green-400 text-sm">+5.2% today</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-300 text-sm mb-2">Network</p>
                  <p className="text-3xl font-bold text-white">DAG</p>
                  <p className="text-green-400 text-sm">Connected</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent Transactions */}
        {walletConnected && (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                View All
              </button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {walletData.transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-lg">{getTransactionIcon(tx.type)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {tx.type === 'received' ? 'Received from' : 'Sent to'} {tx.type === 'received' ? tx.from : tx.to}
                        </p>
                        <p className="text-gray-400 text-sm">{tx.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${getTransactionColor(tx.type)}`}>
                        {tx.amount}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {tx.type === 'received' ? 'Received' : 'Sent'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wallet Features */}
        {walletConnected && (
          <div className="mt-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">Wallet Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-3">
                  <span className="text-xl">💸</span>
                  <span>Send DAG</span>
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-3">
                  <span className="text-xl">📥</span>
                  <span>Receive DAG</span>
                </button>
                <button className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-3">
                  <span className="text-xl">📊</span>
                  <span>View Analytics</span>
                </button>
                <button className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-3">
                  <span className="text-xl">⚙️</span>
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet; 