import React, { useState } from 'react';
import {
  Card,
  Row,
  Img,
  Title,
  VioletButton,
  BoldTitle,
  ColorText,
  Legend,
  RowContainer,
  StyledCheckbox,
  ListCard,
} from '../../commonStyles';
import { Stroke } from './ProgressBar';
import { InputWithSearch, TextareaWithCopy } from '../../../components/Input';

import SRM from '../../../images/srm.svg';
import Attention from '../../../images/attention.svg';
import BottomLink from '../../../components/BottomLink';
import { useTheme } from '@material-ui/core';
import { refreshWalletPublicKeys, useWallet, useWalletPublicKeys } from '../../../utils/wallet';
import { refreshAccountInfo } from '../../../utils/connection';

const AddTokens = () => {
  const [searchValue, setSearchValue] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCoins, selectCoin] = useState<string[]>([]);

  const theme = useTheme();
  const wallet = useWallet()

  const [publicKeys] = useWalletPublicKeys();
  const sortedPublicKeys = Array.isArray(publicKeys) ? publicKeys : [];


  return (
    <>
      <Card width={'100rem'}>
        <RowContainer height={'100%'}>
          {' '}
          <RowContainer
            style={{ borderRight: '0.2rem solid #383B45' }}
            height={'96%'}
            direction={'column'}
            justify={'space-evenly'}
          >
            <Row width={'85%'} justify={'end'}>
              <BoldTitle color={'#96999C'} style={{ marginRight: '1rem' }}>
                Step 1:
              </BoldTitle>
              <BoldTitle>Deposit some SOL to activate your wallet.</BoldTitle>
            </Row>
            <Row justify={'end'} width={'85%'}>
              <BoldTitle style={{ width: '25%' }} fontSize={'1.3rem'}>
                Your SOL address
              </BoldTitle>
              <Legend />
            </Row>
            <Row width={'85%'}>
              {' '}
              <TextareaWithCopy
                height={'4.5rem'}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </Row>
            <Row width={'85%'}>
              <ColorText
                width={'100%'}
                height={'12rem'}
                background={'rgba(242, 154, 54, 0.5)'}
              >
                <img alt={'Attention'} src={Attention} />
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '87%',
                    justifyContent: 'space-around',
                    height: '90%',
                  }}
                >
                  <Title fontSize={'1.2rem'} textAlign={'inherit'}>
                    Transaction in Solana Network usually takes no more than a
                    second, but if you send SOL from an exchange, the withdrawal
                    can be delayed for few minutes.
                  </Title>
                  <Title fontSize={'1.2rem'} textAlign={'inherit'}>
                    Click the “Refresh Balance” button after exchange confirms
                    your withdrawal to update your balance and continue setting
                    up your wallet.
                  </Title>
                </span>
              </ColorText>
            </Row>
            <Row width={'85%'} justify={'space-between'}>
              <VioletButton
                theme={theme}
                btnWidth={'31%'}
                height={'3.5rem'}
                background={'#366CE5'}
                onClick={() => {
                  refreshWalletPublicKeys(wallet);
                  sortedPublicKeys.map((publicKey) =>
                    refreshAccountInfo(wallet.connection, publicKey, true),
                  );
                }}
              >
                Refresh Balance
              </VioletButton>
              <span style={{ display: 'flex' }}>
                <BoldTitle fontSize={'1.5rem'}>Your Balance: </BoldTitle>
                <BoldTitle fontSize={'1.5rem'} color={'#A5E898'}>
                  &ensp; 1.000 SOL
                </BoldTitle>
              </span>
            </Row>
          </RowContainer>
          <RowContainer
            justify={'space-evenly'}
            height={'96%'}
            direction={'column'}
          >
            {' '}
            <Row margin={'1.5rem 0 0 0 '} width={'85%'} justify={'end'}>
              <BoldTitle color={'#96999C'} style={{ marginRight: '1rem' }}>
                Step 2:
              </BoldTitle>
              <BoldTitle>
                Select tokens you want to add to your wallet.
              </BoldTitle>
            </Row>
            <Row width={'85%'}>
              <InputWithSearch
                type={'text'}
                value={searchValue}
                onChange={(e) => {
                  if (
                    !`${e.target.value}`.match(/[a-zA-Z1-9]/) &&
                    e.target.value !== ''
                  ) {
                    return;
                  }

                  setSearchValue(e.target.value);
                }}
                onSearchClick={() => {}}
                placeholder={'Search'}
              ></InputWithSearch>
            </Row>
            <Row width="85%">
              <ListCard>
                <Stroke theme={theme}>
                  <span
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      minWidth: '6rem',
                      width: 'auto',
                      alignItems: 'center',
                    }}
                  >
                    <Img>
                      <img alt="asset icon" src={SRM} />
                    </Img>
                    <BoldTitle>SRM</BoldTitle>
                  </span>
                  <StyledCheckbox
                    onChange={() => {
                      selectCoin(
                        selectedCoins.includes('SRM')
                          ? [...selectedCoins.filter((name) => name !== 'SRM')]
                          : [...selectedCoins, 'SRM'],
                      );
                    }}
                    theme={theme}
                  />
                </Stroke>
              </ListCard>
            </Row>
            <Row
              margin={'0 0 0.8rem 0'}
              width={'85%'}
              justify={'space-between'}
            >
              <Row>
                <span style={{ display: 'flex' }}>
                  <BoldTitle fontSize={'1.5rem'}>Cost: </BoldTitle>
                  <BoldTitle fontSize={'1.5rem'} color={'#A5E898'}>
                    &ensp; 1.000 SOL
                  </BoldTitle>
                </span>
              </Row>
              <VioletButton theme={theme} background={'#366CE5'}>Finish</VioletButton>
            </Row>
          </RowContainer>
        </RowContainer>
      </Card>{' '}
      <BottomLink
        needOr={false}
        linkColor={theme.customPalette.red.main}
        toText={'Skip for now'}
        to={'/wallet'}
      />
    </>
  );
};

export default AddTokens;
