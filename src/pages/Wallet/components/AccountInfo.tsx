import React from 'react';
import styled from 'styled-components';
import { useTheme } from '@material-ui/core';

import { useBalanceInfo, useWallet } from '../../../utils/wallet';
import { Row, RowContainer, Title, ExclamationMark } from '../../commonStyles';
import { formatNumberToUSFormat, stripDigitPlaces } from '../../../utils/utils';

import AccountsSelector from './AccountsSelector';
import TotalBalance from './TotalBalance';

const AccountInfoContainer = styled(RowContainer)`
  width: 100%;
  height: auto;
  padding: 5rem 4rem;

  @media (max-width: 400px) {
    height: 40%;
    flex-direction: column;
    padding: 3rem 0;
  }
`;

const AccountInfoSubContainer = styled(Row)`
  width: 40%;
  height: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  @media (max-width: 400px) {
    width: 100%;
  }
`;

const Instruction = styled(Row)`
  height: 100%;
  @media (max-width: 400px) {
    display: none;
  }
`;

const Balances = styled(Row)`
  width: 60%;
  height: 100%;
  justify-content: flex-end;
  @media (max-width: 400px) {
    width: 100%;
    margin-top: 3rem;
  }
`;

const BalanceCard = styled(Row)`
  width: 26rem;
  height: 100%;
  margin: ${(props) => props.margin || '0 4rem 0 0'};
  padding: 1rem 1.5rem;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  background: ${(props) =>
    props.background || 'linear-gradient(135deg, #1331ad 0%, #3b8d17 100%)'};
  border-radius: 1.2rem;
  @media (max-width: 400px) {
    margin: 0;
    width: 48%;
    height: 8rem;
    border-radius: 2rem;
    margin-left: ${(props) => (props.needLeftMargin ? '4%' : 0)};
  }
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
    <AccountInfoContainer>
      <AccountInfoSubContainer>
        <AccountsSelector />
        <Title
          style={{ position: 'relative' }}
          color={theme.customPalette.grey.light}
        >
          {wallet.publicKey.toBase58()}
        </Title>
      </AccountInfoSubContainer>
      <Balances>
        <BalanceCard
          margin="0 2rem 0 0"
          background="linear-gradient(135deg, #1331AD 0%, #95363F 100%)"
        >
          <Title
            fontSize="1.4rem"
            fontFamily={'Avenir Next Demi'}
            color={theme.customPalette.grey.light}
          >
            Total Balance
          </Title>
          <Title fontSize="2.4rem" fontFamily={'Avenir Next Demi'}>
            <TotalBalance key="navbarfalse" isNavbar={false} />
          </Title>
        </BalanceCard>
        <BalanceCard needLeftMargin>
          <Title
            fontSize="1.4rem"
            fontFamily={'Avenir Next Demi'}
            color={theme.customPalette.grey.light}
          >
            SOL Balance
          </Title>
          <Title fontSize="2.4rem" fontFamily={'Avenir Next Demi'}>
            {formatNumberToUSFormat(
              stripDigitPlaces(amount / Math.pow(10, decimals), 8),
            )}{' '}
            SOL
          </Title>
        </BalanceCard>
        <Instruction>
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
              SOL is the fuel for transactions on Solana.
            </Title>
            <Title
              fontFamily="Avenir Next"
              fontSize="1.4rem"
              color={theme.customPalette.orange.dark}
              style={{ whiteSpace: 'nowrap' }}
            >
              You must have some SOL in your wallet for
            </Title>
            <Title
              fontFamily="Avenir Next"
              fontSize="1.4rem"
              color={theme.customPalette.orange.dark}
              style={{ whiteSpace: 'nowrap' }}
            >
              DEX trading or other transactions.
            </Title>
          </Row>
          <ExclamationMark
            theme={theme}
            margin={'0 0 0 2rem'}
            fontSize="7rem"
          />
        </Instruction>
      </Balances>
    </AccountInfoContainer>
  );
};

export default React.memo(AccountInfo, (prev, next) => {
  return true;
});
