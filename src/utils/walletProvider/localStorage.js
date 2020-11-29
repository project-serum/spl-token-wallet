import { getUnlockedMnemonicAndSeed } from './../wallet-seed';
import * as bip32 from 'bip32';
import nacl from 'tweetnacl';
import { Account } from '@solana/web3.js';

export function getAccountFromSeed(seed, walletIndex, accountIndex = 0) {

  const derivedSeed = bip32
    .fromSeed(seed)
    .derivePath(`m/501'/${walletIndex}'/0/${accountIndex}`).privateKey;
  return new Account(nacl.sign.keyPair.fromSeed(derivedSeed).secretKey);
}


export class LocalStorageWalletProvider {
  constructor(walletIndex) {
    const { seed } = getUnlockedMnemonicAndSeed();
    this.walletIndex = walletIndex;
    this.account = getAccountFromSeed(Buffer.from(seed, 'hex'), this.walletIndex)
    this.listAddresses = async (walletCount) => {
      const seedBuffer = Buffer.from(seed, 'hex');
      return [...Array(walletCount).keys()].map(
        (walletIndex) => {
          let address = getAccountFromSeed(seedBuffer, walletIndex).publicKey;
          let name = localStorage.getItem(`name${walletIndex}`);
          return { index: walletIndex, address, name };
        }
      );
    }
  }

  init = async () => {
    return this;
  }

  get publicKey() {
    return this.account.publicKey;
  }

  signTransaction = async (transaction) => {
    transaction.partialSign(this.account);
    return transaction;
  }
}
