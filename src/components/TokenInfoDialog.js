import React from 'react';
import { Typography, Button, Row, Col, Statistic, Modal } from 'antd';
import { useSolanaExplorerUrlSuffix } from '../utils/connection';
import { abbreviateAddress } from '../utils/utils';
import TokenIcon from './TokenIcon';

const { Paragraph } = Typography;

export default function TokenInfoDialog({
  open,
  onClose,
  publicKey,
  balanceInfo,
}) {
  let { mint, tokenName, tokenSymbol } = balanceInfo;
  const urlSuffix = useSolanaExplorerUrlSuffix();

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TokenIcon mint={mint} tokenName={tokenName} />
          <span style={{ marginLeft: 16 }}>
            {tokenName ?? abbreviateAddress(mint)}{' '}
            {tokenSymbol ? `(${tokenSymbol})` : null}
          </span>
        </div>
      }
      visible={open}
      onCancel={onClose}
      footer={null}
      width={650}
    >
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
                <Paragraph style={{ fontSize: 18, marginBottom: 0 }} copyable>
                  {mint.toBase58()}
                </Paragraph>
              </div>
            </div>
            <Button
              type="link"
              component="a"
              href={
                `https://explorer.solana.com/account/${publicKey.toBase58()}` +
                urlSuffix
              }
              target="_blank"
              rel="noopener"
            >
              View on Solana Explorer
            </Button>
          </Col>
        </Row>
      )}
    </Modal>
  );
}
