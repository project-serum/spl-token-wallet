import React, { useState } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import {
  Card,
  Row,
  Title,
  VioletButton,
  BoldTitle,
  ColorText,
  Legend,
  RowContainer,
  ListCard,
} from '../../commonStyles';
import { InputWithSearch, TextareaWithCopy } from '../../../components/Input';

import Attention from '../../../images/attention.svg';
import BottomLink from '../../../components/BottomLink';
import { useTheme } from '@material-ui/core';
import {
  refreshWalletPublicKeys,
  useBalanceInfo,
  useWallet,
  useWalletPublicKeys,
  useWalletTokenAccounts,
} from '../../../utils/wallet';
import { refreshAccountInfo } from '../../../utils/connection';

import {
  TokenListItem,
  feeFormat,
} from '../../Wallet/components/AddTokenPopup';
import {
  abbreviateAddress,
  formatNumberToUSFormat,
  isExtension,
  stripDigitPlaces,
} from '../../../utils/utils';
import {
  usePopularTokens,
  useUpdateTokenName,
} from '../../../utils/tokens/names';
import { useSendTransaction } from '../../../utils/notifications';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useAsyncData } from '../../../utils/fetch-loop';

const RowForStepComponents = styled(RowContainer)`
  @media (max-width: 540px) {
    flex-direction: column;
  }
`;

const StyledColorText = styled(ColorText)`
  height: 20rem;
`;

const AddTokens = () => {
  const [searchValue, setSearchValue] = useState('');
  const [redirectToWallet, setRedirectToWallet] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState([]);

  const theme = useTheme();
  const wallet = useWallet();
  let [tokenAccountCost] = useAsyncData(
    wallet.tokenAccountCost,
    wallet.tokenAccountCost,
  );
  let updateTokenName = useUpdateTokenName();
  const [walletAccounts] = useWalletTokenAccounts();

  const [sendTransaction, sending] = useSendTransaction();

  const [publicKeys] = useWalletPublicKeys();
  const sortedPublicKeys = Array.isArray(publicKeys) ? publicKeys : [];
  const popularTokens = usePopularTokens();

  const balanceInfo = useBalanceInfo(wallet.publicKey);
  let { amount, decimals } = balanceInfo || {
    amount: 0,
    decimals: 8,
    mint: null,
    tokenName: 'Loading...',
    tokenSymbol: '--',
  };

  function onSubmit() {
    Promise.all(
      selectedTokens.map((tokenInfo) => sendTransaction(addToken(tokenInfo))),
    ).then(async () => {
      await refreshWalletPublicKeys(wallet);
      await setRedirectToWallet(true);
    });

    return;
  }

  async function addToken({ mintAddress, tokenName, tokenSymbol }) {
    let mint = new PublicKey(mintAddress);
    updateTokenName(mint, tokenName, tokenSymbol);
    const resp = await wallet.createAssociatedTokenAccount(mint);
    return resp[1];
  }

  const cost =
    (+feeFormat.format(tokenAccountCost / LAMPORTS_PER_SOL) || 0.002039) *
    selectedTokens.length;

  const isBalanceLowerCost = amount / Math.pow(10, decimals) < cost;

  return (
    <>
      <Card width={'100rem'} minWidth={'100%'} minHeight="85rem">
        <RowForStepComponents height={'100%'}>
          {' '}
          <RowContainer
            style={{ borderRight: '0.2rem solid #383B45' }}
            height={'96%'}
            direction={'column'}
            justify={'space-evenly'}
          >
            <Row width={'85%'} justify={'flex-start'}>
              <BoldTitle color={'#96999C'} style={{ marginRight: '1rem' }}>
                Step 1:
              </BoldTitle>
              <BoldTitle>Deposit some SOL to activate your wallet.</BoldTitle>
            </Row>
            <Row justify={'end'} width={'85%'}>
              <BoldTitle style={{ width: '25%' }} fontSize={'1.3rem'}>
                Your SOL address
              </BoldTitle>
              <Legend />
            </Row>
            <Row width={'85%'}>
              {' '}
              <TextareaWithCopy
                height={'5rem'}
                value={wallet?.publicKey?.toBase58()}
              />
            </Row>
            <Row width={'85%'}>
              <StyledColorText
                width={'100%'}
                height={'12rem'}
                background={'rgba(242, 154, 54, 0.5)'}
              >
                <img alt={'Attention'} src={Attention} />
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '87%',
                    justifyContent: 'space-around',
                    height: '90%',
                  }}
                >
                  <Title fontSize={'1.2rem'} textAlign={'inherit'}>
                    Transaction in Solana Network usually takes no more than a
                    second, but if you send SOL from an exchange, the withdrawal
                    can be delayed for few minutes.
                  </Title>
                  <Title fontSize={'1.2rem'} textAlign={'inherit'}>
                    Click the “Refresh Balance” button after exchange confirms
                    your withdrawal to update your balance and continue setting
                    up your wallet.
                  </Title>
                </span>
              </StyledColorText>
            </Row>
            <Row width={'85%'} justify={'space-between'}>
              <VioletButton
                style={{ height: '3.5rem' }}
                theme={theme}
                btnWidth={'31%'}
                height={'3.5rem'}
                background={'#651CE4'}
                onClick={() => {
                  refreshWalletPublicKeys(wallet);
                  sortedPublicKeys.map((publicKey) =>
                    refreshAccountInfo(wallet.connection, publicKey, true),
                  );
                }}
              >
                Refresh Balance
              </VioletButton>
              <span style={{ display: 'flex' }}>
                <BoldTitle fontSize={'1.5rem'}>Your Balance:&nbsp;</BoldTitle>
                <BoldTitle
                  fontSize={'1.5rem'}
                  style={{
                    color: isBalanceLowerCost
                      ? theme.customPalette.red.main
                      : theme.customPalette.green.light,
                  }}
                >
                  {formatNumberToUSFormat(
                    stripDigitPlaces(amount / Math.pow(10, decimals), decimals),
                  )}{' '}
                  SOL
                </BoldTitle>
              </span>
            </Row>
          </RowContainer>
          <RowContainer
            justify={'space-evenly'}
            height={'100%'}
            direction={'column'}
          >
            <Row margin={'0'} width={'85%'} justify={'flex-start'}>
              <BoldTitle color={'#96999C'} style={{ marginRight: '1rem' }}>
                Step 2:
              </BoldTitle>
              <BoldTitle>
                Select tokens you want to add to your wallet.
              </BoldTitle>
            </Row>
            <Row width={'85%'}>
              <InputWithSearch
                type={'text'}
                value={searchValue}
                onChange={(e) => {
                  if (
                    !`${e.target.value}`.match(/[a-zA-Z1-9]/) &&
                    e.target.value !== ''
                  ) {
                    return;
                  }

                  setSearchValue(e.target.value);
                }}
                onSearchClick={() => {}}
                placeholder={'Search'}
              />
            </Row>
            <Row width="85%">
              <ListCard>
                {popularTokens
                  .filter(
                    (token) =>
                      !token.deprecated &&
                      (searchValue !== ''
                        ? (
                            token.name ??
                            abbreviateAddress(new PublicKey(token.address))
                          )
                            .toLowerCase()
                            .includes(searchValue.toLowerCase()) ||
                          token.symbol
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())
                        : true),
                  )
                  .map((token) => (
                    <TokenListItem
                      key={token.address}
                      {...token}
                      mintAddress={token.address}
                      existingAccount={(walletAccounts || []).find(
                        (account) =>
                          account.parsed.mint.toBase58() === token.address,
                      )}
                      disabled={sending}
                      selectedTokens={selectedTokens}
                      setSelectedTokens={setSelectedTokens}
                    />
                  ))}
              </ListCard>
            </Row>
            <Row
              margin={'0.8rem 0 0 0'}
              width={'85%'}
              justify={'space-between'}
            >
              <Row>
                <span style={{ display: 'flex' }}>
                  <BoldTitle fontSize={'1.5rem'}>Cost: &nbsp;</BoldTitle>
                  <BoldTitle fontSize={'1.5rem'} color={'#53DF11'}>
                    {stripDigitPlaces(cost, 8)} SOL
                  </BoldTitle>
                </span>
              </Row>
              <VioletButton
                theme={theme}
                style={{ height: '3.5rem' }}
                background={'#651CE4'}
                disabled={isBalanceLowerCost || selectedTokens.length === 0}
                onClick={() => {
                  if (isExtension) {
                    chrome.runtime.sendMessage(
                      { message: 'buttonClicked' },
                      () => {},
                    );
                  }

                  onSubmit();
                }}
              >
                Finish
              </VioletButton>
            </Row>
          </RowContainer>
        </RowForStepComponents>
      </Card>{' '}
      <BottomLink
        needOr={false}
        linkColor={theme.customPalette.green.light}
        toText={'Skip for now'}
        to={'/wallet'}
      />
      {redirectToWallet && <Redirect to="/wallet" />}
    </>
  );
};

export default AddTokens;
