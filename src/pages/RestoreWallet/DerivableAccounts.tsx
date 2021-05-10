import React, { useState } from 'react';
import styled from 'styled-components';
import { storeMnemonicAndSeed } from '../../utils/wallet-seed';
import {
  getAccountFromSeed,
  DERIVATION_PATH,
} from '../../utils/walletProvider/localStorage.js';
import { useSolanaExplorerUrlSuffix } from '../../utils/connection';
import FingerprintIcon from '@material-ui/icons/Fingerprint';

import {
  Card,
  Row,
  Title,
  VioletButton,
  WhiteButton,
  RowContainer,
} from '../commonStyles';

import { useTheme } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useCallAsync } from '../../utils/notifications';
import Link from '@material-ui/core/Link';

import CubeLogo from '../../images/oldCubeLogo.svg';
import { useBalanceInfo } from '../../utils/wallet';
import { abbreviateAddress, stripDigitPlaces } from '../../utils/utils';
import { findAssociatedTokenAddress } from '../../utils/tokens';
import AttentionComponent from '../../components/Attention';

const StyledRowContainer = styled(RowContainer)`
  & svg {
    top: auto;
  }
`;

const StyledTitle = styled(Title)`
  font-size: 1.2rem;
  @media (max-width: 540px) {
    font-size: 1.3rem;
  }
`;

export default function DerivedAccounts({
  goBack,
  mnemonic,
  seed,
  password,
  setRedirectToWallet,
}) {
  const theme = useTheme();
  const callAsync = useCallAsync();
  const [, setForceUpdate] = useState(false);
  const urlSuffix = useSolanaExplorerUrlSuffix();
  const [dPathMenuItem, setDPathMenuItem] = useState(
    DerivationPathMenuItem.Bip44Change,
  );

  const accounts = [...Array(10)].map((_, idx) => {
    return getAccountFromSeed(
      Buffer.from(seed, 'hex'),
      idx,
      toDerivationPath(dPathMenuItem),
    );
  });

  async function submit() {
    await callAsync(
      storeMnemonicAndSeed(
        mnemonic,
        seed,
        password,
        toDerivationPath(dPathMenuItem),
      ),
    );

    await setRedirectToWallet(true);
  }

  // const handleKeyDown = (event: any) => {
  //   if (event.key === 'Enter') {
  //     submit();
  //   }
  // };

  return (
    <Card minHeight={'60rem'} height="auto" padding="2rem 0">
      <RowContainer width="90%" direction="column">
        <StyledRowContainer justify="space-between" margin="0 0 2rem 0">
          <Title fontSize="1.6rem">Derivable Accounts</Title>
          <FormControl variant="outlined" style={{ borderColor: '#fff' }}>
            <Select
              style={{ borderColor: '#fff', fontSize: '1.3rem' }}
              value={dPathMenuItem}
              onChange={(e: any) => setDPathMenuItem(e.target.value)}
            >
              <MenuItem
                style={{ fontSize: '1.3rem' }}
                value={DerivationPathMenuItem.Bip44Change}
              >
                {`m/44'/501'/0'/0'`}
              </MenuItem>
              <MenuItem
                style={{ fontSize: '1.3rem' }}
                value={DerivationPathMenuItem.Bip44}
              >
                {`m/44'/501'/0'`}
              </MenuItem>
              <MenuItem
                style={{ fontSize: '1.3rem' }}
                value={DerivationPathMenuItem.Deprecated}
              >
                {`m/501'/0'/0/0 (deprecated)`}
              </MenuItem>
            </Select>
          </FormControl>
        </StyledRowContainer>
        <div
          style={{
            overflowY: 'auto',
            height: '30rem',
            margin: '0 0 2rem 0',
            width: '100%',
            padding: '0 2rem',
            background: '#383B45',
          }}
        >
          {accounts.map((acc: any) => {
            return (
              <RowContainer
                justify="flex-start"
                padding=".5rem 0"
                style={{ borderBottom: theme.customPalette.border.new }}
              >
                <Link
                  href={
                    `https://explorer.solana.com/account/${acc.publicKey.toBase58()}` +
                    urlSuffix
                  }
                  target="_blank"
                  rel="noopener"
                  style={{ textDecoration: 'none' }}
                >
                  <AccountItem
                    theme={theme}
                    publicKey={acc.publicKey}
                    setForceUpdate={setForceUpdate}
                  />
                </Link>
              </RowContainer>
            );
          })}
        </div>

        <AttentionComponent
          blockHeight={'auto'}
          iconStyle={{ margin: '0 3rem' }}
          textStyle={{ padding: '1rem 1rem 1rem 0' }}
          text={
            'Only the first account in the list will be restored automatically. To restore the rest of the accounts - continue to create new accounts through the wallet interface. '
          }
        />

        <RowContainer justify="space-between" margin="2rem 0 0 0">
          <WhiteButton theme={theme} width="calc(50% - .5rem)" onClick={goBack}>
            Back
          </WhiteButton>
          <VioletButton
            theme={theme}
            width="calc(50% - .5rem)"
            onClick={submit}
          >
            Restore
          </VioletButton>
        </RowContainer>
      </RowContainer>
    </Card>
  );
}

const associatedTokensCache = {};

const AccountItem = ({ theme, publicKey, setForceUpdate }) => {
  const balanceInfo = useBalanceInfo(publicKey);

  let { amount, decimals, mint, tokenName, tokenSymbol } = balanceInfo || {
    amount: 0,
    decimals: 8,
    mint: null,
    tokenName: 'Loading...',
    tokenSymbol: '--',
  };

  // Fetch and cache the associated token address.
  if (publicKey && mint) {
    if (
      associatedTokensCache[publicKey.toString()] === undefined ||
      associatedTokensCache[publicKey.toString()][mint.toString()] === undefined
    ) {
      findAssociatedTokenAddress(publicKey, mint).then((assocTok) => {
        let walletAccounts = Object.assign(
          {},
          associatedTokensCache[publicKey.toString()],
        );
        walletAccounts[mint.toString()] = assocTok;
        associatedTokensCache[publicKey.toString()] = walletAccounts;
        if (assocTok.equals(publicKey)) {
          // Force a rerender now that we've cached the value.
          setForceUpdate((forceUpdate) => !forceUpdate);
        }
      });
    }
  }

  const isAssociatedToken =
    publicKey && mint && associatedTokensCache[publicKey.toString()]
      ? associatedTokensCache[publicKey.toString()][mint.toString()]
      : false;

  return (
    <RowContainer>
      <img
        src={CubeLogo}
        alt={'logo'}
        style={{
          borderRadius: '0',
          height: '6rem',
          padding: '1rem 0.5rem 1rem 1rem',
        }}
      />
      <Row margin="0 0 0 1rem" direction="column" align="flex-start">
        <Title color={theme.customPalette.green.light}>{`${stripDigitPlaces(
          amount / Math.pow(10, decimals),
          decimals,
        )} ${tokenName ?? abbreviateAddress(mint)} ${
          tokenSymbol ? ` (${tokenSymbol})` : null
        }`}</Title>

        <StyledTitle>
          {isAssociatedToken && (
            <Row margin="0 1rem 0 0">
              <FingerprintIcon style={{ width: '2rem' }} />
            </Row>
          )}
          {publicKey.toBase58()}
        </StyledTitle>
      </Row>
    </RowContainer>
  );
};

// Material UI's Select doesn't render properly when using an `undefined` value,
// so we define this type and the subsequent `toDerivationPath` translator as a
// workaround.
//
// DERIVATION_PATH.deprecated is always undefined.
const DerivationPathMenuItem = {
  Deprecated: 0,
  Bip44: 1,
  Bip44Change: 2,
};

function toDerivationPath(dPathMenuItem: number) {
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
