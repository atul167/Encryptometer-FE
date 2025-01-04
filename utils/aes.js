import CryptoJS from "crypto-js";

export function decryptAES(encryptedText, key, iv) {
  const keyWords = CryptoJS.enc.Hex.parse(key); // Parse key
  const ivWords = CryptoJS.enc.Hex.parse(iv); // Parse IV

  const encryptedBase64 = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Hex.parse(encryptedText)
  );
  const start = performance.now(); // Start time measurement

  const decrypted = CryptoJS.AES.decrypt(encryptedBase64, keyWords, {
    iv: ivWords,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const decryptedText = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

  const end = performance.now(); // End time measurement
  const decryptionTime = end - start; // Time in milliseconds
  console.log("Decrypted text is", decryptedText);
  console.log(`Decryption Time: ${decryptionTime.toFixed(3)}ms`);
}
