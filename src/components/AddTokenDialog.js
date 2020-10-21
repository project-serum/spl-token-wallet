import React, { useEffect, useState } from 'react';
import { Modal, Button, Tabs, Input, Space, List } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import {
  refreshWalletPublicKeys,
  useWallet,
  useWalletTokenAccounts,
} from '../utils/wallet';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { TOKENS, useUpdateTokenName } from '../utils/tokens/names';
import { useAsyncData } from '../utils/fetch-loop';
import { useSendTransaction } from '../utils/notifications';

import { abbreviateAddress } from '../utils/utils';
import {
  useConnectionConfig,
  useSolanaExplorerUrlSuffix,
} from '../utils/connection';
import { showSwapAddress } from '../utils/config';
import { swapApiRequest } from '../utils/swap/api';
import { Text } from './layout/StyledComponents';
import TokenIcon from './TokenIcon';
import AddressDisplay from './AddressDisplay';
import LoadingIndicator from './LoadingIndicator';

const { TabPane } = Tabs;

const feeFormat = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 6,
  maximumFractionDigits: 6,
});

export default function AddTokenDialog({ open, onClose }) {
  let wallet = useWallet();
  let [tokenAccountCost] = useAsyncData(
    wallet.tokenAccountCost,
    wallet.tokenAccountCost,
  );
  let updateTokenName = useUpdateTokenName();
  const [sendTransaction, sending] = useSendTransaction();
  const { endpoint } = useConnectionConfig();
  const popularTokens = TOKENS[endpoint];
  const [walletAccounts] = useWalletTokenAccounts();

  const [tab, setTab] = useState(!!popularTokens ? 'popular' : 'manual');
  const [mintAddress, setMintAddress] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [erc20Address, setErc20Address] = useState('');

  useEffect(() => {
    if (!popularTokens) {
      setTab('manual');
    }
  }, [popularTokens]);

  function onSubmit(params) {
    if (tab === 'manual') {
      params = { mintAddress, tokenName, tokenSymbol };
    } else if (tab === 'erc20') {
      params = { erc20Address };
    }
    sendTransaction(addToken(params), {
      onSuccess: () => {
        refreshWalletPublicKeys(wallet);
        onClose();
      },
    });
  }

  async function addToken({
    mintAddress,
    tokenName,
    tokenSymbol,
    erc20Address,
  }) {
    if (erc20Address) {
      let tokenInfo = await swapApiRequest('POST', `coins/eth/${erc20Address}`);
      mintAddress = tokenInfo.splMint;
      tokenName = tokenInfo.name;
      tokenSymbol = tokenInfo.ticker;
      if (tokenInfo.blockchain !== 'sol') {
        tokenName = 'Wrapped ' + tokenName;
      }
    }

    let mint = new PublicKey(mintAddress);
    updateTokenName(mint, tokenName, tokenSymbol);
    return await wallet.createTokenAccount(mint);
  }

  let valid = true;
  if (tab === 'erc20') {
    valid = erc20Address.length === 42 && erc20Address.startsWith('0x');
  }

  let nonDeprecatedPopularTokens = popularTokens.filter(
    (token) => !token.deprecated,
  );

  return (
    <Modal
      title="Add Token"
      visible={open}
      onCancel={onClose}
      footer={null}
      width={650}
    >
      <Space direction="vertical" style={{ display: 'flex' }}>
        {tokenAccountCost ? (
          <Text>
            Add a token to your wallet. This will cost{' '}
            {feeFormat.format(tokenAccountCost / LAMPORTS_PER_SOL)} SOL.
          </Text>
        ) : (
          <LoadingIndicator />
        )}
        <Tabs activeKey={tab} onChange={setTab} centered>
          {!!nonDeprecatedPopularTokens && (
            <TabPane tab="Popular Tokens" key="popular">
              <List
                itemLayout="horizontal"
                dataSource={nonDeprecatedPopularTokens}
                renderItem={(token) => (
                  <TokenListItem
                    key={token.mintAddress}
                    {...token}
                    existingAccount={(walletAccounts || []).find(
                      (account) =>
                        account.parsed.mint.toBase58() === token.mintAddress,
                    )}
                    onSubmit={onSubmit}
                    disalbed={sending}
                  />
                )}
              />
            </TabPane>
          )}
          {showSwapAddress && (
            <TabPane tab="ERC20 Token" key="erc20">
              <Input
                placeholder="ERC20 Contract Address"
                value={erc20Address}
                onChange={(e) => setErc20Address(e.target.value.trim())}
                autoFocus
                disabled={sending}
              />
              {erc20Address && valid ? (
                <Button
                  type="link"
                  component="a"
                  href={`https://etherscan.io/token/${erc20Address}`}
                  target="_blank"
                  rel="noopener"
                >
                  View on Etherscan
                </Button>
              ) : null}
            </TabPane>
          )}
          <TabPane tab="Manual Input" key="manual">
            <Space direction="vertical" style={{ display: 'flex' }}>
              <Input
                placeholder="Token Mint Address"
                value={mintAddress}
                onChange={(e) => setMintAddress(e.target.value)}
                autoFocus
                disabled={sending}
              />
              <Input
                placeholder="Token Name"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                disabled={sending}
              />
              <Input
                placeholder="Token Symbol"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
                disabled={sending}
              />
            </Space>
          </TabPane>
        </Tabs>
        <Space
          style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}
        >
          <Button onClick={onClose}>Cancel</Button>
          {tab !== 'popular' && (
            <Button
              type="primary"
              disabled={sending || !valid}
              onClick={() => onSubmit({ tokenName, tokenSymbol, mintAddress })}
            >
              Send
            </Button>
          )}
        </Space>
      </Space>
    </Modal>
  );
}

function TokenListItem({
  tokenName,
  icon,
  tokenSymbol,
  mintAddress,
  onSubmit,
  disabled,
  existingAccount,
}) {
  const [open, setOpen] = useState(false);
  const urlSuffix = useSolanaExplorerUrlSuffix();
  const alreadyExists = !!existingAccount;

  return (
    <List.Item
      actions={[
        <Button
          type="primary"
          disabled={disabled || alreadyExists}
          style={{ width: 75 }}
          onClick={() => onSubmit({ tokenName, tokenSymbol, mintAddress })}
        >
          {alreadyExists ? 'Added' : 'Add'}
        </Button>,
      ]}
      style={{ alignItems: 'flex-start' }}
    >
      <List.Item.Meta
        avatar={<TokenIcon url={icon} tokenName={tokenName} />}
        title={
          <Button
            type="text"
            component="a"
            href={
              `https://explorer.solana.com/account/${mintAddress}` + urlSuffix
            }
            target="_blank"
            rel="noopener"
          >
            {tokenName ?? abbreviateAddress(mintAddress)}
            {tokenSymbol ? ` (${tokenSymbol})` : null}
          </Button>
        }
        description={
          open && <AddressDisplay title="Mint Address" address={mintAddress} />
        }
      />
      <Button
        type="text"
        icon={open ? <UpOutlined /> : <DownOutlined />}
        onClick={() => setOpen((open) => !open)}
      />
    </List.Item>
  );
}
