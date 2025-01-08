self.onmessage = async (event) => {
  const { encryptedData, selectedAlgo, iv, authTag, keys } = event.data;

  const {
    AES128CBCSecretKey,
    AES256CBCSecretKey,
    AES128GCMSecretKey,
    AES256GCMSecretKey,
    ChaCha20SecretKey,
  } = keys;

  try {
    // Utility functions for decryption
    async function decryptAESCBC(encryptedData, key, iv) {
      const startTime = performance.now();

      const decodedKey = new Uint8Array(
        key.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
      );
      const decodedIV = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
      const decodedEncryptedData = Uint8Array.from(atob(encryptedData), (c) =>
        c.charCodeAt(0)
      );

      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        decodedKey,
        { name: "AES-CBC", iv: decodedIV },
        false,
        ["decrypt"]
      );

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-CBC", iv: decodedIV },
        cryptoKey,
        decodedEncryptedData
      );

      const decoder = new TextDecoder();
      const decryptedText = decoder.decode(decryptedBuffer);
      const decryptedData = JSON.parse(decryptedText);

      const endTime = performance.now();
      return { decryptedData, timeTaken: (endTime - startTime).toFixed(2) };
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
      const decodedAuthTag = Uint8Array.from(atob(authTag), (c) =>
        c.charCodeAt(0)
      );

      const combinedCiphertext = new Uint8Array(
        decodedEncryptedData.length + decodedAuthTag.length
      );
      combinedCiphertext.set(decodedEncryptedData);
      combinedCiphertext.set(decodedAuthTag, decodedEncryptedData.length);

      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        decodedKey,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: decodedIV },
        cryptoKey,
        combinedCiphertext
      );

      const decoder = new TextDecoder();
      const decryptedText = decoder.decode(decryptedBuffer);
      const decryptedData = JSON.parse(decryptedText);

      const endTime = performance.now();
      return { decryptedData, timeTaken: (endTime - startTime).toFixed(2) };
    }

    async function decryptChaCha20Poly1305(encryptedData, key, iv, authTag) {
      const startTime = performance.now();

      try {
        // Input validation
        if (!encryptedData || !key || !iv || !authTag) {
          throw new Error(
            "Missing required parameters. Need encryptedData, key, iv, and authTag."
          );
        }

        // Decode hex key (similar to AES functions)
        const decodedKey = new Uint8Array(
          key.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
        );

        // Decode base64 strings
        const decodedIV = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
        const decodedEncryptedData = Uint8Array.from(atob(encryptedData), (c) =>
          c.charCodeAt(0)
        );
        const decodedAuthTag = Uint8Array.from(atob(authTag), (c) =>
          c.charCodeAt(0)
        );

        // Validate decoded lengths
        if (decodedKey.length !== 32) {
          throw new Error(
            `Invalid key length: ${decodedKey.length} bytes. Expected 32 bytes.`
          );
        }
        if (decodedIV.length !== 12) {
          throw new Error(
            `Invalid IV length: ${decodedIV.length} bytes. Expected 12 bytes.`
          );
        }

        // Log lengths for debugging
        console.log("Decoded lengths:", {
          keyLength: decodedKey.length,
          ivLength: decodedIV.length,
          encryptedDataLength: decodedEncryptedData.length,
          authTagLength: decodedAuthTag.length,
        });

        // Combine encrypted data and auth tag
        const combinedCiphertext = new Uint8Array(
          decodedEncryptedData.length + decodedAuthTag.length
        );
        combinedCiphertext.set(decodedEncryptedData);
        combinedCiphertext.set(decodedAuthTag, decodedEncryptedData.length);

        // Check if ChaCha20-Poly1305 is supported
        if (!crypto.subtle.importKey) {
          throw new Error("SubtleCrypto.importKey is not available");
        }

        // First try with hyphen
        try {
          const cryptoKey = await crypto.subtle.importKey(
            "raw",
            decodedKey,
            { name: "CHACHA20-POLY1305" },
            false,
            ["decrypt"]
          );

          const decryptedBuffer = await crypto.subtle.decrypt(
            { name: "CHACHA20-POLY1305", iv: decodedIV },
            cryptoKey,
            combinedCiphertext
          );

          const decoder = new TextDecoder();
          const decryptedText = decoder.decode(decryptedBuffer);
          const decryptedData = JSON.parse(decryptedText);

          const endTime = performance.now();
          return {
            decryptedData,
            timeTaken: (endTime - startTime).toFixed(2),
          };
        } catch (error) {
          // If hyphenated version fails, try without hyphen
          try {
            const cryptoKey = await crypto.subtle.importKey(
              "raw",
              decodedKey,
              { name: "CHACHA20POLY1305" },
              false,
              ["decrypt"]
            );

            const decryptedBuffer = await crypto.subtle.decrypt(
              { name: "CHACHA20POLY1305", iv: decodedIV },
              cryptoKey,
              combinedCiphertext
            );

            const decoder = new TextDecoder();
            const decryptedText = decoder.decode(decryptedBuffer);
            const decryptedData = JSON.parse(decryptedText);

            const endTime = performance.now();
            return {
              decryptedData,
              timeTaken: (endTime - startTime).toFixed(2),
            };
          } catch (innerError) {
            throw new Error(
              "ChaCha20-Poly1305 is not supported in this browser: " +
                innerError.message
            );
          }
        }
      } catch (error) {
        console.error("Decryption error:", {
          name: error.name,
          message: error.message,
          inputs: {
            hasEncryptedData: !!encryptedData,
            hasKey: !!key,
            hasIV: !!iv,
            hasAuthTag: !!authTag,
          },
        });
        throw new Error(`Decryption failed: ${error.message}`);
      }
    }

    // Algorithm selector
    let result;
    switch (selectedAlgo) {
      case "aes-128-cbc":
        result = await decryptAESCBC(encryptedData, AES128CBCSecretKey, iv);
        break;
      case "aes-256-cbc":
        result = await decryptAESCBC(encryptedData, AES256CBCSecretKey, iv);
        break;
      case "aes-128-gcm":
        result = await decryptAESGCM(
          encryptedData,
          AES128GCMSecretKey,
          iv,
          authTag
        );
        break;
      case "aes-256-gcm":
        result = await decryptAESGCM(
          encryptedData,
          AES256GCMSecretKey,
          iv,
          authTag
        );
        break;
      case "chacha20":
        result = await decryptChaCha20Poly1305(
          encryptedData,
          ChaCha20SecretKey,
          iv,
          authTag
        );
        break;
      default:
        throw new Error(`Something went wrong.`);
    }
    // Send result back to main thread
    self.postMessage(result);
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};
