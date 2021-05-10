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

import Logo from '../../components/Logo';
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

const WelcomeBack = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [stayLoggedIn] = useState(true);
  // eslint-disable-next-line
  const [_, loading] = useHasLockedMnemonicAndSeed();

  const theme = useTheme();
  const wallet = useWallet();
  const callAsync = useCallAsync();
  const hash = localStorage.getItem('hash');

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
      <Logo />
      <RowContainer height={'80%'} direction={'column'}>
        <Card minHeight={'50rem'}>
          <RowContainer
            direction={'column'}
            justify={'space-between'}
            height={'100%'}
          >
            <RowContainer margin="2rem 0 0 0">
              <ImgContainer
                alt="lock"
                src={
                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iNzAiIHZpZXdCb3g9IjAgMCA3MCA3MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTU1LjMgMjhINDlWMTkuNkM0OSA5LjQ2MDUgNDQuMzI3NSAzLjUgMzUgMy41QzI1LjY2OSAzLjUgMjEgOS40NjA1IDIxIDE5LjZWMjhIMTRDMTIuMDY0NSAyOCAxMC41IDMwLjI2MSAxMC41IDMyLjE5NjVWNTkuNUMxMC41IDYxLjQyMTUgMTEuOTk4IDYzLjQ4NjUgMTMuODI4NSA2NC4wNzQ1TDE4LjAxOCA2NS40MjlDMjAuMjQwMiA2Ni4wNzY3IDIyLjUzNjIgNjYuNDM2NyAyNC44NSA2Ni41SDQ1LjE1QzQ3LjQ2MjkgNjYuNDM3MiA0OS43NTgxIDY2LjA3NjEgNTEuOTc4NSA2NS40MjU1TDU2LjE2NDUgNjQuMDcxQzU3Ljk5ODUgNjMuNDg2NSA1OS41IDYxLjQyMTUgNTkuNSA1OS41VjMyLjE5NjVDNTkuNSAzMC4yNjEgNTcuMjMyIDI4IDU1LjMgMjhaTTQyIDI4SDI4VjE4LjE5NjVDMjggMTMuMTM5IDMwLjc4OTUgMTAuNSAzNSAxMC41QzM5LjIxMDUgMTAuNSA0MiAxMy4xMzkgNDIgMTguMTk2NVYyOFoiIGZpbGw9IiMzNjZDRTUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zOSA0Ni40NzIyQzQwLjIyNzUgNDUuMzczNiA0MSA0My43NzcgNDEgNDJDNDEgMzguNjg2MyAzOC4zMTM3IDM2IDM1IDM2QzMxLjY4NjMgMzYgMjkgMzguNjg2MyAyOSA0MkMyOSA0My43NzcgMjkuNzcyNSA0NS4zNzM2IDMxIDQ2LjQ3MjJWNTRDMzEgNTYuMjA5MSAzMi43OTA5IDU4IDM1IDU4QzM3LjIwOTEgNTggMzkgNTYuMjA5MSAzOSA1NFY0Ni40NzIyWiIgZmlsbD0iIzIyMjQyOSIvPgo8L3N2Zz4K'
                }
              />
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
