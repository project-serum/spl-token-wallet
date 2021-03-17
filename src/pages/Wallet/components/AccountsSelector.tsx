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
  Legend,
} from '../../commonStyles';
import { GreyTitle } from './AssetsTable';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AddIcon from '../../../images/addIcon.svg';
import ImportHardwareIcon from '../../../images/importHardware.svg';
import ExportMnemonicIcon from '../../../images/exportMnemonic.svg';
import DeleteAccountIcon from '../../../images/deleteAccount.svg';

import AddAccountPopup from './AddAccountPopup';
import AddHardwareWalletPopup from './AddHardwareWalletPopup';
import ExportAccount, { ExportMnemonicDialog } from './ExportAccount';
import ForgetWallet from './ForgetWallet';

const StyledCard = styled(Card)`
  position: absolute;
  top: 100%;
  ${(props) => (props.isFromPopup ? 'right: 0' : 'left: 0')};
  width: 28rem;
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

const WalletActionButton = ({ theme, openPopup, icon, buttonText }) => {
  return (
    <BtnCustom
      textTransform={'capitalize'}
      borderWidth="0"
      height={'100%'}
      padding={'1.2rem 0 1.2rem 1rem'}
      style={{ justifyContent: 'flex-start' }}
      btnWidth="100%"
      onClick={openPopup}
    >
      <img
        src={icon}
        alt={buttonText}
        style={{ marginRight: '1rem', width: '2rem', height: '2rem' }}
      />
      <GreyTitle theme={theme}>{buttonText}</GreyTitle>
    </BtnCustom>
  );
};

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
  const [isExportAccountOpen, setIsExportAccountOpen] = useState(false);
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
        <RowContainer align="flex-start" direction="column" padding="1.6rem 0">
          <RowContainer padding="0 1.6rem" margin="1rem 0 0 0">
            <Title
              fontFamily="Avenir Next Demi"
              fontSize="1.4rem"
              style={{ whiteSpace: 'nowrap', paddingRight: '1rem' }}
            >
              Your Accounts
            </Title>
            <Legend />
          </RowContainer>
          <RowContainer
            style={{
              display: 'block',
              borderBottom: theme.customPalette.border.new,
              maxHeight: '30rem',
              overflowY: 'auto',
            }}
            direction="column"
            margin="0 0 1rem 0"
            padding="0 1.6rem 0rem 1.6rem"
          >
            {accounts.map(({ isSelected, name, selector }, i) => {
              return (
                <RowContainer
                  direction="row"
                  align={'center'}
                  justify="space-between"
                  padding=".5rem 1.6rem .5rem 0"
                  style={{
                    cursor: 'pointer',
                    borderBottom:
                      accounts.length === i + 1
                        ? 'none'
                        : theme.customPalette.border.new,
                  }}
                  onClick={() => {
                    setWalletSelector(selector);
                  }}
                >
                  <Row justify="flex-start">
                    <StyledRadio theme={theme} checked={isSelected} />
                    <Title
                      style={{
                        width: '100%',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis ',
                      }}
                    >
                      {name && name.length > 14
                        ? name.slice(0, 10) + '...'
                        : name}
                    </Title>
                  </Row>
                  <Row>
                    <BtnCustom
                      btnWidth="auto"
                      textTransform="capitalize"
                      color={theme.customPalette.blue.serum}
                      borderWidth="0"
                      fontFamily="Avenir Next Demi"
                      fontSize="1rem"
                      onClick={() => setIsExportAccountOpen(true)}
                    >
                      Export Private Key
                    </BtnCustom>
                  </Row>
                </RowContainer>
              );
            })}
          </RowContainer>
          <RowContainer padding="0 1.6rem" direction="column">
            <WalletActionButton
              theme={theme}
              icon={AddIcon}
              buttonText={'Add Account'}
              openPopup={() => setIsAddAccountOpen(true)}
            />
            <WalletActionButton
              theme={theme}
              icon={ImportHardwareIcon}
              buttonText={'Import Hardware Wallet'}
              openPopup={() => setIsAddHardwareWalletDialogOpen(true)}
            />
            <WalletActionButton
              theme={theme}
              icon={ExportMnemonicIcon}
              buttonText={'Export Mnemonic'}
              openPopup={() => setIsExportMnemonicOpen(true)}
            />
            <WalletActionButton
              theme={theme}
              icon={DeleteAccountIcon}
              buttonText={'Forget wallet for this device'}
              openPopup={() => setIsDeleteAccountOpen(true)}
            />
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
      <ExportAccount
        open={isExportAccountOpen}
        onClose={() => setIsExportAccountOpen(false)}
      />
      <ForgetWallet
        open={isDeleteAccountOpen}
        openExportMnemonicPopup={() => setIsExportMnemonicOpen(true)}
        onClose={() => setIsDeleteAccountOpen(false)}
      />
    </RowWithSelector>
  );
};

export default AccountsSelector;
