import React, { useState } from 'react';
import styled from 'styled-components';
import { Redirect, Link } from 'react-router-dom';
import {
  loadMnemonicAndSeed,
  useHasLockedMnemonicAndSeed,
} from '../../utils/wallet-seed';
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
import lock from '../../images/lock.svg';

// import Logo from '../../components/Logo';
import { InputWithEye } from '../../components/Input';

import { useTheme } from '@material-ui/core';
import { useWallet } from '../../utils/wallet';
// import BottomLink from '../../components/BottomLink';
import FakeInputs from '../../components/FakeInputs';
import { isExtension, openExtensionInNewTab } from '../../utils/utils';

const ImgContainer = styled.img`
  height: 7rem;
  @media (max-width: 540px) {
    height: 10rem;
  }
`;

const BottomLinksContainer = styled(RowContainer)`
  justify-content: space-around;
  width: 50rem;
  margin: 1rem 0 0 0;
  // @media (max-width: 540px) {
  //   display: none;
  // }
`;

const UnlockButton = styled(VioletButton)`
  @media (max-width: 540px) {
    width: 100%;
    height: 6rem;
  }
`;

const StyledLogoContainer = styled(RowContainer)`
  @media (max-width: 540px) {
    display: none;
  }
`;

const WelcomeBack = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [stayLoggedIn] = useState(true);
  // eslint-disable-next-line
  const [_, loading] = useHasLockedMnemonicAndSeed();

  const theme = useTheme();
  const wallet = useWallet();
  const callAsync = useCallAsync();
  const hash = sessionStorage.getItem('hash');

  const submit = () => {
    callAsync(loadMnemonicAndSeed(password, stayLoggedIn), {
      progressMessage: null,
      successMessage: null,
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

  if (loading) {
    return null;
  }

  return (
    <Body>
      <FakeInputs />
      {!!wallet && window.opener && <Redirect to={'/connect_popup'} />}
      {!!wallet && <Redirect to={'/wallet'} />}
      <StyledLogoContainer>{/* <Logo /> */}</StyledLogoContainer>
      <RowContainer height={'80%'} direction={'column'}>
        <Card minHeight={'50rem'}>
          <RowContainer
            direction={'column'}
            justify={'space-between'}
            height={'100%'}
          >
            <RowContainer margin="2rem 0 0 0">
              <ImgContainer alt="lock" src={lock} />
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
                <UnlockButton
                  theme={theme}
                  onClick={submit}
                  disabled={isDisabled}
                >
                  Unlock
                </UnlockButton>
              </Row>
            </RowContainer>
          </RowContainer>
        </Card>
        <BottomLinksContainer>
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
          {isExtension && hash !== '#from_extension' ? (
            <span
              onClick={openExtensionInNewTab}
              style={{
                color: theme.customPalette.blue.new,
                textDecoration: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer',
              }}
            >
              Create Another Wallet
            </span>
          ) : (
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
          )}
        </BottomLinksContainer>
      </RowContainer>
    </Body>
  );
};

export default WelcomeBack;
