import CryptoJS from 'crypto-js';

export const decryptAES = (encryptedText, key) => {
    // console.log(encryptedText,key)
    const bytes = CryptoJS.AES.decrypt(encryptedText, key);
  return bytes.toString(CryptoJS.enc.Utf8); // Convert back to the original text
};
