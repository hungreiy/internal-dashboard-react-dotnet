import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <header className="bg-blue-700 text-white p-6 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Internal Dashboard</h1>
          <p className="mt-1 text-lg opacity-90">React + TypeScript + Tailwind CSS</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">Active Users</h2>
            <p className="text-4xl font-bold">1,456</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">System Health</h2>
            <p className="text-4xl font-bold">100%</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-yellow-600 dark:text-yellow-400">Active Alerts</h2>
            <p className="text-4xl font-bold">4</p>
          </div>
        </div>

        {/* Interactive Counter Card */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md max-w-md mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-6">Interactive Demo</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 shadow-md hover:shadow-lg"
            onClick={() => setCount((count) => count + 1)}
          >
            Count is {count}
          </button>
          <p className="mt-6 text-gray-600 dark:text-gray-400">
            Click the button above – state updates in real-time (React useState demo)
          </p>
        </div>

        <p className="mt-10 text-center text-gray-500 dark:text-gray-400">
          Edit <code>src/App.tsx</code> and save – changes appear instantly (HMR)
        </p>
      </main>
    </div>
  );
}

export default App;