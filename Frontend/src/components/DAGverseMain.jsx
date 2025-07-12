import Navbar from './components/Navbar';

export default function DAGverseMain() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Top Navbar */}
      <Navbar user={{ name: "Sreedhar" }} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="bg-gray-900 w-64 p-6 hidden md:block border-r border-gray-800">
          <h2 className="text-2xl font-bold mb-6">DAGVerse</h2>
          <nav className="space-y-4">
            <a href="#" className="block px-3 py-2 rounded hover:bg-gray-800">Dashboard</a>
            <a href="#" className="block px-3 py-2 rounded hover:bg-gray-800">Collaborative Editor</a>
            <a href="#" className="block px-3 py-2 rounded hover:bg-gray-800">Real-time Chat</a>
            <a href="#" className="block px-3 py-2 rounded hover:bg-gray-800">Recent Work</a>
            <a href="#" className="block px-3 py-2 rounded hover:bg-gray-800">Contributors</a>
            <a href="#" className="block px-3 py-2 rounded hover:bg-gray-800">Expert Help</a>
            <a href="#" className="block px-3 py-2 rounded hover:bg-gray-800">Profile</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Welcome, Sreedhar 👋</h1>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-lg p-6 shadow">
              <h2 className="text-xl font-bold mb-2">Collaborative Editor</h2>
              <p className="text-gray-400">Work with your team in real-time using conflict-free code editing.</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 shadow">
              <h2 className="text-xl font-bold mb-2">Real-time Chat</h2>
              <p className="text-gray-400">Discuss ideas and issues instantly with collaborators.</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 shadow">
              <h2 className="text-xl font-bold mb-2">Recent Work</h2>
              <p className="text-gray-400">Quick access to your latest coding sessions and files.</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 shadow">
              <h2 className="text-xl font-bold mb-2">Contributors</h2>
              <p className="text-gray-400">View your team members and their recent activity.</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 shadow">
              <h2 className="text-xl font-bold mb-2">Expert Help</h2>
              <p className="text-gray-400">Get on-chain, trustless help from blockchain experts.</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 shadow">
              <h2 className="text-xl font-bold mb-2">Profile</h2>
              <p className="text-gray-400">Manage your personal information and connected wallet.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
