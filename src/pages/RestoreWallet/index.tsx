import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { mnemonicToSeed } from '../../utils/wallet-seed';
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
import AttentionComponent from '../../components/Attention';

export const RestorePage = () => {
  const [redirectToWallet, setRedirectToWallet] = useState(false);
  const [showDerivation, setShowDerivation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [seed, setSeed] = useState('');

  const theme = useTheme();
  const isMnemonicCorrect = validateMnemonic(mnemonic);
  const isDisabled = !isMnemonicCorrect || password === '';

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
      {redirectToWallet && <Redirect to="/wallet" />}
      <Logo />
      {showDerivation ? (
        <DerivableAccounts
          goBack={() => setShowDerivation(false)}
          mnemonic={mnemonic}
          password={password}
          seed={seed}
          setRedirectToWallet={setRedirectToWallet}
        />
      ) : (
        <Card>
          <RowContainer
            direction={'column'}
            justify={'space-between'}
            height={'100%'}
          >
            <RowContainer
              direction={'column'}
              justify={'space-around'}
              height={'20%'}
            >
              <Title>Restore your wallet using Seed Phrase.</Title>
            </RowContainer>
            <RowContainer width="90%">
              <AttentionComponent
                text={
                  'Note that this will delete any existing wallet on this device. Please unlock your current wallet and make sure you save the Seed Phrase before you restore another wallet.'
                }
                textStyle={{
                  fontSize: '1.4rem',
                  lineHeight: '2rem',
                  fontFamily: 'Avenir Next',
                }}
                iconStyle={{
                  margin: '0 2rem 0 3rem',
                }}
                blockHeight="8rem"
              />
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

      <BottomLink to={'/create_wallet'} toText={'Create Wallet'} />
    </Body>
  );
};
