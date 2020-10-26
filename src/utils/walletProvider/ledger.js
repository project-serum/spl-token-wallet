import TransportWebUsb from "@ledgerhq/hw-transport-webusb";
import { getPublicKey, solana_derivation_path, solana_ledger_sign_transaction } from './ledger-core';

export class LedgerWalletProvider {
  constructor(walletIndex) {
    this.walletIndex = walletIndex;
  }

  init = async () => {
    this.transport = await TransportWebUsb.create();
    this.pubKey = await getPublicKey(this.transport);
    return this;
  }

  get publicKey() {
    return this.pubKey;
  }

  signTransaction = async (transaction) => {
    const from_derivation_path = solana_derivation_path();
    const sig_bytes = await solana_ledger_sign_transaction(this.transport, from_derivation_path, transaction);
    transaction.addSignature(this.publicKey, sig_bytes);

    return transaction;
  }
}
