import React from 'react';
import Container from '@material-ui/core/Container';
import BalancesList from './components/BalancesList';

export default function WalletPage() {
  return (
    <Container fixed maxWidth="md">
      <BalancesList />
    </Container>
  );
}
