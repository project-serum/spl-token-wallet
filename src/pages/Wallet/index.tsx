import React from 'react';

import AccountInfo from './components/AccountInfo'
import AssetsTable from './components/AssetsTable'

import { RowContainer } from '../commonStyles';


const Wallet = () => {
  return (
    <RowContainer direction="column" height="100%" padding="0 3rem 3rem 3rem">
      <AccountInfo />
      <AssetsTable />
    </RowContainer>
  );
};

export default Wallet;
