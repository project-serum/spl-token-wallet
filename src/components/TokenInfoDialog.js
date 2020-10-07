import React from 'react';
import { Row, Col, Statistic, Modal } from 'antd';
import { abbreviateAddress } from '../utils/utils';
import TokenIcon from './TokenIcon';
import AddressDisplay from './AddressDisplay';

export default function TokenInfoDialog({
  open,
  onClose,
  publicKey,
  balanceInfo,
}) {
  let { mint, tokenName, tokenSymbol } = balanceInfo;

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
          <AddressDisplay
            title="Deposit Address"
            address={publicKey.toBase58()}
          />
        </Col>
      </Row>
      {mint && (
        <Row style={{ marginTop: 16 }}>
          <Col>
            <AddressDisplay
              title="Token Address"
              address={mint.toBase58()}
              showLink={true}
            />
          </Col>
        </Row>
      )}
    </Modal>
  );
}
