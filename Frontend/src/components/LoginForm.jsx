export default function LoginForm() {
  return (
    <div className="bg-gray-900 rounded-xl p-8 shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Register / Login</h2>
      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Password</label>
          <input
            type="password"
            placeholder="********"
            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
          />
        </div>
        <div className="flex justify-between gap-4 mt-6">
          <button
            type="button"
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg transition"
          >
            Register
          </button>
          <button
            type="submit"
            className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg transition"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
