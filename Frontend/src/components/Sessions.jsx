import { useRef, useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { ethers } from 'ethers';
import { uploadToIPFS, uploadSessionToIPFS } from '../utils/ipfs';
import { useAuth } from '../utils/AuthContext';

const LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'Solidity', value: 'solidity' },
];

// Smart contract ABI (replace with your actual ABI)
const SESSION_LOG_ABI = [
  {"inputs":[{"internalType":"address[]","name":"initialParticipants","type":"address[]"},{"internalType":"string","name":"ipfsHash","type":"string"}],"name":"createSession","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"sessionId","type":"uint256"}],"name":"joinSession","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"sessionId","type":"uint256"},{"indexed":true,"internalType":"address","name":"participant","type":"address"}],"name":"ParticipantAdded","type":"event"},
  {"inputs":[{"internalType":"uint256","name":"sessionId","type":"uint256"},{"internalType":"string","name":"ipfsHash","type":"string"}],"name":"saveVersion","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"sessionId","type":"uint256"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint64","name":"createdAt","type":"uint64"},{"indexed":false,"internalType":"address[]","name":"participants","type":"address[]"},{"indexed":false,"internalType":"string","name":"firstIpfsHash","type":"string"}],"name":"SessionCreated","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"sessionId","type":"uint256"},{"indexed":false,"internalType":"uint64","name":"timestamp","type":"uint64"},{"indexed":false,"internalType":"string","name":"ipfsHash","type":"string"},{"indexed":true,"internalType":"address","name":"participant","type":"address"}],"name":"VersionAdded","type":"event"},
  {"inputs":[{"internalType":"uint256","name":"sessionId","type":"uint256"}],"name":"getHistory","outputs":[{"internalType":"uint64[]","name":"timestamps","type":"uint64[]"},{"internalType":"string[]","name":"ipfsHashes","type":"string[]"},{"internalType":"address[]","name":"savedBys","type":"address[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"sessionId","type":"uint256"}],"name":"getLatestVersion","outputs":[{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"address","name":"savedBy","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"sessionId","type":"uint256"}],"name":"getSession","outputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint64","name":"createdAt","type":"uint64"},{"internalType":"address[]","name":"participants","type":"address[]"},{"internalType":"uint256","name":"versionCount","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"sessionId","type":"uint256"},{"internalType":"address","name":"user","type":"address"}],"name":"isParticipant","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"sessionCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
];

const CONTRACT_ADDRESS = "0xa523A357ecAD85FC02069aa12Dbc839B57C7be85";

export default function Sessions() {
  const { user, walletConnected, connectWallet } = useAuth();

  // Require wallet connection (must be before any hooks)
  if (!walletConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="bg-white/10 rounded-xl p-8 shadow-lg text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h1>
          <p className="text-gray-300 mb-6">Please connect your wallet to access collaborative sessions.</p>
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

  // UI States
  const [currentView, setCurrentView] = useState('sessions'); // 'sessions' or 'editor'
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [message, setMessage] = useState('');
  const [joinInput, setJoinInput] = useState('');
  
  // Session Management
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [creatingSession, setCreatingSession] = useState(false);
  
  // Editor States
  const editorRef = useRef(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [dockerSessionId, setDockerSessionId] = useState(null);
  
  // Collaboration States
  const [participants, setParticipants] = useState([]);
  const [chat, setChat] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [activeUsers, setActiveUsers] = useState(0);
  
  // Local Web3 States
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState('');

  // Instantiate contract locally like ExpertHelp.jsx
  useEffect(() => {
    if (window.ethereum) {
      const prov = new ethers.BrowserProvider(window.ethereum);
      prov.getSigner().then(s => {
        setProvider(prov);
        setSigner(s);
        s.getAddress().then(setUserAddress);
        setContract(new ethers.Contract(CONTRACT_ADDRESS, SESSION_LOG_ABI, s));
      });
    }
  }, []);

  // Update getWalletConnection to use local state
  const getWalletConnection = async () => {
    if (provider && signer && contract && userAddress) {
      return { provider, signer, contract, address: userAddress };
    }
    if (!window.ethereum) {
      setMessage('Please install MetaMask');
      return null;
    }
    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const browserSigner = await browserProvider.getSigner();
      const address = await browserSigner.getAddress();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, SESSION_LOG_ABI, browserSigner);
      setProvider(browserProvider);
      setSigner(browserSigner);
      setUserAddress(address);
      setContract(contractInstance);
      return { provider: browserProvider, signer: browserSigner, contract: contractInstance, address };
    } catch (error) {
      setMessage('Failed to connect wallet: ' + error.message);
      return null;
    }
  };

  // Load existing sessions
  const loadSessions = useCallback(async () => {
    if (!contract) return;
    try {
      const filter = contract.filters.SessionCreated();
      const events = await contract.queryFilter(filter, 0, 'latest');

      const sessionData = await Promise.all(
        events.map(async (event) => {
          const { sessionId, owner, createdAt, participants: eventParticipants } = event.args;
          try {
            const sessionDetails = await contract.getSession(sessionId);
            return {
              sessionId: Number(sessionId),
              owner,
              createdAt: Number(createdAt),
              participants: sessionDetails.participants,
              versionCount: Number(sessionDetails.versionCount),
            };
          } catch (err) {
            console.error(`Failed to fetch session for sessionId ${sessionId}:`, err);
            return null;
          }
        })
      );
      setSessions(sessionData.filter(Boolean));
    } catch (err) {
      setMessage('Failed to load sessions: ' + err);
    }
  }, [contract]);

  useEffect(() => {
    if (currentView === 'sessions' && contract) {
      loadSessions();
    }
  }, [currentView, contract, loadSessions]);

  // Create new session
  const handleCreateSession = async () => {
    if (!contract) {
      setMessage('Smart contract not loaded. Please connect your wallet.');
      return;
    }
    setCreatingSession(true);
    setMessage('Creating session...');
    
    try {
      // Create initial code content based on language
      const initialCode = getInitialCode(selectedLanguage);
      
      // Store code in IPFS
      const ipfsHash = await uploadSessionToIPFS(initialCode, selectedLanguage, `session-init.json`);
      
      // Create session on blockchain
      const tx = await contract.createSession([], ipfsHash);
      const receipt = await tx.wait();
      // ethers v6: parse logs for SessionCreated event
      const event = receipt.logs
        .map(log => {
          try {
            return contract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find(e => e && e.name === 'SessionCreated');
      if (!event) {
        setMessage('Failed to parse session creation event.');
        return;
      }
      const sessionId = Number(event.args.sessionId);
      
      setMessage('Session created successfully!');
      await loadSessions();
      
      // Open the newly created session
      openSession({ sessionId, language: selectedLanguage, code: initialCode });
      
    } catch (error) {
      setMessage('Failed to create session: ' + error.message);
    } finally {
      setCreatingSession(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Open existing session
  const openSession = async (session) => {
    let walletConnection;
    if (!provider || !signer || !contract || !userAddress) {
      walletConnection = await getWalletConnection();
    } else {
      walletConnection = { provider, signer, contract, address: userAddress };
    }
    const contractInstance = walletConnection?.contract;
    const address = walletConnection?.address;
    if (!contractInstance) {
      setMessage('Smart contract not loaded. Please connect your wallet.');
      return;
    }
    try {
      setMessage('Loading session...');
      // Ensure user is a participant
      const isParticipant = await contractInstance.isParticipant(session.sessionId, address);
      if (!isParticipant) {
        const tx = await contractInstance.joinSession(session.sessionId);
        await tx.wait();
      }
      // Get latest version from blockchain
      const latestVersion = await contractInstance.getLatestVersion(session.sessionId);
      const ipfsUrl = `https://ipfs.io/ipfs/${latestVersion.ipfsHash}`;
      // Fetch code and language from IPFS
      const response = await fetch(ipfsUrl);
      const text = await response.text();
      let codeFromIPFS, languageFromIPFS;
      try {
        const json = JSON.parse(text);
        codeFromIPFS = json.code;
        languageFromIPFS = json.language;
      } catch (e) {
        codeFromIPFS = text;
        languageFromIPFS = null;
      }
      // Get session participants
      const sessionDetails = await contractInstance.getSession(session.sessionId);
      setParticipants(sessionDetails.participants);
      // After loading code and language from IPFS
      if (!codeFromIPFS || !languageFromIPFS) {
        setMessage('Cannot execute: code or language missing from session.');
        return;
      }
      // Use the correct backend URL
      const res = await fetch('http://localhost:8000/api/execute/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeFromIPFS, language: languageFromIPFS }),
      });
      const data = await res.json();
      if (res.ok && data.sessionId) {
        setDockerSessionId(data.sessionId);
        setCurrentSession(session);
        setCode(codeFromIPFS);
        setSelectedLanguage(languageFromIPFS);
        setCurrentView('editor');
        setMessage('Session loaded successfully!');
        // Initialize WebSocket for real-time collaboration
        initializeWebSocket(session.sessionId);
      } else {
        setMessage('Failed to create Docker session: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      setMessage('Failed to open session: ' + error.message);
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Join session via link
  const handleJoinSession = async (sessionId) => {
    let walletConnection;
    if (!provider || !signer || !contract || !userAddress) {
      walletConnection = await getWalletConnection();
    } else {
      walletConnection = { provider, signer, contract, address: userAddress };
    }
    if (!walletConnection) return;

    const { contract, address } = walletConnection;

    try {
      setMessage('Joining session...');
      const isParticipant = await contract.isParticipant(sessionId, address);

      if (!isParticipant) {
        const tx = await contract.joinSession(sessionId);
        await tx.wait();
      }

      // Get session details and open
      const sessionDetails = await contract.getSession(sessionId);
      const session = {
        sessionId,
        language: 'javascript', // TODO: Parse language from IPFS metadata if available
        owner: sessionDetails.owner
      };

      openSession(session);
    } catch (error) {
      setMessage('Failed to join session: ' + error.message);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  // Close and save session
  const handleCloseAndSave = async () => {
    if (!contract || !currentSession) {
      setMessage('Smart contract not loaded or no session selected.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    setMessage('Saving session...');
    try {
      // Store current code in IPFS
      const ipfsHash = await uploadSessionToIPFS(code, selectedLanguage, `session-save.json`);
      
      // Save version to blockchain
      const tx = await contract.saveVersion(currentSession.sessionId, ipfsHash);
      await tx.wait();

      setMessage('Closing Docker session...');
      // Close Docker session
      if (dockerSessionId) {
        await fetch('/api/execute/session/close', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: dockerSessionId }),
        });
      }
      
      // Disconnect WebSocket
      if (wsRef.current) {
        wsRef.current.close();
      }
      
      // Return to sessions view
      setCurrentView('sessions');
      setCurrentSession(null);
      setDockerSessionId(null);
      setMessage('Session saved and closed successfully!');
      
    } catch (error) {
      setMessage('Failed to save session: ' + error.message);
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Close without saving
  const handleCloseOnly = async () => {
    setMessage('Closing session...');
    try {
      // Close Docker session
      if (dockerSessionId) {
        await fetch('/api/execute/session/close', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: dockerSessionId }),
        });
      }
      
      // Disconnect WebSocket
      if (wsRef.current) {
        wsRef.current.close();
      }
      
      // Return to sessions view
      setCurrentView('sessions');
      setCurrentSession(null);
      setDockerSessionId(null);
      setMessage('Session closed');
      
    } catch (error) {
      setMessage('Failed to close session: ' + error.message);
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Execute code
  const handleRunCode = async () => {
    if (!dockerSessionId) {
      setMessage('No active session');
      return;
    }
    
    setIsRunning(true);
    setOutput('');
    
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, sessionId: dockerSessionId }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setOutput(data.output);
      } else {
        setOutput('Error: ' + (data.error || 'Execution failed'));
      }
    } catch (error) {
      setOutput('Error: ' + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  // WebSocket for real-time collaboration
  const wsRef = useRef(null);
  
  const initializeWebSocket = (sessionId) => {
    wsRef.current = new window.WebSocket(`ws://localhost:8000/session/${sessionId}`);
    setActiveUsers(1); // Assume at least self is online immediately
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'code_change':
          if (data.userId !== userAddress) {
            setCode(data.code);
          }
          break;
        case 'chat_message':
          setChat(prev => [...prev, data.message]);
          break;
        case 'user_joined':
          setActiveUsers(data.activeUsers); // Always update to backend value
          break;
        case 'user_left':
          setActiveUsers(data.activeUsers);
          break;
        default:
          break;
      }
    };
  };

  const handleCodeChange = (value) => {
    setCode(value);
    
    // Send code changes via WebSocket
    if (wsRef.current && wsRef.current.readyState === window.WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'code_change',
        code: value,
        userId: userAddress
      }));
    }
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (chatInput.trim() && wsRef.current) {
      const message = {
        name: userAddress.slice(0, 6) + '...' + userAddress.slice(-4),
        text: chatInput,
        timestamp: Date.now()
      };
      wsRef.current.send(JSON.stringify({
        type: 'chat_message',
        message
      }));
      setChat(prev => [...prev, message]); // Add own message locally
      setChatInput('');
    }
  };

  // Utility functions
  const getInitialCode = (language) => {
    switch (language) {
      case 'javascript':
        return `// Welcome to BlockDAG DevNet Code Editor\n// Start collaborating with other developers!\n\nfunction greetBlockDAG() {\n  console.log(\"Hello, BlockDAG DevNet!\");\n  console.log(\"Let's build the future together!\");\n}\n\ngreetBlockDAG();`;
      case 'python':
        return `# Welcome to BlockDAG DevNet Code Editor\n# Start collaborating with other developers!\n\ndef greet_blockdag():\n    print(\"Hello, BlockDAG DevNet!\")\n    print(\"Let's build the future together!\")\n\ngreet_blockdag()`;
      case 'solidity':
        return `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.17;\n\ncontract HelloBlockDAG {\n    string public message = \"Hello, BlockDAG DevNet!\";\n    \n    function setMessage(string memory _message) public {\n        message = _message;\n    }\n}`;
      default:
        return '';
    }
  };

  // IPFS functions
  const getFromIPFS = async (hash, fallbackLanguage = 'javascript') => {
    // Fetch from backend IPFS proxy (or directly from IPFS if you have a gateway)
    try {
      const url = `https://ipfs.io/ipfs/${hash}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch from IPFS');
      const data = await res.json();
      // Expecting { code, language }
      setSelectedLanguage(data.language || fallbackLanguage);
      return data.code;
    } catch (e) {
      // fallback: return default code
      return getInitialCode(fallbackLanguage);
    }
  };

  // Render sessions list view
  if (currentView === 'sessions') {
    return (
      <div className="min-h-screen bg-[#15172b] py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Coding Sessions</h1>
            <div className="flex gap-4">
              <select
                className="bg-[#181b34] border border-blue-400 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedLanguage}
                onChange={e => setSelectedLanguage(e.target.value)}
              >
                {LANGUAGES.map(l => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
              <button
                onClick={handleCreateSession}
                disabled={creatingSession}
                className="bg-cyan-400 hover:bg-cyan-500 text-[#181b34] font-semibold px-6 py-3 rounded-lg shadow transition disabled:opacity-50"
              >
                {creatingSession ? 'Creating...' : 'Create Session'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div key={session.sessionId} className="bg-[#181b34] rounded-xl p-6 shadow hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white">Session #{session.sessionId}</h3>
                  <span className="bg-purple-400 text-white px-2 py-1 rounded text-sm">
                    {session.language}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4 text-sm text-gray-300">
                  <p><strong>Owner:</strong> {session.owner.slice(0, 6)}...{session.owner.slice(-4)}</p>
                  <p><strong>Participants:</strong> {session.participants.length}</p>
                  <p><strong>Versions:</strong> {session.versionCount}</p>
                  <p><strong>Created:</strong> {new Date(session.createdAt * 1000).toLocaleDateString()}</p>
                </div>
                
                <button
                  onClick={() => openSession(session)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition"
                >
                  Open Session
                </button>
              </div>
            ))}
          </div>

          {sessions.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-lg mb-4">No sessions found</div>
              <p className="text-gray-500">Create your first collaborative coding session to get started!</p>
            </div>
          )}
        </div>
        {/* Fixed notification bar for messages */}
        {message && (
          <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center">
            <div className="m-4 px-6 py-3 bg-blue-900 border border-blue-400 rounded-lg text-blue-200 shadow-xl text-lg font-medium">
              {message}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render editor view
  return (
    <div className="min-h-screen bg-[#15172b] flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-7xl flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center gap-4 bg-[#181b34] rounded-xl px-6 py-4 mb-2 shadow">
              <button
                onClick={() => setCurrentView('sessions')}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-lg"
              >
                ← Back to Sessions
              </button>
              
              <span className="text-white font-semibold">Session #{currentSession?.sessionId}</span>
              
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="bg-cyan-400 hover:bg-cyan-500 text-[#181b34] font-semibold px-6 py-2 rounded-lg shadow transition disabled:opacity-50"
              >
                {isRunning ? 'Executing...' : 'Execute'}
              </button>
              
              
              <button
                onClick={handleCloseAndSave}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
              >
                Close & Save
              </button>
              
              <button
                onClick={handleCloseOnly}
                className="bg-red-400 hover:bg-red-500 text-[#181b34] font-semibold px-6 py-2 rounded-lg shadow transition"
              >
                Close
              </button>
              
              <div className="flex-1" />
              
              {/* Active Users Display */}
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-sm font-medium">● {activeUsers} active</span>
                <div className="flex gap-2">
                  {participants.slice(0, 5).map((addr, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center border-2 border-[#23244d]">
                      <span className="text-white text-xs">{addr.slice(0, 2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Editor and Chat */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 bg-[#181b34] rounded-xl shadow p-2 min-h-[350px]">
                <Editor
                  height="350px"
                  language={selectedLanguage}
                  value={code}
                  theme="vs-dark"
                  onChange={handleCodeChange}
                  options={{ fontSize: 16, minimap: { enabled: false } }}
                />
              </div>
              
              {/* Live Chat */}
              <div className="w-full md:w-80 bg-[#181b34] rounded-xl shadow flex flex-col">
                <div className="flex items-center justify-between px-4 pt-4">
                  <span className="text-white font-semibold text-lg">Live Chat</span>
                  <span className="text-green-400 text-sm font-medium">● {activeUsers} online</span>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 min-h-[200px]">
                  {chat.map((msg, i) => (
                    <div key={i} className="text-sm">
                      <span className="font-semibold text-purple-300">{msg.name}:</span>{' '}
                      <span className="text-gray-200">{msg.text}</span>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendChat} className="flex gap-2 p-4 border-t border-[#23244d]">
                  <input
                    className="flex-1 bg-[#23244d] text-white px-3 py-2 rounded focus:outline-none"
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                  />
                  <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium">
                    Send
                  </button>
                </form>
              </div>
            </div>

            {/* Output */}
            <div className="bg-[#181b34] rounded-xl shadow mt-4 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-lg font-semibold">Output</span>
                <button 
                  onClick={() => setOutput('')} 
                  className="bg-white text-[#181b34] px-3 py-1 rounded shadow font-medium"
                >
                  Clear
                </button>
              </div>
              <pre className="min-h-[60px] text-green-300 font-mono whitespace-pre-wrap">{output}</pre>
            </div>

            {/* Fixed notification bar for messages */}
            {message && (
              <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center">
                <div className="m-4 px-6 py-3 bg-blue-900 border border-blue-400 rounded-lg text-blue-200 shadow-xl text-lg font-medium">
                  {message}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 