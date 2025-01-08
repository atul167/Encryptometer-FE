import React, { useEffect, useRef, useState } from "react";
import { PORT, BACKEND_URL, CRYPTO_ALGOS } from "../constants";
import { getKeys } from "@/utils/getKeys";

export default function HomePage() {
  const [selectedAlgo, setSelectedAlgo] = useState("");
  const [timeTaken, setTimeTaken] = useState(0);

  const workerRef = useRef(null);
  const keys = getKeys();

  const handleAlgoChange = (e) => {
    setSelectedAlgo(e.target.value);
  };

  const handleDecrypt = async () => {
    try {
      const url = `${BACKEND_URL}/test/api/encrypt?algorithm=${encodeURIComponent(
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
      const { encryptedData, iv, authTag } = data;

      workerRef.current.postMessage({
        encryptedData,
        selectedAlgo,
        iv,
        authTag,
        keys,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/decryptWorker.js", import.meta.url)
    );

    workerRef.current.onmessage = (event) => {
      const { decryptedData, timeTaken } = event.data;
      console.log(event.data);
      setTimeTaken(timeTaken);
    };

    workerRef.current.onerror = (err) => {
      console.log(err);
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-screen">
      <h1 className="text-3xl w-full text-center font-bold m-[100px]">
        Encryption Analysis
      </h1>
      <div className="flex flex-col w-[400px] max-w-[90%] items-center gap-[50px]">
        <div className="space-y-4">
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
