import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import Crypto from "crypto";
import {
  PORT,
  BACKEND_URL,
  CRYPTO_ALGOS,
  DECRYPT_KEY_AES,
  SAMPLE_TEXT,
  OBJ,
} from "../constants";
import { decryptAES } from "../utils/";

export default function HomePage() {
  const [selectedAlgo, setSelectedAlgo] = useState("");
  const handleAlgoChange = (e) => {
    setSelectedAlgo(e.target.value);
  };

  const handleEncrypt = async () => {
    if (!selectedAlgo) {
      console.log("Please select an algorithm.");
      return;
    }
    try {
      const response = await fetch(
        `${BACKEND_URL}:${PORT}/test/api/encrypt?algorithm=${encodeURIComponent(
          selectedAlgo
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      const ciphertext = data.encryptedData;
      const iv = data.iv;
      console.log("Encrypted Info:", ciphertext, iv);
      decryptAES(ciphertext, DECRYPT_KEY_AES, iv);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDecryptAES = (ciphertext, key, iv) => {
    const decrypted = decryptAES(ciphertext, key, iv);
    if (decrypted) {
      console.log("Decrypted Text:", decrypted);
    } else {
      console.log("Decryption failed.");
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
        <div className="text-center p-4">
          Selected algorithm: {selectedAlgo}
        </div>
        <button
          onClick={handleEncrypt}
          className="bg-blue-600 text-white rounded h-8 hover:bg-blue-700 transition-colors w-full"
        >
          {" "}
          Get Details
        </button>

        {/* Decrypt Buttons */}
        <button
          onClick={handleDecryptAES}
          className="bg-red-600 text-white rounded h-10 hover:bg-red-700 transition-colors w-full"
        >
          Decrypt using AES
        </button>


        <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
          <h2 className="text-lg font-semibold">Encrypted Text:</h2>
        </div>
      </div>
    </div>
  );
}
