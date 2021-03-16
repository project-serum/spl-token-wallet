import React from 'react';
import styled from 'styled-components';
import { useTheme } from '@material-ui/core';

import { useBalanceInfo, useWallet } from '../../../utils/wallet';
import { Row, RowContainer, Title, ExclamationMark } from '../../commonStyles';
import { formatNumberToUSFormat, stripDigitPlaces } from '../../../utils/utils';

import AccountsSelector from './AccountsSelector'
import TotalBalance from './TotalBalance';

const AccountInfoContainer = styled(RowContainer)`
  width: 100%;
  height: auto;
`;

const AccountInfo = () => {
  const theme = useTheme();
  const wallet = useWallet();

  const balanceInfo = useBalanceInfo(wallet.publicKey);
  let { amount, decimals } = balanceInfo || {
    amount: 0,
    decimals: 8,
    mint: null,
    tokenName: 'Loading...',
    tokenSymbol: '--',
  };

  return (
    <AccountInfoContainer padding="5rem 4rem">
      <Row
        width="40%"
        height="100%"
        direction="column"
        align="flex-start"
        justify="space-between"
      >
        <AccountsSelector />
        <Title
          style={{ position: 'relative' }}
          color={theme.customPalette.grey.light}
        >
          {wallet.publicKey.toBase58()}
        </Title>
      </Row>
      <Row width="60%" height="100%" justify="flex-end">
        <Row
          width="26rem"
          height="100%"
          margin="0 2rem 0 0"
          padding="1rem 1.5rem"
          direction="column"
          align="flex-start"
          justify="space-between"
          style={{
            background: 'linear-gradient(135deg, #1331AD 0%, #95363F 100%)',
            borderRadius: '.6rem',
          }}
        >
          <Title
            fontSize="1.4rem"
            fontFamily={'Avenir Next Demi'}
            color={theme.customPalette.grey.light}
          >
            Total Balance
          </Title>
          <Title fontSize="2.4rem" fontFamily={'Avenir Next Demi'}>
            <TotalBalance />
          </Title>
        </Row>
        <Row
          width="26rem"
          height="100%"
          margin="0 4rem 0 0"
          padding="1rem 1.5rem"
          direction="column"
          align="flex-start"
          justify="space-between"
          style={{
            background: 'linear-gradient(135deg, #1331AD 0%, #3B8D17 100%)',
            borderRadius: '.6rem',
          }}
        >
          <Title
            fontSize="1.4rem"
            fontFamily={'Avenir Next Demi'}
            color={theme.customPalette.grey.light}
          >
            SOL Balance
          </Title>
          <Title fontSize="2.4rem" fontFamily={'Avenir Next Demi'}>
            {formatNumberToUSFormat(
              stripDigitPlaces(amount / Math.pow(10, decimals), decimals),
            )}{' '}
            SOL
          </Title>
        </Row>
        <Row height="100%">
          <Row
            height="100%"
            direction="column"
            justify="space-around"
            align="flex-start"
          >
            <Title
              fontFamily="Avenir Next"
              fontSize="1.4rem"
              color={theme.customPalette.orange.dark}
              style={{ whiteSpace: 'nowrap' }}
            >
              SOL is a fuel of Solana Network.
            </Title>
            <Title
              fontFamily="Avenir Next"
              fontSize="1.4rem"
              color={theme.customPalette.orange.dark}
              style={{ whiteSpace: 'nowrap' }}
            >
              You need to keep some SOL
            </Title>
            <Title
              fontFamily="Avenir Next"
              fontSize="1.4rem"
              color={theme.customPalette.orange.dark}
              style={{ whiteSpace: 'nowrap' }}
            >
              on your wallet to work properly with it.
            </Title>
          </Row>
          <ExclamationMark
            theme={theme}
            margin={'0 0 0 2rem'}
            fontSize="7rem"
          />
        </Row>
      </Row>
    </AccountInfoContainer>
  );
};

export default AccountInfo;
