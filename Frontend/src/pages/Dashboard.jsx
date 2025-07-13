import { useAuth } from '../utils/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, walletConnected } = useAuth();

  // Mock data for dashboard
  const stats = [
    { label: 'Projects Created', value: '12', change: '+3', changeType: 'positive' },
    { label: 'Total Transactions', value: '1,247', change: '+12%', changeType: 'positive' },
    { label: 'DAG Tokens', value: '2,450', change: '+5.2%', changeType: 'positive' },
    { label: 'Active Collaborations', value: '8', change: '+2', changeType: 'positive' }
  ];

  const recentProjects = [
    { id: 1, name: 'DeFi Protocol', status: 'active', lastUpdated: '2 hours ago' },
    { id: 2, name: 'NFT Marketplace', status: 'completed', lastUpdated: '1 day ago' },
    { id: 3, name: 'DAO Governance', status: 'in-progress', lastUpdated: '3 days ago' }
  ];

  const quickActions = [
    { name: 'Create New Project', icon: '➕', link: '#', color: 'blue' },
    { name: 'Connect Wallet', icon: '🔗', link: '/wallet', color: 'green' },
    { name: 'View Analytics', icon: '📊', link: '#', color: 'purple' },
    { name: 'Join Community', icon: '👥', link: '#', color: 'orange' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'completed': return 'text-blue-400';
      case 'in-progress': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getActionColor = (color) => {
    switch (color) {
      case 'blue': return 'bg-blue-500 hover:bg-blue-600';
      case 'green': return 'bg-green-500 hover:bg-green-600';
      case 'purple': return 'bg-purple-500 hover:bg-purple-600';
      case 'orange': return 'bg-orange-500 hover:bg-orange-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-300 mt-1">Welcome back, {user?.name || 'User'}!</p>
            </div>
            <div className="flex items-center space-x-4">
              {walletConnected ? (
                <div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/50 px-4 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm font-medium">Wallet Connected</span>
                </div>
              ) : (
                <Link
                  to="/wallet"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Connect Wallet
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className={`block w-full ${getActionColor(action.color)} text-white px-4 py-3 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center space-x-3`}
                  >
                    <span className="text-lg">{action.icon}</span>
                    <span>{action.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Recent Projects</h3>
                <Link
                  to="#"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {project.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{project.name}</h4>
                        <p className="text-gray-400 text-sm">Updated {project.lastUpdated}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-sm font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="mt-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'Created new project "DeFi Protocol"', time: '2 hours ago', type: 'project' },
                { action: 'Connected wallet successfully', time: '4 hours ago', type: 'wallet' },
                { action: 'Completed transaction #1234', time: '1 day ago', type: 'transaction' },
                { action: 'Joined community "DAG Developers"', time: '2 days ago', type: 'community' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {activity.type.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white">{activity.action}</p>
                    <p className="text-gray-400 text-sm">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 