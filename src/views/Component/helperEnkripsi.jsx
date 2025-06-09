import CryptoJS from "crypto-js";

const SECRET_KEY = "my-secret-key-123456"; // Harus 16/24/32 karakter agar valid untuk AES
const SECRET_KEY_UTF8 = CryptoJS.enc.Utf8.parse(SECRET_KEY); // Kunci yang valid untuk AES

function toUrlSafeBase64(base64) {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromUrlSafeBase64(urlSafe) {
  let base64 = urlSafe.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  return base64;
}

export function encryptId(id) {
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY_UTF8, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Gabungkan IV dan ciphertext manual, bukan pakai .concat()
  const encryptedData = iv.concat(encrypted.ciphertext);
  const base64 = CryptoJS.enc.Base64.stringify(encryptedData);
  return toUrlSafeBase64(base64);
}

export function decryptId(encryptedUrlSafe) {
  try {
    const encryptedBase64 = fromUrlSafeBase64(encryptedUrlSafe);
    const combined = CryptoJS.enc.Base64.parse(encryptedBase64);

    const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4), 16); // 16 bytes = 4 words
    const ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(4), combined.sigBytes - 16);

    const decrypted = CryptoJS.AES.decrypt({ ciphertext }, SECRET_KEY_UTF8, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8) || null;
  } catch (err) {
    console.error("Decrypt error:", err);
    return null;
  }
}
