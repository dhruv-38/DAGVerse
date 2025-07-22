import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useAuth } from '../utils/AuthContext';

// SessionLog contract (collaborative projects)
const SESSION_LOG_ADDRESS = '0xeBE423bb8385cFF5fAD469464faB81a783ee244a';
const SESSION_LOG_ABI = [
  {"inputs":[{"internalType":"uint256","name":"sessionId","type":"uint256"}],"name":"getSession","outputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint64","name":"createdAt","type":"uint64"},{"internalType":"address[]","name":"participants","type":"address[]"},{"internalType":"uint256","name":"versionCount","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"sessionCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"sessionId","type":"uint256"}],"name":"getLatestVersion","outputs":[{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"address","name":"savedBy","type":"address"}],"stateMutability":"view","type":"function"}
];

// PaymentEscrow contract (expert help)
const ESCROW_ADDRESS = '0x969005435a2648e031Bf88F71d6DDA8D6a4E6DB3';
const ESCROW_ABI = [
  {"inputs":[],"name":"escrowCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"escrowId","type":"uint256"}],"name":"getEscrow","outputs":[{"internalType":"address","name":"payer","type":"address"},{"internalType":"address","name":"payee","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint8","name":"status","type":"uint8"},{"internalType":"uint64","name":"createdAt","type":"uint64"},{"internalType":"uint64","name":"deadline","type":"uint64"},{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"string","name":"solutionIpfsHash","type":"string"}],"stateMutability":"view","type":"function"}
];

// BDAG token (ERC20) - replace with actual address if needed
const BDAG_TOKEN_ADDRESS = '';
const ERC20_ABI = [
  {"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"}
];

const Dashboard = () => {
  const { user, walletConnected, connectWallet } = useAuth();

  // Require wallet connection (must be before any hooks)
  if (!walletConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="bg-white/10 rounded-xl p-8 shadow-lg text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h1>
          <p className="text-gray-300 mb-6">Please connect your wallet to access the dashboard and platform features.</p>
          <button
            onClick={connectWallet}
            className="bg-cyan-400 hover:bg-cyan-500 text-[#181b34] font-semibold px-6 py-3 rounded-lg shadow transition"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  const [provider, setProvider] = useState(null);
  const [sessionProjects, setSessionProjects] = useState([]);
  const [escrowRequests, setEscrowRequests] = useState([]);
  const [claimedTasks, setClaimedTasks] = useState([]);
  const [bdagBalance, setBdagBalance] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('requests');

  // Initialize provider
  useEffect(() => {
    if (window.ethereum) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }
  }, []);

  // Fetch SessionLog projects
  useEffect(() => {
    const fetchSessions = async () => {
      if (!provider || !user?.walletAddress) return;
      const contract = new ethers.Contract(SESSION_LOG_ADDRESS, SESSION_LOG_ABI, provider);
      const sessionCount = await contract.sessionCount();
      const sessions = [];
      for (let i = 1; i <= Number(sessionCount); i++) {
        const session = await contract.getSession(i);
        if (session.participants.map(a => a.toLowerCase()).includes(user.walletAddress.toLowerCase())) {
          const latest = await contract.getLatestVersion(i);
          sessions.push({
            id: i,
            owner: session.owner,
            createdAt: session.createdAt,
            participants: session.participants,
            versionCount: session.versionCount,
            lastSaved: latest.timestamp,
          });
        }
      }
      setSessionProjects(sessions);
    };
    fetchSessions();
  }, [provider, user]);

  // Fetch PaymentEscrow activity
  useEffect(() => {
    const fetchEscrows = async () => {
      if (!provider || !user?.walletAddress) return;
      const contract = new ethers.Contract(ESCROW_ADDRESS, ESCROW_ABI, provider);
      const escrowCount = await contract.escrowCount();
      const requests = [];
      const claimed = [];
      for (let i = 1; i <= Number(escrowCount); i++) {
        const esc = await contract.getEscrow(i);
        if (esc.payer && esc.payer.toLowerCase() === user.walletAddress.toLowerCase()) {
          requests.push({ id: i, ...esc });
        }
        if (esc.payee && esc.payee.toLowerCase() === user.walletAddress.toLowerCase()) {
          claimed.push({ id: i, ...esc });
        }
      }
      setEscrowRequests(requests);
      setClaimedTasks(claimed);
    };
    fetchEscrows();
  }, [provider, user]);

  // Fetch BDAG balance (if token address is set)
  useEffect(() => {
    const fetchBalance = async () => {
      if (!provider || !user?.walletAddress || !BDAG_TOKEN_ADDRESS) return;
      const token = new ethers.Contract(BDAG_TOKEN_ADDRESS, ERC20_ABI, provider);
      const bal = await token.balanceOf(user.walletAddress);
      setBdagBalance(ethers.formatEther(bal));
    };
    fetchBalance();
  }, [provider, user]);

  // UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      {/* User Profile & Wallet */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <div className="text-gray-300">Welcome, {user?.walletAddress?.slice(0, 6)}...{user?.walletAddress?.slice(-4)}</div>
        </div>
        <div className="bg-white/10 rounded-lg px-6 py-3 text-white text-lg font-semibold flex flex-col items-end">
          <span>Wallet: {user?.walletAddress?.slice(0, 6)}...{user?.walletAddress?.slice(-4)}</span>
          <span>BDAG: {bdagBalance || '—'}</span>
        </div>
      </div>

      {/* Collaborative Projects */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">My Collaborative Projects</h2>
          <a href="/sessions" className="bg-cyan-400 hover:bg-cyan-500 text-[#181b34] font-semibold px-6 py-2 rounded-lg shadow transition">+ Create New Project</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessionProjects.length === 0 ? (
            <div className="text-gray-400 col-span-3">No collaborative projects found.</div>
          ) : sessionProjects.map(proj => (
            <div key={proj.id} className="bg-white/10 rounded-xl p-6 shadow flex flex-col justify-between">
              <div className="mb-2 text-lg font-bold text-white">Session #{proj.id}</div>
              <div className="mb-2 text-gray-300 text-sm">Last saved: {proj.lastSaved ? new Date(Number(proj.lastSaved) * 1000).toLocaleString() : '—'}</div>
              <div className="flex items-center mb-2">
                {proj.participants.map(addr => (
                  <span key={addr} className="bg-blue-700 text-white rounded-full px-2 py-1 text-xs mr-1">{addr.slice(0, 6)}...{addr.slice(-4)}</span>
                ))}
              </div>
              <a href={`/session/${proj.id}`} className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg text-center">Open</a>
            </div>
          ))}
        </div>
      </div>

      {/* Expert Help Activity */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">My Expert Help Activity</h2>
          <a href="/expert-help" className="bg-cyan-400 hover:bg-cyan-500 text-[#181b34] font-semibold px-6 py-2 rounded-lg shadow transition">Request Expert Help</a>
        </div>
        <div className="mb-4">
          <button className={`px-4 py-2 rounded-l-lg ${tab === 'requests' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-300'}`} onClick={() => setTab('requests')}>My Help Requests</button>
          <button className={`px-4 py-2 rounded-r-lg ${tab === 'claimed' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-300'}`} onClick={() => setTab('claimed')}>My Claimed Tasks</button>
        </div>
        {tab === 'requests' ? (
          <div className="space-y-4">
            {escrowRequests.length === 0 ? (
              <div className="text-gray-400">No help requests found.</div>
            ) : escrowRequests.map(req => (
              <div key={req.id} className="bg-white/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-white font-semibold">Help Request #{req.id}</div>
                  <div className="text-cyan-300">💎 {req.amount != null ? ethers.formatEther(req.amount) : '—'} BDAG</div>
                  <div className="text-gray-400 text-xs">Status: {['Pending', 'Claimed', 'Released', 'Refunded', 'Disputed', 'Cancelled'][Number(req.status)]}</div>
                </div>
                <div className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0">
                  {req.solutionIpfsHash && (
                    <a href={`/expert-help`} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-center">Review & Release Funds</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {claimedTasks.length === 0 ? (
              <div className="text-gray-400">No claimed tasks found.</div>
            ) : claimedTasks.map(req => (
              <div key={req.id} className="bg-white/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-white font-semibold">Task #{req.id}</div>
                  <div className="text-cyan-300">💎 {req.amount != null ? ethers.formatEther(req.amount) : '—'} BDAG</div>
                  <div className="text-gray-400 text-xs">Status: {['Pending', 'Claimed', 'Released', 'Refunded', 'Disputed', 'Cancelled'][Number(req.status)]}</div>
                </div>
                <div className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0">
                  <a href={`/expert-help`} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-center">Submit Solution</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 