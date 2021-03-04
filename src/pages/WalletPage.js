import React from 'react';
import Container from '@material-ui/core/Container';
import BalancesList from '../components/BalancesList';
import Grid from '@material-ui/core/Grid';
import { useIsProdNetwork } from '../utils/connection';
import DebugButtons from '../components/DebugButtons';
import { makeStyles } from '@material-ui/core';
import { useIsExtension } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down(theme.ext)]: {
      padding: 0,
    },
    [theme.breakpoints.up(theme.ext)]: {
      maxWidth: 'md',
    },
  },
}));

export default function WalletPage() {
  const classes = useStyles();
  const isProdNetwork = useIsProdNetwork();
  const isExtension = useIsExtension();
  return (
    <Container fixed maxWidth='md' className={classes.container}>
      <Grid container spacing={isExtension ? 0 : 3}>
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
