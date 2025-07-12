export default function Sidebar({ onSelect }) {
  const items = [
    "Dashboard",
    "Sessions",
    "Collaborative Editor",
    "Real-time Chat",
    "Recent Work",
    "Contributors",
    "Expert Help",
    "Profile",
  ];

  return (
    <aside className="bg-gray-900 text-white w-64 flex-shrink-0 h-full p-4 border-r border-gray-800">
      <h2 className="text-xl font-bold mb-6">DAGVerse</h2>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item}>
            <button
              onClick={() => onSelect(item)}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-800 transition"
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
