import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode on body
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  // Mock data for table
  const mockData = [
    { id: 1, name: 'John Doe', role: 'Developer', status: 'Active', lastLogin: '2026-02-25 09:15' },
    { id: 2, name: 'Jane Smith', role: 'Analyst', status: 'Away', lastLogin: '2026-02-24 14:30' },
    { id: 3, name: 'Alex Tan', role: 'Manager', status: 'Active', lastLogin: '2026-02-25 08:45' },
    { id: 4, name: 'Sara Lee', role: 'Designer', status: 'Offline', lastLogin: '2026-02-23 17:20' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <header className="bg-blue-700 text-white p-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Internal Dashboard</h1>
          <button
            onClick={toggleDarkMode}
            className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">Active Users</h2>
            <p className="text-4xl font-bold">1,456</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">System Health</h2>
            <p className="text-4xl font-bold">100%</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2 text-yellow-600 dark:text-yellow-400">Alerts</h2>
            <p className="text-4xl font-bold">4</p>
          </div>
        </div>

        {/* Mock Table */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4">User Activity Log</h2>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Login</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {mockData.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      user.status === 'Away' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Interactive Counter Card */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md max-w-md mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-6">Interactive Demo</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg text-xl transition-all duration-200 shadow-md hover:shadow-xl"
            onClick={() => setCount((count) => count + 1)}
          >
            Count is {count}
          </button>
          <p className="mt-6 text-gray-600 dark:text-gray-400">
            Click to test React state management
          </p>
        </div>

        {/* Chart Placeholder */}
        <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Performance Chart (Placeholder)</h2>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Chart.js / Recharts placeholder – to be implemented</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;