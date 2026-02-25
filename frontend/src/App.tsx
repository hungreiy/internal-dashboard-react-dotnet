import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Hello from Dashboard!</h1>
      <button
        className="bg-blue-600 text-white px-8 py-4 rounded-lg text-2xl hover:bg-blue-700"
        onClick={() => setCount(count + 1)}
      >
        Count: {count}
      </button>
      <p className="mt-6 text-gray-600">If you see this, React + TS is working</p>
    </div>
  );
}

export default App;