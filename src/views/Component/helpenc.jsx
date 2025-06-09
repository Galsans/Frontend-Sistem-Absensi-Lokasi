import CryptoJS from "crypto-js";

const SECRET_KEY = "my-secret-key-1234567890123456"; // 16, 24, or 32 chars
const SECRET_KEY_UTF8 = CryptoJS.enc.Utf8.parse(SECRET_KEY);

function toUrlSafeBase64(base64) {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function generateSecureToken(id, route) {
  const iv = CryptoJS.lib.WordArray.random(16);
  const nonce = CryptoJS.lib.WordArray.random(8).toString(); // random string
  const timestamp = Date.now(); // milliseconds

  const payload = JSON.stringify({
    id,
    route,
    timestamp,
    nonce,
  });

  const encrypted = CryptoJS.AES.encrypt(payload, SECRET_KEY_UTF8, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const combined = iv.concat(encrypted.ciphertext);
  const base64 = CryptoJS.enc.Base64.stringify(combined);
  return toUrlSafeBase64(base64);
}
