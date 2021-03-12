import { useTheme } from '@material-ui/core';
import React from 'react';
import { useWallet } from '../../../utils/wallet';
import { Row, RowContainer, Title, ExclamationMark } from '../../commonStyles';
import { formatNumberToUSFormat, stripDigitPlaces } from '../../../utils/utils';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const AccountInfo = () => {
  const theme = useTheme();
  const wallet = useWallet();

  return (
    <RowContainer height="20%" padding="5rem 4rem">
      <Row
        width="40%"
        height="100%"
        direction="column"
        align="flex-start"
        justify="space-between"
      >
        <Row>
          <Title
            fontSize="2.4rem"
            fontFamily="Avenir Next Demi"
            style={{ textTransform: 'capitalize', marginRight: '1rem' }}
          >
            main account
          </Title>
          <ExpandMoreIcon fontSize="large" />
        </Row>
        <Title color={theme.customPalette.grey.light}>
          {wallet.publicKey.toBase58()}
        </Title>
      </Row>
      <Row width="60%" height="100%">
        <Row
          width="22rem"
          height="100%"
          margin="0 2rem 0 0"
          padding=".5rem 1.5rem"
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
            {`$${formatNumberToUSFormat(1000)}`}
          </Title>
        </Row>
        <Row
          width="22rem"
          height="100%"
          margin="0 4rem 0 0"
          padding=".5rem 1.5rem"
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
            {formatNumberToUSFormat(stripDigitPlaces(1.249729741, 4))} SOL
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
    </RowContainer>
  );
};

export default AccountInfo;
