import React from 'react';
import Container from '@material-ui/core/Container';
import BalancesList from '../components/BalancesList';
import Grid from '@material-ui/core/Grid';
import { useIsProdNetwork } from '../utils/connection';
import DebugButtons from '../components/DebugButtons';

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
            <DebugButtons />
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
