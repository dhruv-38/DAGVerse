import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { uploadToIPFS } from '../utils/ipfs';
import ProfileReleaseButton from './Profile';

// Use the deployed contract address
// Previous contract "0xe5b2f1caf6253e4e9Ba3bCdAFCe3764948Ea3883";
const ESCROW_CONTRACT_ADDRESS = "0xaEFa7d462cC4E3c2fdB544C346b5Bf822Fea0bDC";

// Use the provided ABI
const ESCROW_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			}
		],
		"name": "cancel",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			}
		],
		"name": "claimEscrow",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint64",
				"name": "deadline",
				"type": "uint64"
			},
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			}
		],
		"name": "createEscrow",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			}
		],
		"name": "dispute",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			}
		],
		"name": "EscrowCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "payee",
				"type": "address"
			}
		],
		"name": "EscrowClaimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "payer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint64",
				"name": "deadline",
				"type": "uint64"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			}
		],
		"name": "EscrowCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			}
		],
		"name": "EscrowDisputed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			}
		],
		"name": "EscrowRefunded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			}
		],
		"name": "EscrowReleased",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			}
		],
		"name": "refund",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			}
		],
		"name": "release",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "escrowCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "escrows",
		"outputs": [
			{
				"internalType": "address",
				"name": "payer",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "payee",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "enum PaymentEscrow.EscrowStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint64",
				"name": "createdAt",
				"type": "uint64"
			},
			{
				"internalType": "uint64",
				"name": "deadline",
				"type": "uint64"
			},
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "solutionIpfsHash",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			}
		],
		"name": "getEscrow",
		"outputs": [
			{
				"internalType": "address",
				"name": "payer",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "payee",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "enum PaymentEscrow.EscrowStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint64",
				"name": "createdAt",
				"type": "uint64"
			},
			{
				"internalType": "uint64",
				"name": "deadline",
				"type": "uint64"
			},
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "solutionIpfsHash",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "solutionIpfsHash",
				"type": "string"
			}
		],
		"name": "submitSolution",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

const ExpertHelp = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ amount: '', deadline: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [solvingId, setSolvingId] = useState(null);
  const [solvingReq, setSolvingReq] = useState(null);
  const [solveCode, setSolveCode] = useState('');
  const [solutionHash, setSolutionHash] = useState('');
  const [showSolveModal, setShowSolveModal] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [solutionCode, setSolutionCode] = useState('');
  const [solutionModalReq, setSolutionModalReq] = useState(null);

  // Connect wallet and contract
  useEffect(() => {
    if (window.ethereum) {
      const prov = new ethers.BrowserProvider(window.ethereum);
      prov.getSigner().then(s => {
        setProvider(prov);
        setSigner(s);
        s.getAddress().then(setAccount);
        setContract(new ethers.Contract(ESCROW_CONTRACT_ADDRESS, ESCROW_ABI, s));
      });
    }
  }, []);

  // Fetch all help requests (escrows)
  const fetchRequests = async () => {
    if (!contract) return;
    setLoading(true);
    let results = [];
    try {
      const count = await contract.escrowCount();
      const numCount = Number(count);
      for (let i = 1; i <= Math.min(numCount, 100); i++) {
        // getEscrow returns (address payer, address payee, uint256 amount, EscrowStatus status, uint64 createdAt, uint64 deadline, string ipfsHash, string solutionIpfsHash)
        const esc = await contract.getEscrow(i);
        results.push({
          id: i,
          payer: esc[0],
          payee: esc[1],
          amount: esc[2],
          status: esc[3],
          createdAt: esc[4],
          deadline: esc[5],
          ipfsHash: esc[6],
          solutionIpfsHash: esc[7],
        });
      }
      setRequests(results);
    } catch (e) {
      setMessage('Failed to fetch help requests');
    }
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, [contract]);

  // Handle form input
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Create help request (escrow)
  const createRequest = async e => {
    e.preventDefault();
    if (!contract || !signer) return;
    setLoading(true);
    setMessage('');
    try {
      // Upload description to IPFS and get hash
      const ipfsHash = await uploadToIPFS(form.description);
      const tx = await contract.createEscrow(
        Math.floor(new Date(form.deadline).getTime() / 1000),
        ipfsHash,
        { value: ethers.parseEther(form.amount) }
      );
      await tx.wait();
      setMessage('Help request created!');
      setForm({ amount: '', deadline: '', description: '' });
      setShowForm(false);
      fetchRequests();
    } catch (err) {
      setMessage('Error: ' + (err.reason || err.message));
    }
    setLoading(false);
  };

  // Expert claims a help request
  const claimRequest = async (id) => {
    if (!contract || !signer) return;
    setLoading(true);
    setMessage('');
    try {
      const tx = await contract.claimEscrow(id);
      await tx.wait();
      setMessage('You have claimed this help request!');
      fetchRequests();
    } catch (err) {
      setMessage('Error: ' + (err.reason || err.message));
    }
    setLoading(false);
  };

  // Handle Solve button click
  const handleSolve = async (req) => {
    setSolvingId(req.id);
    setSolvingReq(req);
    setShowSolveModal(true);
    setMessage('Fetching code from IPFS...');
    try {
      const res = await fetch(`https://ipfs.io/ipfs/${req.ipfsHash}`);
      const code = await res.text();
      setSolveCode(code);
      setMessage('');
    } catch (err) {
      setSolveCode('// Failed to fetch code from IPFS');
      setMessage('Failed to fetch code from IPFS');
    }
  };

  // Handle solution code change
  const handleSolveCodeChange = (e) => setSolveCode(e.target.value);

  // Submit solution (on-chain)
  const handleSubmitSolution = async () => {
    setMessage('Uploading solution to IPFS...');
    try {
      const hash = await uploadToIPFS(solveCode);
      // Submit solution hash on-chain
      const tx = await contract.submitSolution(solvingId, hash);
      await tx.wait();
      setSolutionHash(hash);
      setSolvingReq({ ...solvingReq, solutionIpfsHash: hash });
      setMessage('Solution submitted!');
      fetchRequests();
    } catch (err) {
      setMessage('Failed to submit solution: ' + err.message);
    }
  };

  // Show solution modal for developer to review and release funds
  const handleShowSolution = async (req) => {
    setSolutionModalReq(req);
    setShowSolutionModal(true);
    setMessage('Fetching solution from IPFS...');
    try {
      if (req.solutionIpfsHash) {
        const res = await fetch(`https://ipfs.io/ipfs/${req.solutionIpfsHash}`);
        const code = await res.text();
        setSolutionCode(code);
        setMessage('');
      } else {
        setSolutionCode('// No solution submitted yet');
        setMessage('No solution submitted yet');
      }
    } catch (err) {
      setSolutionCode('// Failed to fetch solution from IPFS');
      setMessage('Failed to fetch solution from IPFS');
    }
  };

  // Release funds
  const handleRelease = async (id) => {
    if (!contract || !signer) return;
    setMessage('Releasing funds...');
    try {
      const tx = await contract.release(id);
      await tx.wait();
      setMessage('Funds released!');
      fetchRequests();
      setShowSolutionModal(false);
    } catch (err) {
      setMessage('Failed to release funds: ' + (err.reason || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Expert Help Marketplace</h1>
        <div className="flex gap-2">
          <button
            className="bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center"
            onClick={() => setShowForm(true)}
          >
            <span className="mr-2">📝</span> Request Help
          </button>
          <button
            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center"
            onClick={fetchRequests}
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>
      {showForm && (
        <form onSubmit={createRequest} className="bg-white/10 p-6 rounded-lg mb-8 max-w-xl mx-auto">
          <h2 className="text-xl font-semibold text-white mb-4">Create New Help Request</h2>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required className="w-full p-2 rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Amount (BDAG)</label>
            <input name="amount" value={form.amount} onChange={handleChange} required type="number" min="0.01" step="0.01" className="w-full p-2 rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Deadline (date/time)</label>
            <input name="deadline" value={form.deadline} onChange={handleChange} required type="datetime-local" className="w-full p-2 rounded" />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded">
              {loading ? 'Processing...' : 'Create Help Request'}
            </button>
          </div>
        </form>
      )}
      {message && <div className="mb-4 text-yellow-300">{message}</div>}
      <div className="grid md:grid-cols-3 gap-8">
        {loading ? <div className="text-white">Loading...</div> : requests
          // Filter: show open/claimed, and show closed only for status display (no buttons), hide expired open/claimed
          .filter(req => {
            const isReleased = Number(req.status) === 2;
            const isRefunded = Number(req.status) === 3;
            const isCancelled = Number(req.status) === 5;
            const isClosed = isReleased || isRefunded || isCancelled;
            const now = Math.floor(Date.now() / 1000);
            const isExpired = !isClosed && Number(req.deadline) < now;
            // Show if not expired, or if closed (so closed bugs are visible as closed)
            return !isExpired || isClosed;
          })
          .map(req => {
          // Status logic
          const isPending = Number(req.status) === 0;
          const isClaimed = Number(req.status) === 1;
          const isReleased = Number(req.status) === 2;
          const isRefunded = Number(req.status) === 3;
          const isDisputed = Number(req.status) === 4;
          const isCancelled = Number(req.status) === 5;
          const isClosed = isReleased || isRefunded || isCancelled;
          const isUnclaimed = isPending && req.payee === ethers.ZeroAddress;
          const isClaimedByMe = isClaimed && req.payee && req.payee.toLowerCase() === account?.toLowerCase();
          const isClaimedByOther = isClaimed && req.payee && req.payee !== ethers.ZeroAddress && req.payee.toLowerCase() !== account?.toLowerCase();
          const isMine = req.payer && req.payer.toLowerCase() === account?.toLowerCase();

          let statusLabel = '';
          let statusClass = '';
          if (isClosed) {
            statusLabel = 'Closed';
            statusClass = 'bg-gray-700 text-gray-400';
          } else if (isClaimedByMe) {
            statusLabel = 'Claimed (You)';
            statusClass = 'bg-yellow-900 text-yellow-300';
          } else if (isClaimedByOther) {
            statusLabel = 'Claimed';
            statusClass = 'bg-yellow-900 text-yellow-300';
          } else {
            statusLabel = 'Open';
            statusClass = 'bg-green-900 text-green-300';
          }

          return (
            <div key={req.id} className="bg-white/5 rounded-xl p-8 border border-white/10 flex flex-col justify-between relative">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-3xl mr-4">
                  🛠️
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Help Request #{req.id}</h2>
                  <p className="text-gray-300 text-sm mb-1">
                    {req.ipfsHash ? (
                      <a href={`https://ipfs.io/ipfs/${req.ipfsHash}`} target="_blank" rel="noopener noreferrer" className="underline text-cyan-300">View Description on IPFS</a>
                    ) : 'No description (to be stored on IPFS)'}
                  </p>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-cyan-300 font-semibold">💎 {ethers.formatEther(req.amount)} BDAG</span>
                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}>{statusLabel}</span>
                  </div>
                  <div className="text-gray-400 text-xs">Deadline: {new Date(Number(req.deadline) * 1000).toLocaleString()}</div>
                  {req.ipfsHash && (
                    <div className="text-xs text-gray-400 mt-1">IPFS: {req.ipfsHash}</div>
                  )}
                  {req.solutionIpfsHash && (
                    <div className="text-xs text-gray-400 mt-1">Solution: {req.solutionIpfsHash}</div>
                  )}
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                {/* Show Claim button for open, unclaimed requests */}
                {isUnclaimed && !isClosed && (
                  <button
                    onClick={() => claimRequest(req.id)}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded font-semibold flex-1"
                    disabled={loading}
                  >
                    Claim
                  </button>
                )}
                {/* Show Solve button for expert who claimed the request */}
                {isClaimedByMe && !isClosed && (
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold flex-1"
                    onClick={() => handleSolve(req)}
                  >
                    Solve
                  </button>
                )}
                {/* Show solution/release for developer if solution exists */}
                {isMine && !isClosed && (
                  <ShowSolutionReleaseButton req={req} handleShowSolution={handleShowSolution} />
                )}
                {/* Show solution link if available for expert */}
                {req.solutionIpfsHash && req.payee && req.payee.toLowerCase() === account?.toLowerCase() && !isMine && !isClosed && (
                  <a href={`https://ipfs.io/ipfs/${req.solutionIpfsHash}`} target="_blank" rel="noopener noreferrer" className="bg-blue-700 text-white px-4 py-2 rounded font-semibold flex-1 text-center">View Submitted Solution</a>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Solve Modal */}
      {showSolveModal && solvingReq && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Solve Help Request #{solvingId}</h2>
            <textarea
              className="w-full h-64 p-2 border rounded mb-4 font-mono"
              value={solveCode}
              onChange={handleSolveCodeChange}
              disabled={!!solvingReq.solutionIpfsHash}
            />
            <div className="flex justify-end space-x-2">
              {/* Show Submit Solution only if not already submitted */}
              {!solvingReq.solutionIpfsHash ? (
                <>
                  <button onClick={() => { setShowSolveModal(false); setSolvingReq(null); }} className="bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
                  <button onClick={handleSubmitSolution} className="bg-blue-600 text-white px-6 py-2 rounded">Submit Solution</button>
                </>
              ) : (
                <button onClick={() => { setShowSolveModal(false); setSolvingReq(null); }} className="bg-blue-600 text-white px-6 py-2 rounded">Close</button>
              )}
            </div>
            {message && <div className="mt-2 text-yellow-700">{message}</div>}
          </div>
        </div>
      )}
      {/* Show Solution Modal for developer to review and release funds */}
      {showSolutionModal && solutionModalReq && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Solution for Help Request #{solutionModalReq.id}</h2>
            <textarea
              className="w-full h-64 p-2 border rounded mb-4 font-mono"
              value={solutionCode}
              readOnly
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowSolutionModal(false)} className="bg-gray-600 text-white px-4 py-2 rounded">Close</button>
              <button onClick={() => handleRelease(solutionModalReq.id)} className="bg-green-600 text-white px-6 py-2 rounded">Release Funds</button>
            </div>
            {message && <div className="mt-2 text-yellow-700">{message}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper button for developer to show solution and release funds
function ShowSolutionReleaseButton({ req, handleShowSolution }) {
  if (req.solutionIpfsHash) {
    return (
      <button onClick={() => handleShowSolution(req)} className="bg-blue-700 text-white px-4 py-2 rounded font-semibold flex-1">Show Solution</button>
    );
  }
  return null;
}

export default ExpertHelp; 