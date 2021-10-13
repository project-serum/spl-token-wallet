import ed2curve from './ed2curve';

/**
 * Generate Diffie-Hellman keys
 * publicKey is a Uint8Array
 * secretKey is a Uint8Array
 * Returns { publicKey: Uint8Array, secretKey: Uint8Array }
 */
export const generateDiffieHelllman = (publicKey, secretKey) => {
  return ed2curve.convertKeyPair({
    publicKey: publicKey,
    secretKey: new Uint8Array(secretKey),
  });
};
