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
      const authTag = data.authTag;
      const { decryptedData, timeTaken } = await decrypt(
        ciphertext,
        selectedAlgo,
        iv,
        authTag
      );
      setTimeTaken(timeTaken);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-screen">
      <h1 className="text-3xl font-bold m-[100px]">Encryption Analysis</h1>
      <div className="flex flex-col items-center gap-[50px]">
        <div className="w-[400px] space-y-4">
          <select
            value={selectedAlgo}
            onChange={handleAlgoChange}
            className="border border-black rounded-lg cursor-pointer py-2 focus:outline-none w-full"
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
            className="bg-black border-black border text-white rounded h-8 hover:bg-white hover:text-black w-full"
          >
            {selectedAlgo
              ? `Decrypt using ${selectedAlgo}`
              : "Please select an algorithm"}
          </button>
        </div>
        <div className="flex flex-col justify-center items-center gap-[10px]">
          <span className="text-[20px]">Time taken to decrypt</span>
          <span className="text-[40px] font-bold">{timeTaken}ms</span>
        </div>
      </div>
    </div>
  );
}
