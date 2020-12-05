import TransportWebUsb from '@ledgerhq/hw-transport-webusb';
import {
  getPublicKey,
  solana_derivation_path,
  solana_ledger_sign_bytes,
  solana_ledger_sign_transaction,
} from './ledger-core';
import bs58 from 'bs58';

export class LedgerWalletProvider {
  constructor(args) {
    this.onDisconnect = (args && args.onDisconnect) || (() => {});
  }

  init = async () => {
    this.transport = await TransportWebUsb.create();
    this.pubKey = await getPublicKey(this.transport);
    this.transport.on('disconnect', this.onDisconnect);
    this.listAddresses = async (walletCount) => {
      // TODO: read accounts from ledger
      return [this.pubKey];
    };
    return this;
  };

  get publicKey() {
    return this.pubKey;
  }

  signTransaction = async (transaction) => {
    const from_derivation_path = solana_derivation_path();
    const sig_bytes = await solana_ledger_sign_transaction(
      this.transport,
      from_derivation_path,
      transaction,
    );
    transaction.addSignature(this.publicKey, sig_bytes);
    return transaction;
  };

  createSignature = async (message) => {
    const from_derivation_path = solana_derivation_path();
    const sig_bytes = await solana_ledger_sign_bytes(
      this.transport,
      from_derivation_path,
      message,
    );
    return bs58.encode(sig_bytes);
  };
}
