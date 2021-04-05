import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import ConnectionsList from './ConnectionsList';

export default function ConnectionsPage() {
  return (
    <Container>
      <Grid container>
        <Grid item xs={12}>
          <ConnectionsList />
        </Grid>
      </Grid>
    </Container>
  );
}