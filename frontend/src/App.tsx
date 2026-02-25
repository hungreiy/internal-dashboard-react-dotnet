import { useState } from 'react';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="mb-8 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Toggle Dark Mode ({darkMode ? 'ON' : 'OFF'})
      </button>

      <h1 className="text-5xl font-bold mb-6">Internal Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">Users</h2>
          <p className="text-4xl">1,456</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">Status</h2>
          <p className="text-4xl text-green-500">OK</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">Alerts</h2>
          <p className="text-4xl text-yellow-500">3</p>
        </div>
      </div>

      <button
        className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl hover:bg-blue-700"
        onClick={() => setCount(count + 1)}
      >
        Count: {count}
      </button>

      <p className="mt-8 text-lg">If you see this, React is rendering correctly.</p>
    </div>
  );
}

export default App;