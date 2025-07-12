export default function Navbar({ user }) {
  return (
    <header className="flex items-center justify-between bg-gray-950 px-6 py-4 border-b border-gray-800 shadow">
      <h1 className="text-2xl font-bold text-white">DAGVerse Developer Hub</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-300">{user?.name || "User"}</span>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded transition">
          Connect Wallet
        </button>
      </div>
    </header>
  );
}
