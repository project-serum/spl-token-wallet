import React, { useState } from 'react';
import {
  PageHeader,
  Button,
  Tooltip,
  List,
  Row,
  Col,
  Statistic,
  Grid,
  Modal,
  Skeleton,
  Avatar,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  SendOutlined,
  InfoOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  refreshWalletPublicKeys,
  useBalanceInfo,
  useWallet,
  useWalletPublicKeys,
} from '../utils/wallet';
import { abbreviateAddress } from '../utils/utils';
import { refreshAccountInfo } from '../utils/connection';
import { Box } from './layout/StyledComponents';
import AddTokenDialog from './AddTokenDialog';
import SendDialog from './SendDialog';
import DepositDialog from './DepositDialog';
import CloseTokenAccountDialog from './CloseTokenAccountButton';

const { useBreakpoint } = Grid;
const { Paragraph } = Typography;

const balanceFormat = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
  useGrouping: true,
});

export default function BalancesList() {
  const wallet = useWallet();
  const [publicKeys, loaded] = useWalletPublicKeys();
  const [showAddTokenDialog, setShowAddTokenDialog] = useState(false);

  return (
    <Box style={{ padding: 0, flex: 1 }}>
      <PageHeader
        ghost={false}
        title="Balances"
        extra={[
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
          dataSource={publicKeys}
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

  const info = () => {
    Modal.info({
      title: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={`/icons/${tokenSymbol?.toLowerCase()}.png`}
            style={{ marginRight: 16 }}
          />
          <span class="ant-modal-confirm-title">{`${
            tokenName ?? abbreviateAddress(mint)
          } ${tokenSymbol ? ` (${tokenSymbol})` : ''}`}</span>
        </div>
      ),
      icon: null,
      content: (
        <>
          <Row style={{ marginTop: 16 }}>
            <Col span={12}>
              <Statistic
                title="Token Name"
                value={tokenName ?? 'Unknown'}
                valueStyle={{ fontSize: 18 }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Token Symbol"
                value={tokenSymbol ?? 'Unknown'}
                valueStyle={{ fontSize: 18 }}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: 16 }}>
            <Col>
              <div class="ant-statistic">
                <div class="ant-statistic-title">Deposit Address</div>
                <div class="ant-statistic-content">
                  <Paragraph style={{ fontSize: 18, marginBottom: 0 }} copyable>
                    {publicKey.toBase58()}
                  </Paragraph>
                </div>
              </div>
            </Col>
          </Row>
          {mint && (
            <Row style={{ marginTop: 16 }}>
              <Col>
                <div class="ant-statistic">
                  <div class="ant-statistic-title">Token Address</div>
                  <div class="ant-statistic-content">
                    <Paragraph
                      style={{ fontSize: 18, marginBottom: 0 }}
                      copyable
                    >
                      {mint.toBase58()}
                    </Paragraph>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </>
      ),
      width: 700,
    });
  };

  return (
    <>
      <List.Item
        actions={[
          <Tooltip title="Delete">
            <Button
              disabled={!mint || amount !== 0}
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => setCloseTokenAccountDialogOpen(true)}
            />
          </Tooltip>,
          <Tooltip title="Info">
            <Button shape="circle" icon={<InfoOutlined />} onClick={info} />
          </Tooltip>,
          <Tooltip title="Send">
            <Button
              type="primary"
              shape="circle"
              style={{ backgroundColor: '#00D2D3', borderWidth: 0 }}
              icon={<SendOutlined rotate={-90} />}
              onClick={() => setSendDialogOpen(true)}
            />
          </Tooltip>,
          <Tooltip title="Receive">
            <Button
              type="primary"
              shape="circle"
              style={{ backgroundColor: '#54A0FF', borderWidth: 0 }}
              icon={<SendOutlined rotate={90} />}
              onClick={() => setDepositDialogOpen(true)}
            />
          </Tooltip>,
        ]}
      >
        <List.Item.Meta
          avatar={<Avatar src={`/icons/${tokenSymbol?.toLowerCase()}.png`} />}
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
    </>
  );
}
