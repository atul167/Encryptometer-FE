export const PORT = 1000;
export const BACKEND_URL = "http://localhost";
export const CRYPTO_ALGOS = [
    { value: "aes", label: "AES" },
    { value: "ssh", label: "SSH" },
    { value: "rsa", label: "RSA" },
    { value: "chacha", label: "ChaCha" },
];
export const DECRYPT_KEY_AES = "SecretKey123";    // Example AES key
export const DECRYPT_KEY_RSA = "RSASecretKey456";    // Example RSA key
export const DECRYPT_KEY_SSH = "SSHSecretKey789";    // Example SSH key
export const SAMPLE_TEXT = "U2FsdGVkX1+1mhxIhGjNHnTfZaqcWn6XufgA7kML5vA="