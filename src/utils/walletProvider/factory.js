import { LocalStorageWalletProvider } from './localStorage';
import { LedgerWalletProvider } from './ledger';

export class WalletProviderFactory {
  static getProvider(type, walletIndex) {
    if (type === 'local') {
      return new LocalStorageWalletProvider(walletIndex)
    }

    if (type === 'ledger') {
      return new LedgerWalletProvider(walletIndex);
    }
  }
}
