const AES128CBCSecretKey = process.env.NEXT_PUBLIC_AES_128_CBC_SECRET_KEY;
const AES256CBCSecretKey = process.env.NEXT_PUBLIC_AES_256_CBC_SECRET_KEY;
const ChaCha20SecretKey = process.env.NEXT_PUBLIC_CHA_CHA_20_SECRET_KEY;
const AES256GCMSecretKey = process.env.NEXT_PUBLIC_AES_256_GCM_SECRET_KEY;
const AES128GCMSecretKey = process.env.NEXT_PUBLIC_AES_128_GCM_SECRET_KEY;

function getKeys() {
  return {
    AES128CBCSecretKey,
    AES256CBCSecretKey,
    ChaCha20SecretKey,
    AES256GCMSecretKey,
    AES128GCMSecretKey,
  };
}

export { getKeys };
