export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-white">Dashboard</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-lg p-4 shadow">
          <h3 className="text-xl font-bold mb-2">Contributors</h3>
          <p className="text-gray-400">List of active contributors and their recent work.</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 shadow">
          <h3 className="text-xl font-bold mb-2">Recent Activity</h3>
          <p className="text-gray-400">Recent commits, sessions, and edits.</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 shadow">
          <h3 className="text-xl font-bold mb-2">Sessions (Code Editor)</h3>
          <p className="text-gray-400">Start or join collaborative coding sessions.</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 shadow">
          <h3 className="text-xl font-bold mb-2">Expert Help</h3>
          <p className="text-gray-400">Find and consult Web3 experts for bounties or questions.</p>
        </div>
      </div>
    </div>
  );
}
