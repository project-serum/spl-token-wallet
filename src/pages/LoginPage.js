import React, { useState } from 'react';
import {
  storeMnemonicAndSeed,
} from '../utils/wallet-seed';
import {
  getAccountFromSeed,
  DERIVATION_PATH,
} from '../utils/walletProvider/localStorage.js';
import { useSolanaExplorerUrlSuffix } from '../utils/connection';
import { BalanceListItem } from '../components/BalancesList.js';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import CardActions from '@material-ui/core/CardActions';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useCallAsync } from '../utils/notifications';
import Link from '@material-ui/core/Link';

import { BtnCustom } from '../components/BtnCustom'


export function DerivedAccounts({ goBack, mnemonic, seed, password }) {
  const callAsync = useCallAsync();
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

  function submit() {
    callAsync(
      storeMnemonicAndSeed(
        mnemonic,
        seed,
        password,
        toDerivationPath(dPathMenuItem),
      ),
    );
  }

  return (
    <Card>
      <CardContent>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Derivable Accounts
          </Typography>
          <FormControl variant="outlined">
            <Select
              value={dPathMenuItem}
              onChange={(e) => setDPathMenuItem(e.target.value)}
            >
              <MenuItem value={DerivationPathMenuItem.Bip44Change}>
                {`m/44'/501'/0'/0'`}
              </MenuItem>
              <MenuItem value={DerivationPathMenuItem.Bip44}>
                {`m/44'/501'/0'`}
              </MenuItem>
              <MenuItem value={DerivationPathMenuItem.Deprecated}>
                {`m/501'/0'/0/0 (deprecated)`}
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        {accounts.map((acc) => {
          return (
            <Link
              href={
                `https://explorer.solana.com/account/${acc.publicKey.toBase58()}` +
                urlSuffix
              }
              target="_blank"
              rel="noopener"
            >
              <BalanceListItem
                publicKey={acc.publicKey}
                walletAccount={acc}
                expandable={false}
              />
            </Link>
          );
        })}
      </CardContent>
      <CardActions style={{ justifyContent: 'space-between' }}>
        <BtnCustom onClick={goBack}>Back</BtnCustom>
        <BtnCustom color="primary" onClick={submit}>
          Restore
        </BtnCustom>
      </CardActions>
    </Card>
  );
}

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
