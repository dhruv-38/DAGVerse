import { useAuth } from '../utils/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="bg-white/10 rounded-xl p-8 shadow-lg text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Dashboard</h1>
        <p className="text-gray-300">This is a placeholder dashboard for the MVP.<br/>Core features are in the Editor page.</p>
      </div>
    </div>
  );
};

export default Dashboard; 