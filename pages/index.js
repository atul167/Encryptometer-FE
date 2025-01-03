// pages/index.js
import React, { useState } from 'react';
import { PORT, BACKEND_URL } from '../constants';

export default function HomePage() {
  const [selectedAlgo, setSelectedAlgo] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // List of algorithms
  const cryptoAlgos = [
    { value: 'aes', label: 'AES' },
    { value: 'ssh', label: 'SSH' },
    { value: 'rsa', label: 'RSA' },
    { value: 'chacha', label: 'ChaCha' },
  ];

  const handleAlgoChange = (e) => {
    setSelectedAlgo(e.target.value);
  };
  const handleEncrypt = async () => {
    // Reset previous states
    setEncryptedText('');
    setError(null);

    if (!selectedAlgo) {
      setError('Please select a crypto algorithm.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}:${PORT}/api/encrypt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          algorithm: selectedAlgo,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Assuming your backend returns { encryptedText: "..." }
      setEncryptedText(data.encryptedText);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-6">Crypto Encryptor</h1>

      <div className="w-full max-w-md space-y-4">
        <select
          value={selectedAlgo}
          onChange={handleAlgoChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
        >
          <option value="">-- Choose Algorithm --</option>
          {cryptoAlgos.map((algo) => (
            <option key={algo.value} value={algo.value}>
              {algo.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleEncrypt}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Encrypting...' : 'Encrypt'}
        </button>

        {/* Display Encrypted Text */}
        {encryptedText && (
          <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">
            <h2 className="text-xl font-semibold mb-2">Encrypted Text:</h2>
            <p className="break-all">{encryptedText}</p>
          </div>
        )}

        {/* Display Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}


// For backend calling, 
    // fetch(`${BACKEND_URL}:${PORT}/api/endpoint`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ input: inputValue }),
    // })
    //   .then((res) => res.json())
    //   .then((data) => console.log(data))
    //   .catch((error) => console.error(error));