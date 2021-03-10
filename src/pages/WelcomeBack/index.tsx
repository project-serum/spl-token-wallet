import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, Redirect } from 'react-router-dom';
import { loadMnemonicAndSeed } from '../../utils/wallet-seed';
import { useCallAsync } from '../../utils/notifications';

import {
  Input,
  Body,
  Card,
  TextButton,
  Row,
  Img,
  Title,
  VioletButton,
  RowContainer,
  StyledLabel,
  StyledCheckbox,
} from '../commonStyles';

import Eye from '../../images/Eye.svg';
import Logo from '../../components/Logo'

import { useTheme } from '@material-ui/core';
import { useWallet } from '../../utils/wallet';

const WelcomeBack = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  const theme = useTheme();
  const wallet = useWallet();
  const callAsync = useCallAsync();

  const submit = () => {
    callAsync(loadMnemonicAndSeed(password, stayLoggedIn), {
      progressMessage: 'Unlocking wallet...',
      successMessage: 'Wallet unlocked',
      onSuccess: () => {},
      onError: () => {},
    });
  };

  return (
    <Body>
      {!!wallet && <Redirect to={'/wallet'} />}
      <Logo />
      <Card>
        <RowContainer
          direction={'column'}
          justify={'space-between'}
          height={'100%'}
        >
          <RowContainer direction={'column'} height={'calc(50% - 2.5rem)'}>
            <Title fontSize={'2rem'} fontFamily={'Avenir Next Demi'}>
              Welcome back!
            </Title>
            <Title
              fontSize={'1.6rem'}
              fontFamily={'Avenir Next Demi'}
              margin={'1rem 0'}
            >
              Unlock your wallet
            </Title>
          </RowContainer>
          <RowContainer
            direction={'column'}
            height={'5rem'}
            style={{ position: 'relative' }}
          >
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              onChange={e => setPassword(e.target.value)}
            />
          </RowContainer>
          <RowContainer direction={'column'} height={'calc(50% - 2.5rem)'}>
            <RowContainer height={'50%'}>
              <StyledCheckbox
                id={'keepUnlocked'}
                theme={theme}
                checked={stayLoggedIn}
                onChange={(e) => setStayLoggedIn(e.target.checked)}
              />
              <StyledLabel htmlFor={'keepUnlocked'}>
                Keep wallet unlocked
              </StyledLabel>
            </RowContainer>
            <Row width={'90%'} height={'50%'} align={'flex-start'}>
              <VioletButton onClick={submit}>Continue</VioletButton>
            </Row>
          </RowContainer>
        </RowContainer>
      </Card>
      <RowContainer margin={'1rem 0 0 0'}>
        <Title color={theme.customPalette.grey.dark} fontSize={'1.4rem'}>
          Or{' '}
          <Link
            to={'/restore_wallet'}
            style={{
              color: theme.customPalette.blue.new,
              textDecoration: 'none',
            }}
          >
            Restore Existing Wallet
          </Link>
        </Title>
      </RowContainer>
    </Body>
  );
};

export default WelcomeBack;
