import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
  useBalanceInfo,
  useWallet,
  useWalletSelector,
} from '../../../utils/wallet';
import { Row, RowContainer, Title, ExclamationMark } from '../../commonStyles';
import { formatNumberToUSFormat, stripDigitPlaces } from '../../../utils/utils';

import TotalBalance from './TotalBalance';
import AccountSelector from './AccountsSelector';
import AddAccountPopup from './AddAccountPopup';
import AddHardwareWalletPopup from './AddHardwareWalletPopup';
import { ExportMnemonicDialog } from './ExportAccount';
import DeleteAccount from './DeleteAccount';

const RowWithSelector = styled(Row)`
  position: relative;
  bottom: 1rem;
  padding: 1rem 3rem 3rem 0;

  &:hover #accountSelector {
    display: flex;
  }
`;

const AccountInfoContainer = styled(RowContainer)`
  width: 100%;
  height: auto;
`

const AccountInfo = () => {
  const theme = useTheme();
  const wallet = useWallet();
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [
    isAddHardwareWalletDialogOpen,
    setIsAddHardwareWalletDialogOpen,
  ] = useState(false);
  const [isExportMnemonicOpen, setIsExportMnemonicOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

  const { accounts, addAccount, setWalletSelector } = useWalletSelector();
  const selectedAccount = accounts.find((a) => a.isSelected);

  const balanceInfo = useBalanceInfo(wallet.publicKey);
  let { amount, decimals } = balanceInfo || {
    amount: 0,
    decimals: 8,
    mint: null,
    tokenName: 'Loading...',
    tokenSymbol: '--',
  };

  return (
    <AccountInfoContainer padding="5rem 4rem">
      <Row
        width="40%"
        height="100%"
        direction="column"
        align="flex-start"
        justify="space-between"
      >
        <RowWithSelector>
          <Title
            fontSize="2.4rem"
            fontFamily="Avenir Next Demi"
            style={{ textTransform: 'capitalize', marginRight: '1rem' }}
          >
            {selectedAccount && selectedAccount.name}
          </Title>
          <ExpandMoreIcon fontSize="large" />
          <AccountSelector
            setIsAddAccountOpen={setIsAddAccountOpen}
            setIsAddHardwareWalletDialogOpen={setIsAddHardwareWalletDialogOpen}
            setIsExportMnemonicOpen={setIsExportMnemonicOpen}
            setIsDeleteAccountOpen={setIsDeleteAccountOpen}
          />
        </RowWithSelector>
        <Title style={{ position: 'relative' }} color={theme.customPalette.grey.light}>
          {wallet.publicKey.toBase58()}
        </Title>
      </Row>
      <Row width="60%" height="100%">
        <Row
          width="26rem"
          height="100%"
          margin="0 2rem 0 0"
          padding=".5rem 1.5rem"
          direction="column"
          align="flex-start"
          justify="space-between"
          style={{
            background: 'linear-gradient(135deg, #1331AD 0%, #95363F 100%)',
            borderRadius: '.6rem',
          }}
        >
          <Title
            fontSize="1.4rem"
            fontFamily={'Avenir Next Demi'}
            color={theme.customPalette.grey.light}
          >
            Total Balance
          </Title>
          <Title fontSize="2.4rem" fontFamily={'Avenir Next Demi'}>
            <TotalBalance />
          </Title>
        </Row>
        <Row
          width="26rem"
          height="100%"
          margin="0 4rem 0 0"
          padding=".5rem 1.5rem"
          direction="column"
          align="flex-start"
          justify="space-between"
          style={{
            background: 'linear-gradient(135deg, #1331AD 0%, #3B8D17 100%)',
            borderRadius: '.6rem',
          }}
        >
          <Title
            fontSize="1.4rem"
            fontFamily={'Avenir Next Demi'}
            color={theme.customPalette.grey.light}
          >
            SOL Balance
          </Title>
          <Title fontSize="2.4rem" fontFamily={'Avenir Next Demi'}>
            {formatNumberToUSFormat(
              stripDigitPlaces(amount / Math.pow(10, decimals), decimals),
            )}{' '}
            SOL
          </Title>
        </Row>
        <Row height="100%">
          <Row
            height="100%"
            direction="column"
            justify="space-around"
            align="flex-start"
          >
            <Title
              fontFamily="Avenir Next"
              fontSize="1.4rem"
              color={theme.customPalette.orange.dark}
              style={{ whiteSpace: 'nowrap' }}
            >
              SOL is a fuel of Solana Network.
            </Title>
            <Title
              fontFamily="Avenir Next"
              fontSize="1.4rem"
              color={theme.customPalette.orange.dark}
              style={{ whiteSpace: 'nowrap' }}
            >
              You need to keep some SOL
            </Title>
            <Title
              fontFamily="Avenir Next"
              fontSize="1.4rem"
              color={theme.customPalette.orange.dark}
              style={{ whiteSpace: 'nowrap' }}
            >
              on your wallet to work properly with it.
            </Title>
          </Row>
          <ExclamationMark
            theme={theme}
            margin={'0 0 0 2rem'}
            fontSize="7rem"
          />
        </Row>
      </Row>

      <AddAccountPopup
        open={isAddAccountOpen}
        onAdd={({ name, importedAccount }) => {
          addAccount({ name, importedAccount });
          setWalletSelector({
            walletIndex: importedAccount ? undefined : accounts.length,
            importedPubkey: importedAccount
              ? importedAccount.publicKey.toString()
              : undefined,
            ledger: false,
          });
          setIsAddAccountOpen(false);
        }}
        onClose={() => setIsAddAccountOpen(false)}
      />

      <AddHardwareWalletPopup
        open={isAddHardwareWalletDialogOpen}
        onClose={() => setIsAddHardwareWalletDialogOpen(false)}
        onAdd={(pubKey) => {
          addAccount({
            name: 'Hardware wallet',
            importedAccount: pubKey.toString(),
            ledger: true,
          });
          setWalletSelector({
            walletIndex: undefined,
            importedPubkey: pubKey.toString(),
            ledger: true,
          });
        }}
      />
      <ExportMnemonicDialog
        open={isExportMnemonicOpen}
        onClose={() => setIsExportMnemonicOpen(false)}
      />
      <DeleteAccount
        open={isDeleteAccountOpen}
        onClose={() => setIsDeleteAccountOpen(false)}
      />
    </AccountInfoContainer>
  );
};

export default AccountInfo;
