const AES128CBCSecretKey = process.env.NEXT_PUBLIC_AES_128_CBC_SECRET_KEY;
const AES256CBCSecretKey = process.env.NEXT_PUBLIC_AES_256_CBC_SECRET_KEY;
const ChaCha20SecretKey = process.env.NEXT_PUBLIC_CHA_CHA_20_SECRET_KEY;

async function decryptAESCBC(encryptedData, key, iv) {
  const startTime = performance.now();

  const decodedKey = new Uint8Array(
    key.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );
  const decodedIV = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
  const decodedEncryptedData = Uint8Array.from(atob(encryptedData), (c) =>
    c.charCodeAt(0)
  );

  const algorithm = {
    name: "AES-CBC",
    iv: decodedIV,
  };

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    decodedKey,
    algorithm,
    false,
    ["decrypt"]
  );

  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      algorithm,
      cryptoKey,
      decodedEncryptedData
    );
    const decoder = new TextDecoder();
    const decryptedText = decoder.decode(decryptedBuffer);

    // Parse the decrypted text as JSON
    const decryptedData = JSON.parse(decryptedText);

    const endTime = performance.now();

    return { decryptedData, timeTaken: (endTime - startTime).toFixed(2) };
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Decryption failed");
  }
}

function decrypt(encryptedText, selectedAlgo, iv) {
  console.log(encryptedText, "\n", selectedAlgo, "\n", iv);
  switch (selectedAlgo) {
    case "aes-128-cbc":
      return decryptAESCBC(encryptedText, AES128CBCSecretKey, iv);
    case "aes-256-cbc":
      return decryptAESCBC(encryptedText, AES256CBCSecretKey, iv);
    case "chacha20":
      return decryptChaCha20(encryptedText, ChaCha20SecretKey, iv);
    default:
      throw new Error("Algorithm not supported");
  }
}

export { decrypt };
