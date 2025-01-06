import React, { useState } from "react";
import { PORT, BACKEND_URL, CRYPTO_ALGOS } from "../constants";
import { decrypt } from "../utils/decrypt";

export default function HomePage() {
  const [selectedAlgo, setSelectedAlgo] = useState("");
  const [timeTaken, setTimeTaken] = useState(0);
  const handleAlgoChange = (e) => {
    setSelectedAlgo(e.target.value);
  };

  const handleDecrypt = async () => {
    if (!selectedAlgo) {
      console.log("Please select an algorithm.");
      return;
    }
    try {
      const url = `${BACKEND_URL}:${PORT}/test/api/encrypt?algorithm=${encodeURIComponent(
        selectedAlgo
      )}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      const ciphertext = data.encryptedData;
      const iv = data.iv;
      const { decryptedData, timeTaken } = await decrypt(
        ciphertext,
        selectedAlgo,
        iv
      );
      setTimeTaken(timeTaken);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-[50px]">
      <h1 className="text-3xl font-bold mb-6">Encryption Analysis</h1>
      <div className="w-full max-w-md space-y-4">
        <select
          value={selectedAlgo}
          onChange={handleAlgoChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
        >
          <option value="">-- Choose Algorithm --</option>
          {CRYPTO_ALGOS.map((algo) => (
            <option key={algo.value} value={algo.value}>
              {algo.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleDecrypt}
          className="bg-blue-600 text-white rounded h-8 hover:bg-blue-700 transition-colors w-full"
        >
          {selectedAlgo
            ? `Decrypt using ${selectedAlgo}`
            : "Please select an algorithm"}
        </button>
      </div>
      <div>Time taken to decrypt: {timeTaken}ms</div>
    </div>
  );
}
