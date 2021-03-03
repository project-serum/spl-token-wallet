import React from 'react';
import Container from '@material-ui/core/Container';
import BalancesList from '../components/BalancesList';
import Grid from '@material-ui/core/Grid';
import { useIsProdNetwork } from '../utils/connection';
import DebugButtons from '../components/DebugButtons';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down('500')]: {
      padding: 0,
    },
    [theme.breakpoints.up('500')]: {
      maxWidth: 'md',
    },
  },
}));

export default function WalletPage() {
  const classes = useStyles();
  const isProdNetwork = useIsProdNetwork();
  return (
    <Container fixed maxWidth='md' className={classes.container}>
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
