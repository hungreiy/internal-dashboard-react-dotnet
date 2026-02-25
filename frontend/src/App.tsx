import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTable, useSortBy } from '@tanstack/react-table';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  // Mock chart data
  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 500 },
    { name: 'Apr', value: 280 },
    { name: 'May', value: 590 },
    { name: 'Jun', value: 490 },
  ];

  // Mock table data
  const tableData = [
    { id: 1, name: 'John Doe', role: 'Developer', status: 'Active', lastLogin: '2026-02-25 09:15' },
    { id: 2, name: 'Jane Smith', role: 'Analyst', status: 'Away', lastLogin: '2026-02-24 14:30' },
    { id: 3, name: 'Alex Tan', role: 'Manager', status: 'Active', lastLogin: '2026-02-25 08:45' },
    { id: 4, name: 'Sara Lee', role: 'Designer', status: 'Offline', lastLogin: '2026-02-23 17:20' },
  ];

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Role', accessor: 'role' },
    { Header: 'Status', accessor: 'status' },
    { Header: 'Last Login', accessor: 'lastLogin' },
  ];

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    { columns, data: tableData },
    useSortBy
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
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

      <main className="container mx-auto p-6">
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

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4">User Activity Log</h2>
          <table {...getTableProps()} className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    >
                      {column.render('Header')}
                      <span>{column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}</span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap text-sm">
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Performance Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#64748b'} />
              <YAxis stroke={darkMode ? '#9ca3af' : '#64748b'} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff', borderColor: darkMode ? '#374151' : '#e5e7eb' }} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}

export default App;