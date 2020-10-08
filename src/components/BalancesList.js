import React, { useState } from 'react';
import {
  PageHeader,
  Button,
  Tooltip,
  List,
  Grid,
  Space,
  Skeleton,
  Typography,
  Switch,
} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  SendOutlined,
  InfoOutlined,
  DeleteOutlined,
  CloseOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import {
  refreshWalletPublicKeys,
  useBalanceInfo,
  useWallet,
  useWalletPublicKeys,
  useWalletTokenAccounts,
} from '../utils/wallet';
import { abbreviateAddress } from '../utils/utils';
import { refreshAccountInfo } from '../utils/connection';
import { Box } from './layout/StyledComponents';
import AddTokenDialog from './AddTokenDialog';
import SendDialog from './SendDialog';
import DepositDialog from './DepositDialog';
import TokenInfoDialog from './TokenInfoDialog';
import CloseTokenAccountDialog from './CloseTokenAccountButton';
import TokenIcon from './TokenIcon';

const { useBreakpoint } = Grid;
const { Text } = Typography;

const balanceFormat = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
  useGrouping: true,
});

export default function BalancesList() {
  const wallet = useWallet();
  const [walletAccounts, loaded] = useWalletTokenAccounts();
  const [publicKeys] = useWalletPublicKeys();
  const [showAddTokenDialog, setShowAddTokenDialog] = useState(false);
  const [hideZeroBalances, setHideZeroBalances] = useState(false);

  const accountKeys = [
    wallet.account.publicKey,
    ...(
      (hideZeroBalances
        ? walletAccounts.filter((account) => account?.parsed?.amount > 0)
        : walletAccounts) || []
    ).map(({ publicKey }) => publicKey),
  ];

  return (
    <Box style={{ padding: 0, flex: 1 }}>
      <PageHeader
        ghost={false}
        title="Balances"
        extra={[
          <Space
            direction="horizontal"
            style={{
              backgroundColor: '#f7f7f7',
              padding: '0px 10px',
              borderRadius: 10,
              height: 32,
            }}
          >
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              checked={hideZeroBalances}
              onChange={setHideZeroBalances}
            />
            <Text>Hide zero balances</Text>
          </Space>,
          <Tooltip title="Add Token">
            <Button
              shape="circle"
              icon={<PlusOutlined />}
              onClick={() => setShowAddTokenDialog(true)}
            />
          </Tooltip>,
          <Tooltip title="Refresh">
            <Button
              shape="circle"
              icon={<ReloadOutlined />}
              onClick={() => {
                refreshWalletPublicKeys(wallet);
                publicKeys.map((publicKey) =>
                  refreshAccountInfo(wallet.connection, publicKey, true),
                );
              }}
            />
          </Tooltip>,
        ]}
      />
      <div style={{ backgroundColor: 'white', padding: '0px 25px' }}>
        <List
          itemLayout="horizontal"
          loading={!loaded}
          dataSource={accountKeys}
          renderItem={(publicKey) => (
            <BalanceListItem key={publicKey.toBase58()} publicKey={publicKey} />
          )}
        />
      </div>
      <AddTokenDialog
        open={showAddTokenDialog}
        onClose={() => setShowAddTokenDialog(false)}
      />
    </Box>
  );
}

function BalanceListItem({ publicKey }) {
  const balanceInfo = useBalanceInfo(publicKey);
  const screens = useBreakpoint();

  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [
    closeTokenAccountDialogOpen,
    setCloseTokenAccountDialogOpen,
  ] = useState(false);

  if (!balanceInfo) {
    return <Skeleton avatar title={false} loading={!balanceInfo} />;
  }

  let { amount, decimals, mint, tokenName, tokenSymbol } = balanceInfo;

  let tokenIcon = <TokenIcon mint={mint} tokenName={tokenName} />;

  return (
    <>
      <List.Item
        actions={[
          <Tooltip
            title={
              !mint
                ? "Can't delete SOL"
                : amount !== 0
                ? "Can't delete tokens with non-zero balances"
                : 'Delete'
            }
          >
            <Button
              disabled={!mint || amount !== 0}
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => setCloseTokenAccountDialogOpen(true)}
            />
          </Tooltip>,
          <Tooltip title="Info">
            <Button
              shape="circle"
              icon={<InfoOutlined />}
              onClick={() => setInfoDialogOpen(true)}
            />
          </Tooltip>,
          <Tooltip title="Receive">
            <Button
              type="primary"
              shape="circle"
              style={{ backgroundColor: '#00D2D3', borderWidth: 0 }}
              icon={<SendOutlined rotate={90} />}
              onClick={() => setDepositDialogOpen(true)}
            />
          </Tooltip>,
          <Tooltip title="Send">
            <Button
              type="primary"
              shape="circle"
              style={{ backgroundColor: '#54A0FF', borderWidth: 0 }}
              icon={<SendOutlined rotate={-90} />}
              onClick={() => setSendDialogOpen(true)}
            />
          </Tooltip>,
        ]}
      >
        <List.Item.Meta
          avatar={tokenIcon}
          title={`${tokenName ?? abbreviateAddress(mint)} ${
            tokenSymbol ? ` (${tokenSymbol})` : ''
          }`}
          description={
            screens['lg'] ? publicKey?.toBase58() : abbreviateAddress(publicKey)
          }
        />
        <div
          style={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'flex-end',
            fontSize: 18,
          }}
        >
          {balanceFormat.format(amount / Math.pow(10, decimals))}
        </div>
      </List.Item>
      <SendDialog
        open={sendDialogOpen}
        onClose={() => setSendDialogOpen(false)}
        balanceInfo={balanceInfo}
        publicKey={publicKey}
      />
      <DepositDialog
        open={depositDialogOpen}
        onClose={() => setDepositDialogOpen(false)}
        balanceInfo={balanceInfo}
        publicKey={publicKey}
      />
      <CloseTokenAccountDialog
        open={closeTokenAccountDialogOpen}
        onClose={() => setCloseTokenAccountDialogOpen(false)}
        balanceInfo={balanceInfo}
        publicKey={publicKey}
      />
      <TokenInfoDialog
        open={infoDialogOpen}
        onClose={() => setInfoDialogOpen(false)}
        balanceInfo={balanceInfo}
        publicKey={publicKey}
      />
    </>
  );
}
