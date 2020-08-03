import React from 'react';
import Container from '@material-ui/core/Container';
import BalancesList from './components/BalancesList';
import Button from '@material-ui/core/Button';
import { refreshWalletPublicKeys, useWallet } from './utils/wallet';
import { Account, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createAndInitializeMint } from './utils/tokens';
import Grid from '@material-ui/core/Grid';
import { refreshAccountInfo, useIsProdNetwork } from './utils/connection';
import { useUpdateTokenName } from './utils/tokens/names';
import { abbreviateAddress, sleep } from './utils/utils';
import { useCallAsync, useSendTransaction } from './utils/notifications';

export default function WalletPage() {
  const isProdNetwork = useIsProdNetwork();
  return (
    <Container fixed maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <BalancesList />
        </Grid>
        {isProdNetwork ? null : (
          <Grid item xs={12}>
            <DevnetButtons />
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

function DevnetButtons() {
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
          await sleep(1000);
          refreshAccountInfo(wallet.connection, wallet.account.publicKey);
        },
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
