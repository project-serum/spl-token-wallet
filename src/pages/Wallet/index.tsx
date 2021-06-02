import React, { useState } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';

import AccountInfo from './components/AccountInfo';
import AssetsTable from './components/AssetsTable';
import ActivityTable from './components/ActivityTable';
import SendDialog from './components/SendPopup';
import ReceiveDialog from './components/ReceivePopup';
import AddTokenDialog from './components/AddTokenPopup';

import { RowContainer } from '../commonStyles';

const MainWalletContainer = styled(RowContainer)`
  flex-direction: column;
  height: 100%;
  padding: 0 3rem 3rem 3rem;
  @media (max-width: 540px) {
    padding: 0;
  }
`;

const Switcher = styled.button`
  display: none;

  @media (max-width: 540px) {
    outline: none;
    display: block;
    width: 50%;
    color: ${(props) => (props.isTabActive ? ' #f5f5fb' : '#96999C')};
    background: none;
    font-family: 'Avenir Next Demi';
    height: 4rem;
    cursor: pointer;
    border: none;
    border-bottom: ${(props) =>
      props.isTabActive ? '0.2rem solid #f5f5fb' : '0.2rem solid #96999C'};
  }
`;

const SwitcherRow = styled(RowContainer)`
  display: none;

  @media (max-width: 540px) {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
`;

const TableContainer = styled(RowContainer)`
  max-height: 80%;
  height: 100%;
  justify-content: space-between;

  @media (max-width: 540px) {
    height: 60%;
    flex-direction: column;
  }
`;

const Wallet = () => {
  const [selectedTokenData, selectToken] = useState<{
    publicKey: string;
    isAssociatedToken: boolean;
  }>({
    publicKey: '',
    isAssociatedToken: false,
  });
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [showAddTokenDialog, setShowAddTokenDialog] = useState(false);
  const [activeTab, setTabActive] = useState('assets');

  // const [tokenInfoDialogOpen, setTokenInfoDialogOpen] = useState(false);
  // const [
  //   closeTokenAccountDialogOpen,
  //   setCloseTokenAccountDialogOpen,
  // ] = useState(false);

  return (
    <MainWalletContainer>
      {window.opener && <Redirect to={'/connect_popup'} />}

      <AccountInfo />
      <TableContainer>
        <SwitcherRow>
          <Switcher
            isTabActive={activeTab === 'assets'}
            onClick={() => {
              setTabActive('assets');
            }}
          >
            Assets
          </Switcher>
          <Switcher
            isTabActive={activeTab === 'activity'}
            onClick={() => {
              setTabActive('activity');
            }}
          >
            Activity
          </Switcher>
        </SwitcherRow>

        <AssetsTable
          isActive={activeTab === 'assets'}
          selectToken={selectToken}
          setSendDialogOpen={setSendDialogOpen}
          setDepositDialogOpen={setDepositDialogOpen}
          setShowAddTokenDialog={setShowAddTokenDialog}
        />

        <ActivityTable isActive={activeTab === 'activity'} />
      </TableContainer>

      {selectedTokenData.publicKey && (
        <SendDialog
          open={sendDialogOpen}
          onClose={() => setSendDialogOpen(false)}
          publicKey={selectedTokenData.publicKey}
        />
      )}
      {selectedTokenData.publicKey && (
        <ReceiveDialog
          open={depositDialogOpen}
          onClose={() => setDepositDialogOpen(false)}
          isAssociatedToken={selectedTokenData.isAssociatedToken}
          publicKey={selectedTokenData.publicKey}
        />
      )}

      <AddTokenDialog
        open={showAddTokenDialog}
        onClose={() => setShowAddTokenDialog(false)}
      />

      {/* 
      <TokenInfoDialog
        open={tokenInfoDialogOpen}
        onClose={() => setTokenInfoDialogOpen(false)}
        publicKey={selectedPublicKey}
      />
      <CloseTokenAccountDialog
        open={closeTokenAccountDialogOpen}
        onClose={() => setCloseTokenAccountDialogOpen(false)}
        publicKey={selectedPublicKey}
      /> */}
    </MainWalletContainer>
  );
};

export default Wallet;
