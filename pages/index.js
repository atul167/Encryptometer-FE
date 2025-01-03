// pages/index.js
import React, { useState } from 'react';
import { PORT, BACKEND_URL } from '../constants';

export default function HomePage() {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", inputValue);

    // For backend calling, 
    // fetch(`${BACKEND_URL}:${PORT}/api/endpoint`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ input: inputValue }),
    // })
    //   .then((res) => res.json())
    //   .then((data) => console.log(data))
    //   .catch((error) => console.error(error));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Welcome to My Next.js App</h1>

      <p className="mb-4 text-gray-700">
        Communicating with backend at <strong>{BACKEND_URL}:{PORT}</strong>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-3 w-full max-w-sm">
        <input
          type="text"
          placeholder="Enter some text..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
        />
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
