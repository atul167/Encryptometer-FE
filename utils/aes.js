import CryptoJS from "crypto-js";

export const decryptAES = (encryptedText, key) => {
 
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedText, "Secret123");
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        return decryptedText;
    }
    catch (e) {
        console.log(e);
        throw new Error("Failed to decrypt AES text. Check the key and encrypted text.");
    }
}