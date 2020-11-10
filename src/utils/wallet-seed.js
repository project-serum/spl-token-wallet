import { pbkdf2 } from 'crypto';
import { randomBytes, secretbox } from 'tweetnacl';
import bs58 from 'bs58';
import { EventEmitter } from 'events';

export async function generateMnemonicAndSeed() {
  const bip39 = await import('bip39');
  const mnemonic = bip39.generateMnemonic(128);
  const seed = await bip39.mnemonicToSeed(mnemonic);
  return { mnemonic, seed: Buffer.from(seed).toString('hex') };
}

export async function mnemonicToSeed(mnemonic) {
  const bip39 = await import('bip39');
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid seed words');
  }
  const seed = await bip39.mnemonicToSeed(mnemonic);
  return Buffer.from(seed).toString('hex');
}

let unlockedMnemonicAndSeed = JSON.parse(
  sessionStorage.getItem('unlocked') ||
    localStorage.getItem('unlocked') ||
    'null',
) || { mnemonic: null, seed: null };
export const walletSeedChanged = new EventEmitter();

export function getUnlockedMnemonicAndSeed() {
  return unlockedMnemonicAndSeed;
}

export function hasLockedMnemonicAndSeed() {
  return !!localStorage.getItem('locked');
}

function setUnlockedMnemonicAndSeed(mnemonic, seed) {
  unlockedMnemonicAndSeed = { mnemonic, seed };
  walletSeedChanged.emit('change', unlockedMnemonicAndSeed);
}

export async function storeMnemonicAndSeed(mnemonic, seed, password) {
  const plaintext = JSON.stringify({ mnemonic, seed });
  if (password) {
    const salt = randomBytes(16);
    const kdf = 'pbkdf2';
    const iterations = 100000;
    const digest = 'sha256';
    const key = await deriveEncryptionKey(password, salt, iterations, digest);
    const nonce = randomBytes(secretbox.nonceLength);
    const encrypted = secretbox(Buffer.from(plaintext), nonce, key);
    localStorage.setItem(
      'locked',
      JSON.stringify({
        encrypted: bs58.encode(encrypted),
        nonce: bs58.encode(nonce),
        kdf,
        salt: bs58.encode(salt),
        iterations,
        digest,
      }),
    );
    localStorage.removeItem('unlocked');
    sessionStorage.removeItem('unlocked');
  } else {
    localStorage.setItem('unlocked', plaintext);
    localStorage.removeItem('locked');
    sessionStorage.removeItem('unlocked');
  }
  setUnlockedMnemonicAndSeed(mnemonic, seed);
}

export async function loadMnemonicAndSeed(password, stayLoggedIn) {
  const {
    encrypted: encodedEncrypted,
    nonce: encodedNonce,
    salt: encodedSalt,
    iterations,
    digest,
  } = JSON.parse(localStorage.getItem('locked'));
  const encrypted = bs58.decode(encodedEncrypted);
  const nonce = bs58.decode(encodedNonce);
  const salt = bs58.decode(encodedSalt);
  const key = await deriveEncryptionKey(password, salt, iterations, digest);
  const plaintext = secretbox.open(encrypted, nonce, key);
  if (!plaintext) {
    throw new Error('Incorrect password');
  }
  const decodedPlaintext = Buffer.from(plaintext).toString();
  const { mnemonic, seed } = JSON.parse(decodedPlaintext);
  if (stayLoggedIn) {
    sessionStorage.setItem('unlocked', decodedPlaintext);
  }
  setUnlockedMnemonicAndSeed(mnemonic, seed);
  return { mnemonic, seed };
}

async function deriveEncryptionKey(password, salt, iterations, digest) {
  return new Promise((resolve, reject) =>
    pbkdf2(
      password,
      salt,
      iterations,
      secretbox.keyLength,
      digest,
      (err, key) => (err ? reject(err) : resolve(key)),
    ),
  );
}

export function lockWallet() {
  setUnlockedMnemonicAndSeed(null, null);
}
