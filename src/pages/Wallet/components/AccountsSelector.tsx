import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '@material-ui/core';
import { BtnCustom } from '../../../components/BtnCustom';
import { useWalletSelector } from '../../../utils/wallet';
import {
  RowContainer,
  Card,
  Title,
  StyledRadio,
  Row,
} from '../../commonStyles';
import { GreyTitle } from './AssetsTable';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AddIcon from '../../../images/addIcon.svg';
import ImportHardwareIcon from '../../../images/importHardware.svg';
import ExportMnemonicIcon from '../../../images/exportMnemonic.svg';
import DeleteAccountIcon from '../../../images/deleteAccount.svg';

import AddAccountPopup from './AddAccountPopup';
import AddHardwareWalletPopup from './AddHardwareWalletPopup';
import { ExportMnemonicDialog } from './ExportAccount';
import DeleteAccount from './DeleteAccount';

const StyledCard = styled(Card)`
  position: absolute;
  top: 100%;
  ${props => props.isFromPopup ? 'right: 0' : 'left: 0'};
  width: 25rem;
  height: auto;
  display: none;
  z-index: 2;
`;

const RowWithSelector = styled(Row)`
  position: relative;
  bottom: ${(props) => (props.isFromPopup ? '0' : '1rem')};
  padding: ${(props) => (props.isFromPopup ? '2rem' : '1rem 3rem 2rem 0')};
  left: ${(props) => (props.isFromPopup ? '2rem' : '0')};

  &:hover #accountSelector {
    display: flex;
  }
`;

const AccountsSelector = ({
  accountNameSize = '2.4rem',
  isFromPopup = false,
}: {
  accountNameSize?: string;
  isFromPopup?: boolean;
}) => {
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [
    isAddHardwareWalletDialogOpen,
    setIsAddHardwareWalletDialogOpen,
  ] = useState(false);
  const [isExportMnemonicOpen, setIsExportMnemonicOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

  const { accounts, addAccount, setWalletSelector } = useWalletSelector();
  const selectedAccount = accounts.find((a) => a.isSelected);
  const theme = useTheme();

  return (
    <RowWithSelector isFromPopup={isFromPopup}>
      <Title
        fontSize={accountNameSize}
        fontFamily="Avenir Next Demi"
        style={{ textTransform: 'capitalize', marginRight: '1rem' }}
      >
        {selectedAccount && selectedAccount.name}
      </Title>
      <ExpandMoreIcon fontSize="large" />

      <StyledCard isFromPopup={isFromPopup} id="accountSelector">
        <RowContainer
          align="flex-start"
          direction="column"
          padding="1.6rem 1.6rem .5rem 1.6rem"
        >
          <Title
            fontFamily="Avenir Next Demi"
            fontSize="1.4rem"
            style={{ marginBottom: '1rem' }}
          >
            Your Accounts
          </Title>
          <RowContainer
            style={{ borderBottom: theme.customPalette.border.new }}
            direction="column"
            margin="0 0 1rem 0"
            padding="0 0 1rem 0"
          >
            {accounts.map(({ isSelected, name, selector }) => {
              return (
                <RowContainer
                  justify="flex-start"
                  padding="0rem 1.6rem 0rem 0"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setWalletSelector(selector);
                  }}
                >
                  <StyledRadio theme={theme} checked={isSelected} />
                  <Title>{name}</Title>
                </RowContainer>
              );
            })}
          </RowContainer>
          <RowContainer direction="column">
            <BtnCustom
              textTransform={'capitalize'}
              borderWidth="0"
              height={'100%'}
              padding={'1.2rem 0 1.2rem 1.6rem'}
              style={{ justifyContent: 'flex-start' }}
              btnWidth="100%"
              onClick={() => setIsAddAccountOpen(true)}
            >
              <img
                src={AddIcon}
                alt="addIcon"
                style={{ marginRight: '1rem' }}
              />
              <GreyTitle theme={theme}>Add account</GreyTitle>
            </BtnCustom>
            <BtnCustom
              textTransform={'capitalize'}
              borderWidth="0"
              height={'100%'}
              padding={'1.2rem 0 1.2rem 1.6rem'}
              style={{ justifyContent: 'flex-start' }}
              btnWidth="100%"
              onClick={() => setIsAddHardwareWalletDialogOpen(true)}
            >
              <img
                src={ImportHardwareIcon}
                alt="import hardware"
                style={{ marginRight: '1rem' }}
              />
              <GreyTitle theme={theme}>Import Hardware Wallet</GreyTitle>
            </BtnCustom>
            <BtnCustom
              textTransform={'capitalize'}
              borderWidth="0"
              height={'100%'}
              padding={'1.2rem 0 1.2rem 1.6rem'}
              style={{ justifyContent: 'flex-start' }}
              btnWidth="100%"
              onClick={() => setIsExportMnemonicOpen(true)}
            >
              <img
                src={ExportMnemonicIcon}
                alt="export mnemonic"
                style={{ marginRight: '1rem' }}
              />
              <GreyTitle theme={theme}>Export Mnemonic</GreyTitle>
            </BtnCustom>
            <BtnCustom
              textTransform={'capitalize'}
              borderWidth="0"
              height={'100%'}
              padding={'1.2rem 0 1.2rem 1.6rem'}
              style={{ justifyContent: 'flex-start' }}
              btnWidth="100%"
              onClick={() => setIsDeleteAccountOpen(true)}
            >
              <img
                src={DeleteAccountIcon}
                alt="forget wallet"
                style={{ marginRight: '1rem' }}
              />
              <GreyTitle theme={theme}>Forget wallet</GreyTitle>
            </BtnCustom>
          </RowContainer>
        </RowContainer>
      </StyledCard>

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
    </RowWithSelector>
  );
};

export default AccountsSelector;
