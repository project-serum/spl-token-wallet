import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, Redirect } from 'react-router-dom';
import Helmet from 'react-helmet';

import {
  mnemonicToSeed,
  useHasLockedMnemonicAndSeed,
} from '../../utils/wallet-seed';
import { validateMnemonic } from 'bip39';

import {
  Card,
  Body,
  Row,
  Title,
  VioletButton,
  WhiteButton,
  RowContainer,
} from '../commonStyles';

import Logo from '../../components/Logo';
import { InputWithEye, InputWithPaste } from '../../components/Input';
import BottomLink from '../../components/BottomLink';
import { useTheme } from '@material-ui/core';
import DerivableAccounts from './DerivableAccounts';
import FakeInputs from '../../components/FakeInputs';
import Warning from '../CreateWallet/components/Warning';
import { isExtension, openExtensionInNewTab } from '../../utils/utils';

const StyledTitle = styled(Title)`
  @media (max-width: 540px) {
    font-size: 2rem;
  }
`;

export const RestorePage = () => {
  const [redirectToWallet, setRedirectToWallet] = useState(false);
  const [showDerivation, setShowDerivation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [seed, setSeed] = useState('');
  const hash = sessionStorage.getItem('hash');

  const theme = useTheme();
  const isMnemonicCorrect = validateMnemonic(mnemonic);
  const isDisabled = !isMnemonicCorrect || password === '';

  const [hasLockedMnemonicAndSeed] = useHasLockedMnemonicAndSeed();

  const submit = () => {
    mnemonicToSeed(mnemonic).then((seed) => {
      setSeed(seed);
      setShowDerivation(true);
    });
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && !isDisabled) {
      submit();
    }
  };

  return (
    <Body>
      <Helmet>
        <title>Restore CCAI Wallet by seed phrase</title>
      </Helmet>
      <FakeInputs />
      {redirectToWallet && <Redirect to="/wallet" />}
      <Logo />
      {/* margin={showDerivation ? '0 0 4rem 0' : '0 0 8rem 0'} */}
      <RowContainer height={'80%'} direction={'column'}>
        {hasLockedMnemonicAndSeed ? (
          <Warning onSubmit={() => {}} showBottomLink={false} />
        ) : showDerivation ? (
          <DerivableAccounts
            goBack={() => setShowDerivation(false)}
            mnemonic={mnemonic}
            password={password}
            seed={seed}
            setRedirectToWallet={setRedirectToWallet}
          />
        ) : (
          <Card minHeight={'50rem'}>
            <RowContainer
              direction={'column'}
              justify={'space-between'}
              height={'100%'}
            >
              <RowContainer
                direction={'column'}
                justify={'space-around'}
                height={'30%'}
              >
                <StyledTitle>
                  Restore your wallet using Seed Phrase.
                </StyledTitle>
              </RowContainer>

              <RowContainer
                direction={'column'}
                height={'50%'}
                justify={'space-evenly'}
                style={{ position: 'relative' }}
              >
                <InputWithPaste
                  type="text"
                  placeholder="Paste your seed phrase"
                  value={mnemonic}
                  onChange={(e) => setMnemonic(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onPasteClick={() =>
                    navigator.clipboard
                      .readText()
                      .then((clipText) => setMnemonic(clipText))
                  }
                />
                <InputWithEye
                  value={password}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setPassword(e.target.value)}
                  showPassword={showPassword}
                  onEyeClick={() => setShowPassword(!showPassword)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create Password"
                />
              </RowContainer>
              <Row width={'90%'} height={'20%'} justify={'space-between'}>
                <Link style={{ width: 'calc(50% - .5rem)' }} to="/">
                  <WhiteButton width={'100%'} theme={theme}>
                    Cancel
                  </WhiteButton>
                </Link>
                <VioletButton
                  theme={theme}
                  disabled={isDisabled}
                  width={'calc(50% - .5rem)'}
                  onClick={() => submit()}
                >
                  Restore
                </VioletButton>
              </Row>
            </RowContainer>
          </Card>
        )}

        <BottomLink
          isButton={isExtension && hash !== '#from_extension'}
          onClick={openExtensionInNewTab}
          to={'/create_wallet'}
          toText={'Create New Wallet'}
        />
      </RowContainer>
    </Body>
  );
};
