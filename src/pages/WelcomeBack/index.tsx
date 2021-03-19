import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { loadMnemonicAndSeed } from '../../utils/wallet-seed';
import { useCallAsync } from '../../utils/notifications';

import {
  Body,
  Card,
  Row,
  Title,
  VioletButton,
  RowContainer,
  // StyledLabel,
  // StyledCheckbox,
} from '../commonStyles';

import Logo from '../../components/Logo';
import LockIcon from '../../images/lock.svg';
import { InputWithEye } from '../../components/Input';

import { useTheme } from '@material-ui/core';
import { useWallet } from '../../utils/wallet';
// import BottomLink from '../../components/BottomLink';
import FakeInputs from '../../components/FakeInputs';

const WelcomeBack = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [stayLoggedIn] = useState(true);

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

  const isDisabled = password === '';

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && !isDisabled) {
      submit();
    }
  };

  return (
    <Body>
      <FakeInputs />
      {!!wallet && window.opener && <Redirect to={'/connect_popup'} />}
      {!!wallet && <Redirect to={'/wallet'} />}
      <Logo />
      <Card>
        <RowContainer
          direction={'column'}
          justify={'space-between'}
          height={'100%'}
        >
          <RowContainer margin="2rem 0 0 0">
            <img style={{ height: '7rem' }} alt="lock" src={LockIcon} />
          </RowContainer>
          <RowContainer direction={'column'} height={'calc(30%)'}>
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
            <InputWithEye
              value={password}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              showPassword={showPassword}
              onEyeClick={() => setShowPassword(!showPassword)}
              onKeyDown={handleKeyDown}
            />
          </RowContainer>
          <RowContainer direction={'column'} height={'calc(30%)'}>
            {/* <RowContainer height={'50%'}>
              <StyledCheckbox
                id={'keepUnlocked'}
                theme={theme}
                checked={stayLoggedIn}
                onKeyDown={handleKeyDown}
                onChange={(e) => setStayLoggedIn(e.target.checked)}
              />
              <StyledLabel htmlFor={'keepUnlocked'}>
                Keep wallet unlocked
              </StyledLabel> 
            </RowContainer> */}
            <Row width={'90%'} height={'50%'} align={'flex-start'}>
              <VioletButton
                theme={theme}
                onClick={submit}
                disabled={isDisabled}
              >
                Continue
              </VioletButton>
            </Row>
          </RowContainer>
        </RowContainer>
      </Card>
      <RowContainer justify="space-around" width="50rem" margin={'1rem 0 0 0'}>
        <Link
          to={'/restore_wallet'}
          style={{
            color: theme.customPalette.blue.new,
            textDecoration: 'none',
            fontSize: '1.2rem',
          }}
        >
          Restore Another Wallet Using Seed Phrase
        </Link>
        <Link
          to={'/create_wallet'}
          style={{
            color: theme.customPalette.blue.new,
            textDecoration: 'none',
            fontSize: '1.2rem',
          }}
        >
          Create Another Wallet
        </Link>
      </RowContainer>
    </Body>
  );
};

export default WelcomeBack;
