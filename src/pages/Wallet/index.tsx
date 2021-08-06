import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';

import AccountInfo from './components/AccountInfo';
import AssetsTable from './components/AssetsTable';
import ActivityTable from './components/ActivityTable';
import SendDialog from './components/SendPopup';
import ReceiveDialog from './components/ReceivePopup';
import AddTokenDialog from './components/AddTokenPopup';

import { RowContainer } from '../commonStyles';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '../../utils/wallet';
import { getAllTokensData, TokenInfo, useInterval } from '../../utils/utils';
import { MarketsDataSingleton } from '../../components/MarketsDataSingleton';
import { useConnection } from '../../utils/connection';
import { useTokenInfos } from '../../utils/tokens/names';
import CloseTokenAccountDialog from './components/CloseTokenAccountPopup';

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
  const wallet = useWallet();
  const [selectedTokenData, selectToken] = useState<{
    publicKey: PublicKey;
    isAssociatedToken: boolean;
  }>({
    publicKey: wallet.publicKey,
    isAssociatedToken: false,
  });
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [
    closeTokenAccountDialogOpen,
    setCloseTokenAccountDialogOpen,
  ] = useState(false);

  const hash = sessionStorage.getItem('hash');
  const [showAddTokenDialog, setShowAddTokenDialog] = useState(
    hash === '#add_token_to_rebalance',
  );
  const [activeTab, setTabActive] = useState('assets');

  const connection = useConnection();
  const tokenInfos = useTokenInfos();
  const [refreshCounter, changeRefreshCounter] = useState(0);
  const [marketsData, setMarketsData] = useState<Map<string, any>>(new Map());
  const [allTokensData, setAllTokensData] = useState<Map<string, TokenInfo>>(
    new Map(),
  );

  const walletPubkey = wallet?.publicKey?.toString();
  const refreshTokensData = () => changeRefreshCounter(refreshCounter + 1);
  const isTokenSelected =
    allTokensData.get(selectedTokenData.publicKey.toString()) &&
    selectedTokenData.publicKey;

  useInterval(refreshTokensData, 5 * 1000);

  useEffect(() => {
    const getData = async () => {
      const data = await MarketsDataSingleton.getData();
      const allTokensInfo = await getAllTokensData(
        new PublicKey(walletPubkey),
        connection,
        tokenInfos,
      );

      setMarketsData(data);
      setAllTokensData(allTokensInfo);
    };

    getData();
  }, [connection, walletPubkey, tokenInfos, refreshCounter]);

  return (
    <MainWalletContainer>
      {window.opener && <Redirect to={'/connect_popup'} />}
      <AccountInfo marketsData={marketsData} allTokensData={allTokensData} />
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
          marketsData={marketsData}
          allTokensData={allTokensData}
          refreshTokensData={refreshTokensData}
          selectToken={selectToken}
          setSendDialogOpen={setSendDialogOpen}
          setDepositDialogOpen={setDepositDialogOpen}
          setShowAddTokenDialog={setShowAddTokenDialog}
          setCloseTokenAccountDialogOpen={setCloseTokenAccountDialogOpen}
        />

        <ActivityTable isActive={activeTab === 'activity'} />
      </TableContainer>
      {isTokenSelected && (
        <SendDialog
          open={sendDialogOpen}
          balanceInfo={allTokensData.get(
            selectedTokenData.publicKey.toString(),
          )}
          refreshTokensData={refreshTokensData}
          onClose={() => setSendDialogOpen(false)}
          publicKey={selectedTokenData.publicKey}
        />
      )}
      {isTokenSelected && (
        <ReceiveDialog
          open={depositDialogOpen}
          onClose={() => setDepositDialogOpen(false)}
          isAssociatedToken={selectedTokenData.isAssociatedToken}
          publicKey={selectedTokenData.publicKey}
        />
      )}

      <AddTokenDialog
        open={showAddTokenDialog}
        allTokensData={allTokensData}
        balanceInfo={allTokensData.get(wallet.publicKey.toString())}
        refreshTokensData={refreshTokensData}
        onClose={() => setShowAddTokenDialog(false)}
      />
      {/* <TokenInfoDialog
        open={tokenInfoDialogOpen}
        onClose={() => setTokenInfoDialogOpen(false)}
        publicKey={selectedPublicKey}
      /> */}
      {isTokenSelected && (
        <CloseTokenAccountDialog
          open={closeTokenAccountDialogOpen}
          onClose={() => setCloseTokenAccountDialogOpen(false)}
          publicKey={selectedTokenData.publicKey}
          refreshTokensData={refreshTokensData}
          balanceInfo={allTokensData.get(
            selectedTokenData.publicKey.toString(),
          )}
        />
      )}
    </MainWalletContainer>
  );
};

export default Wallet;
