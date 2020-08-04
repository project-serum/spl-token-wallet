import { refreshWalletPublicKeys, useWallet } from '../utils/wallet';
import { useUpdateTokenName } from '../utils/tokens/names';
import { useCallAsync, useSendTransaction } from '../utils/notifications';
import { Account, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { abbreviateAddress, sleep } from '../utils/utils';
import { refreshAccountInfo } from '../utils/connection';
import { createAndInitializeMint } from '../utils/tokens';
import Button from '@material-ui/core/Button';
import React from 'react';

export default function DebugButtons() {
  const wallet = useWallet();
  const updateTokenName = useUpdateTokenName();
  const [sendTransaction, sending] = useSendTransaction();
  const callAsync = useCallAsync();

  function requestAirdrop() {
    callAsync(
      wallet.connection.requestAirdrop(
        wallet.account.publicKey,
        LAMPORTS_PER_SOL,
      ),
      {
        onSuccess: async () => {
          await sleep(5000);
          refreshAccountInfo(wallet.connection, wallet.account.publicKey);
        },
        successMessage:
          'Success! Please wait up to 30 seconds for the SOL tokens to appear in your wallet.',
      },
    );
  }

  function mintTestToken() {
    let mint = new Account();
    updateTokenName(
      mint.publicKey,
      `Test Token ${abbreviateAddress(mint.publicKey)}`,
      `TEST${mint.publicKey.toBase58().slice(0, 2)}`,
    );
    sendTransaction(
      createAndInitializeMint({
        connection: wallet.connection,
        payer: wallet.account,
        mint,
        amount: 1000,
        decimals: 2,
        initialAccount: new Account(),
        mintOwner: wallet.account,
      }),
      { onSuccess: () => refreshWalletPublicKeys(wallet) },
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      <Button variant="contained" color="primary" onClick={requestAirdrop}>
        Request Airdrop
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={mintTestToken}
        disabled={sending}
        style={{ marginLeft: 24 }}
      >
        Mint Test Token
      </Button>
    </div>
  );
}
