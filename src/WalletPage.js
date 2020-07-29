import React from 'react';
import Container from '@material-ui/core/Container';
import BalancesList from './components/BalancesList';
import Button from '@material-ui/core/Button';
import { useWallet } from './utils/wallet';
import { Account } from '@solana/web3.js';
import { createAndInitializeMint } from './utils/tokens';

export default function WalletPage() {
  const wallet = useWallet();
  return (
    <Container fixed maxWidth="md">
      <BalancesList />
      <br />
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
            initialAccount: new Account(),
            mintOwner: wallet.account,
          })
            .then(console.log)
            .catch(console.warn);
        }}
      >
        Mint New Token
      </Button>
    </Container>
  );
}
