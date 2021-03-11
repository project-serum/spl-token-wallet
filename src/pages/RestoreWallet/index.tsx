import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

import {
  mnemonicToSeed,
  storeMnemonicAndSeed,
} from '../../utils/wallet-seed';
import {
  DERIVATION_PATH,
} from '../../utils/walletProvider/localStorage.js';
import { useCallAsync } from '../../utils/notifications';
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

const DerivationPathMenuItem = {
  Deprecated: 0,
  Bip44: 1,
  Bip44Change: 2,
};

function toDerivationPath(dPathMenuItem) {
  switch (dPathMenuItem) {
    case DerivationPathMenuItem.Deprecated:
      return DERIVATION_PATH.deprecated;
    case DerivationPathMenuItem.Bip44:
      return DERIVATION_PATH.bip44;
    case DerivationPathMenuItem.Bip44Change:
      return DERIVATION_PATH.bip44Change;
    default:
      throw new Error(`invalid derivation path: ${dPathMenuItem}`);
  }
}

export const RestorePage = () => {
  const [redirectToWallet, setRedirectToWallet] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');

  const theme = useTheme();
  const callAsync = useCallAsync();

  const [dPathMenuItem] = useState(
    DerivationPathMenuItem.Bip44Change,
  );

  // for list of addresses
  // const urlSuffix = useSolanaExplorerUrlSuffix();
  // const accounts = [...Array(10)].map((_, idx) => {
  //   return getAccountFromSeed(
  //     Buffer.from(seed, 'hex'),
  //     idx,
  //     toDerivationPath(dPathMenuItem),
  //   );
  // });

  const isMnemonicCorrect = validateMnemonic(mnemonic);

  const submit = async () => {
    if (!isMnemonicCorrect || password === '') return;

    await mnemonicToSeed(mnemonic).then(async (seed) => {
      console.log('seed', seed)

      await callAsync(
        storeMnemonicAndSeed(
          mnemonic,
          seed,
          password,
          toDerivationPath(dPathMenuItem),
        ),
      );
  
      console.log('stRedirect')
  
      await setRedirectToWallet(true);
    });
  };

  return (
    <Body>
      {redirectToWallet && <Redirect to="/wallet" />}
      <Logo />
      <Card>
        <RowContainer
          direction={'column'}
          justify={'space-between'}
          height={'75%'}
        >
          <RowContainer
            direction={'column'}
            justify={'space-around'}
            height={'20%'}
          >
            <Title>Restore your wallet using your 12 seed words.</Title>
            <Title>
              Note that this will delete any existing wallet on this device.
            </Title>
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
              onPasteClick={() =>
                navigator.clipboard
                  .readText()
                  .then((clipText) => setMnemonic(clipText))
              }
            />
            <InputWithEye
              value={password}
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
              disabled={!isMnemonicCorrect || password === ''}
              width={'calc(50% - .5rem)'}
              onClick={submit}
            >
              Restore
            </VioletButton>
          </Row>
        </RowContainer>
      </Card>
      <BottomLink to={'/create_wallet'} toText={'Create Wallet'} />
    </Body>
  );
};
