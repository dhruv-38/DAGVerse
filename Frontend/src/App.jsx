import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-gray-900 rounded-xl p-8 shadow-lg flex flex-col justify-center">
            <h2 className="text-5xl font-bold mb-4">Welcome to DAGVerse</h2>
            <p className="text-gray-300 text-lg">
              Connect your wallet to get started with decentralized development.
              Build, collaborate, and innovate securely on-chain.
            </p>
          </section>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
