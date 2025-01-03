import React, { useState } from "react";
import { PORT, BACKEND_URL, CRYPTO_ALGOS, DECRYPT_KEY_AES,SAMPLE_TEXT} from "../constants";
import { decryptAES } from "../utils/"; // Import the decrypt function
import { enc } from "crypto-js";

export default function HomePage() {
  const [selectedAlgo, setSelectedAlgo] = useState("");
  const [encryptedText, setEncryptedText] = useState(SAMPLE_TEXT); // Store encrypted text
  const [decryptedText, setDecryptedText] = useState("123"); // Store decrypted text

  const handleAlgoChange = (e) => {
    setSelectedAlgo(e.target.value);
  };

  const handleEncrypt = async () => {
    if (!selectedAlgo) {
      console.log("Select please");
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}:${PORT}/api/encrypt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          algorithm: selectedAlgo,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDecryptAES = () => {
    try {
      // console.log(encryptedText,DECRYPT_KEY_AES)
      console.log(decryptAES)
      const decrypted = decryptAES(encryptedText, DECRYPT_KEY_AES);
      // console.log(decrypted);
      setDecryptedText(decrypted);
    } catch (err) {
      console.log("Decryption failed:", err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-6">Encrypt/Decrypt</h1>
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
        <div className="text-center p-4">Selected algorithm: {selectedAlgo}</div>
        <button
          onClick={handleEncrypt}
          className='bg-blue-600 text-white rounded h-8 hover:bg-blue-700 transition-colors w-full'
        > Encrypt Text</button>
          
        {/* Decrypt Buttons */}
        <button
          onClick={handleDecryptAES}
          className="bg-red-600 text-white rounded h-10 hover:bg-red-700 transition-colors w-full"
        >
          Decrypt using AES
        </button>

        <button
          onClick={handleDecryptAES}
          className="bg-green-600 text-white rounded h-10 hover:bg-green-700 transition-colors w-full"
          disabled={!encryptedText} // Disable if no encrypted text
        >
          Decrypt using AES
        </button>

        <button
          onClick={handleDecryptAES}
          className="bg-purple-600 text-white rounded h-10 hover:bg-purple-700 transition-colors w-full"
        >
          Decrypt using AES
        </button>

        {encryptedText && (
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
            <h2 className="text-lg font-semibold">Encrypted Text:</h2>
            <p className="break-all">{encryptedText}</p>
          </div>
        )}

        {decryptedText && (
          <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">
            <h2 className="text-lg font-semibold">Decrypted Text:</h2>
            <p className="break-all">{decryptedText}</p>
          </div>
        )}

      </div>
    </div>
  );
}