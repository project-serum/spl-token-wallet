import React from 'react';
import { Row, Col } from 'antd';
import BalancesList from '../components/BalancesList';
import { useIsProdNetwork } from '../utils/connection';
import DebugButtons from '../components/DebugButtons';

export default function WalletPage() {
  const isProdNetwork = useIsProdNetwork();
  return (
    <>
      <Row justify="center">
        <Col style={{ width: 1000 }}>
          <BalancesList />
        </Col>
      </Row>
      {isProdNetwork ? null : (
        <Row justify="center">
          <Col>
            <DebugButtons />
          </Col>
        </Row>
      )}
    </>
  );
}
