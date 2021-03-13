import { Radio, useTheme } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { BtnCustom } from '../../../components/BtnCustom';
import { useWalletSelector } from '../../../utils/wallet';
import { RowContainer, Card, Title } from '../../commonStyles';
import { GreyTitle } from './AssetsTable';

import AddIcon from '../../../images/addIcon.svg';
import ImportHardwareIcon from '../../../images/importHardware.svg';
import ExportMnemonicIcon from '../../../images/exportMnemonic.svg';
import DeleteAccountIcon from '../../../images/deleteAccount.svg';

const StyledCard = styled(Card)`
  position: absolute;
  top: 100%;
  left: 0;
  width: 25rem;
  height: auto;
  display: none;
  z-index: 2;
`;

const AccountsSelector = ({
  setIsAddAccountOpen,
  setIsAddHardwareWalletDialogOpen,
  setIsExportMnemonicOpen,
  setIsDeleteAccountOpen,
}: {
  setIsAddAccountOpen: (isOpen: boolean) => void;
  setIsAddHardwareWalletDialogOpen: (isOpen: boolean) => void;
  setIsExportMnemonicOpen: (isOpen: boolean) => void;
  setIsDeleteAccountOpen: (isOpen: boolean) => void;
}) => {
  const { accounts, setWalletSelector } = useWalletSelector();
  const theme = useTheme();

  return (
    <StyledCard id="accountSelector">
      <RowContainer
        align="flex-start"
        direction="column"
        padding="1.6rem 1.6rem .5rem 1.6rem"
      >
        <Title fontFamily="Avenir Next Demi" fontSize="1.4rem">
          Your Accounts
        </Title>
        <RowContainer
          style={{ borderBottom: theme.customPalette.border.new }}
          direction="column"
          margin="0 0 1rem 0"
        >
          {accounts.map(({ isSelected, name, selector }) => {
            return (
              <RowContainer
                justify="flex-start"
                padding="1rem 1.6rem 1rem 0"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setWalletSelector(selector);
                }}
              >
                <Radio checked={isSelected} />
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
            <img src={AddIcon} alt="addIcon" style={{ marginRight: '1rem' }} />
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
              alt="delete account"
              style={{ marginRight: '1rem' }}
            />
            <GreyTitle theme={theme}>Delete Account</GreyTitle>
          </BtnCustom>
        </RowContainer>
      </RowContainer>
    </StyledCard>
  );
};

export default AccountsSelector;
