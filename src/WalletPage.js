import React from 'react';
import Container from '@material-ui/core/Container';
import BalancesList from './components/BalancesList';
import Button from '@material-ui/core/Button';
import { useWallet } from './utils/wallet';
import { Account, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createAndInitializeMint } from './utils/tokens';
import Grid from '@material-ui/core/Grid';
import { useIsProdNetwork } from './utils/connection';

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
  return (
    <div style={{ display: 'flex' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          wallet.connection
            .requestAirdrop(wallet.account.publicKey, LAMPORTS_PER_SOL)
            .then(console.log)
            .catch(console.warn);
        }}
      >
        Request Airdrop
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          createAndInitializeMint({
            connection: wallet.connection,
            payer: wallet.account,
            mint: new Account(),
            amount: 1000,
            decimals: 2,
            initialAccount: wallet.getAccount(wallet.accountCount),
            mintOwner: wallet.account,
          })
            .then(console.log)
            .catch(console.warn);
        }}
        style={{ marginLeft: 24 }}
      >
        Mint Test Token
      </Button>
    </div>
  );
}
