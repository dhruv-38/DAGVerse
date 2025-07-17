import { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';

const DEMO_CHAT = [
  { name: 'Bob Wilson', text: 'Looking good! Need help with the frontend integration?' },
  { name: 'David Kumar', text: 'I can help with the API endpoints' },
  { name: 'Carol Singh', text: 'Great progress on the smart contract!' },
  { name: 'Carol Singh', text: 'Ready for code review' },
  { name: 'Alice Chen', text: ",Let's test the integration" },
];

const DEMO_USERS = [
  { name: 'Bob Wilson' },
  { name: 'David Kumar' },
  { name: 'Carol Singh' },
];

const LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'Solidity', value: 'solidity' },
];

export default function CollaborativeEditor() {
  const editorRef = useRef(null);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(`// Welcome to BlockDAG DevNet Code Editor\n// Start collaborating with other developers!\n\nfunction greetBlockDAG() {\n  console.log(\"Hello, BlockDAG DevNet!\");\n  console.log(\"Let's build the future together!\");\n}\n\ngreetBlockDAG();`);
  const [chat, setChat] = useState(DEMO_CHAT);
  const [chatInput, setChatInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [creatingSession, setCreatingSession] = useState(false);

  // Create session
  const handleCreateSession = async () => {
    setCreatingSession(true);
    setMessage('Creating session...');
    try {
      const res = await fetch('/api/execute/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language }),
      });
      const data = await res.json();
      if (res.ok && data.sessionId) {
        setSessionId(data.sessionId);
        setMessage('Session created!');
      } else {
        setMessage('Failed to create session: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setMessage('Failed to create session: ' + err.message);
    } finally {
      setCreatingSession(false);
      setTimeout(() => setMessage(''), 2000);
    }
  };

  // Close session
  const handleCloseSession = async () => {
    if (!sessionId) return;
    setMessage('Closing session...');
    try {
      const res = await fetch('/api/execute/session/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      if (res.ok) {
        setSessionId(null);
        setMessage('Session closed.');
        setOutput('');
      } else {
        setMessage('Failed to close session');
      }
    } catch (err) {
      setMessage('Failed to close session: ' + err.message);
    } finally {
      setTimeout(() => setMessage(''), 2000);
    }
  };

  // Real code execution (now session-aware)
  const handleRun = async () => {
    if (!sessionId) {
      setMessage('Please create a session first.');
      return;
    }
    setIsRunning(true);
    setOutput('');
    setMessage('');
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, sessionId }),
      });
      const data = await res.json();
      if (res.ok) {
        setOutput(data.output);
      } else {
        setOutput('Error: ' + (data.error || 'Execution failed'));
      }
    } catch (err) {
      setOutput('Error: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  // Stub: Simulate session share
  const handleShareSession = () => {
    setMessage('Session link copied! (In MVP, this would share a collaborative session link.)');
    setTimeout(() => setMessage(''), 2000);
  };

  // Stub: Clear output
  const handleClear = () => setOutput('');

  // Stub: Send chat message
  const handleSendChat = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      setChat([...chat, { name: 'You', text: chatInput }]);
      setChatInput('');
    }
  };

  return (
    <div className="min-h-screen bg-[#15172b] flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-6">
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Session Controls */}
          {!sessionId ? (
            <div className="flex flex-col items-center justify-center py-16">
              <select
                className="bg-transparent border border-blue-400 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                value={language}
                onChange={e => setLanguage(e.target.value)}
              >
                {LANGUAGES.map(l => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
              <button
                onClick={handleCreateSession}
                disabled={creatingSession}
                className="bg-cyan-400 hover:bg-cyan-500 text-[#181b34] font-semibold px-8 py-3 rounded-lg shadow transition disabled:opacity-50"
              >
                {creatingSession ? 'Creating Session...' : 'Create Session'}
              </button>
              {message && <div className="mt-4 text-blue-300 font-medium text-center">{message}</div>}
            </div>
          ) : (
            <>
              {/* Top Bar */}
              <div className="flex flex-wrap items-center gap-4 bg-[#181b34] rounded-xl px-6 py-4 mb-2 shadow">
                <select
                  className="bg-transparent border border-blue-400 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  disabled
                >
                  {LANGUAGES.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="bg-cyan-400 hover:bg-cyan-500 text-[#181b34] font-semibold px-6 py-2 rounded-lg shadow transition disabled:opacity-50"
                >
                  {isRunning ? 'Executing...' : 'Execute'}
                </button>
                <button
                  onClick={handleShareSession}
                  className="bg-[#23244d] border border-[#3b3c6c] text-white font-medium px-6 py-2 rounded-lg shadow flex items-center gap-2 hover:bg-[#2d2e5a]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Share Session
                </button>
                <button
                  onClick={handleCloseSession}
                  className="bg-red-400 hover:bg-red-500 text-[#181b34] font-semibold px-6 py-2 rounded-lg shadow transition"
                >
                  Close Session
                </button>
                <div className="flex-1" />
                {/* User Avatars */}
                <div className="flex gap-2">
                  {DEMO_USERS.map((u, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center border-2 border-[#23244d]">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-2.21 0-8 1.11-8 3.33V18a2 2 0 002 2h12a2 2 0 002-2v-2.67C18 13.11 12.21 12 10 12z" /></svg>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editor */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-[#181b34] rounded-xl shadow p-2 min-h-[350px]">
                  <Editor
                    height="350px"
                    language={language}
                    value={code}
                    theme="vs-dark"
                    onChange={v => setCode(v || '')}
                    options={{ fontSize: 16, minimap: { enabled: false } }}
                  />
                </div>
                {/* Live Chat */}
                <div className="w-full md:w-80 bg-[#181b34] rounded-xl shadow flex flex-col">
                  <div className="flex items-center justify-between px-4 pt-4">
                    <span className="text-white font-semibold text-lg">Live Chat</span>
                    <span className="text-green-400 text-sm font-medium">● {DEMO_USERS.length} online</span>
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
                    {chat.map((msg, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-semibold text-purple-300">{msg.name}:</span> <span className="text-gray-200">{msg.text}</span>
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
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium">Send</button>
                  </form>
                </div>
              </div>

              {/* Output */}
              <div className="bg-[#181b34] rounded-xl shadow mt-4 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-lg font-semibold">Output</span>
                  <button onClick={handleClear} className="bg-white text-[#181b34] px-3 py-1 rounded shadow font-medium">Clear</button>
                </div>
                <pre className="min-h-[60px] text-green-300 font-mono whitespace-pre-wrap">{output}</pre>
              </div>

              {message && (
                <div className="mt-2 text-blue-300 font-medium text-center">{message}</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}