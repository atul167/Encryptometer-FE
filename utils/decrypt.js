const AES128CBCSecretKey = process.env.NEXT_PUBLIC_AES_128_CBC_SECRET_KEY;
const AES256CBCSecretKey = process.env.NEXT_PUBLIC_AES_256_CBC_SECRET_KEY;
const ChaCha20SecretKey = process.env.NEXT_PUBLIC_CHA_CHA_20_SECRET_KEY;
const AES256GCMSecretKey = process.env.NEXT_PUBLIC_AES_256_GCM_SECRET_KEY;
const AES128GCMSecretKey = process.env.NEXT_PUBLIC_AES_128_GCM_SECRET_KEY;

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
    const decryptedData = JSON.parse(decryptedText);
    const endTime = performance.now();

    return { decryptedData, timeTaken: (endTime - startTime).toFixed(2) };
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Decryption failed");
  }
}

async function decryptChaCha20(encryptedData, key, iv) {
  const startTime = performance.now();

  await sodium.ready;
  const decodedKey = Uint8Array.from(
    key.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );
  const decodedIV = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
  const decodedEncryptedData = Uint8Array.from(atob(encryptedData), (c) =>
    c.charCodeAt(0)
  );

  try {
    const decrypted = sodium.crypto_stream_chacha20_xor(
      decodedEncryptedData,
      decodedIV,
      decodedKey
    );
    const decoder = new TextDecoder();
    const decryptedText = decoder.decode(decrypted);

    const decryptedData = JSON.parse(decryptedText);
    const endTime = performance.now();
    return { decryptedData, timeTaken: (endTime - startTime).toFixed(2) };
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Decryption failed");
  }
}

async function decryptAESGCM(encryptedData, key, iv, authTag) {
  const startTime = performance.now();

  const decodedKey = new Uint8Array(
    key.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );
  const decodedIV = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
  const decodedEncryptedData = Uint8Array.from(atob(encryptedData), (c) =>
    c.charCodeAt(0)
  );
  const decodedAuthTag = Uint8Array.from(atob(authTag), (c) => c.charCodeAt(0));

  const combinedCiphertext = new Uint8Array(
    decodedEncryptedData.length + decodedAuthTag.length
  );
  combinedCiphertext.set(decodedEncryptedData);
  combinedCiphertext.set(decodedAuthTag, decodedEncryptedData.length);

  try {
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      decodedKey,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: decodedIV,
      },
      cryptoKey,
      combinedCiphertext
    );

    const decoder = new TextDecoder();
    const decryptedText = decoder.decode(decryptedBuffer);

    const decryptedData = JSON.parse(decryptedText);
    const endTime = performance.now();
    return { decryptedData, timeTaken: (endTime - startTime).toFixed(2) };
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Decryption failed");
  }
}

function decrypt(encryptedText, selectedAlgo, iv, authTag) {
  if (!encryptedText || !selectedAlgo || !iv) {
    throw new Error("Missing required parameters for decryption.");
  }

  switch (selectedAlgo) {
    case "aes-128-cbc":
      return decryptAESCBC(encryptedText, AES128CBCSecretKey, iv);
    case "aes-256-cbc":
      return decryptAESCBC(encryptedText, AES256CBCSecretKey, iv);
    case "aes-128-gcm":
      return decryptAESGCM(encryptedText, AES128GCMSecretKey, iv, authTag);
    case "aes-256-gcm":
      return decryptAESGCM(encryptedText, AES256GCMSecretKey, iv, authTag);
    case "chacha20":
      return decryptChaCha20(encryptedText, ChaCha20SecretKey, iv, authTag);
    default:
      throw new Error(`Algorithm "${selectedAlgo}" is not supported.`);
  }
}

export { decrypt };
