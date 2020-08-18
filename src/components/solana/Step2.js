import { Avatar, Col, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';
const Wrapper = styled.div`
  border-radius: 4px;
  background-color: #34363f;
`;
const Amount = styled.span`
  font-size: 44px;
  line-height: initial;
`;
const RowWrapper = styled(Row)`
  height: 98px;
  align-items:center;
  margin: 0 20px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
  // font-style: italic;
  &:last-child {
    border-bottom: none;
  }
`;
const Step2 = () => {
  return (
    <Wrapper>
      <RowWrapper align="middle" justify="space-between">
        <Col>
          <Avatar
            size={48}
            style={{ background: '#d89516', fontSize: 30, marginRight: 12 }}
          >
            B
          </Avatar>
          <span
            style={{ fontSize: 24, verticalAlign: 'middle', color: '#fff' }}
          >
            BTC
          </span>
        </Col>
        <Col style={{ marginRight: 65, textAlign: 'right' }}>
          <div style={{ color: '#fff', fontStyle: 'italic', fontWeight: 900, fontFamily: 'Roboto' }}>
            <Amount>45.62</Amount>BTC
          </div>
        </Col>
      </RowWrapper>
      <RowWrapper align="middle" justify="space-between">
        <Col>
          <span
            style={{
              fontSize: 16,
              verticalAlign: 'middle',
              marginLeft: 60,
              color: '#fff',
              fontStyle: 'italic',
              fontWeight: 900, fontFamily: 'Roboto'
            }}
          >
            GAS FEE
          </span>
        </Col>
        <Col style={{ marginRight: 65, textAlign: 'right', fontStyle: 'italic' }}>
          <div style={{ color: '#fff', fontWeight: 900, fontFamily: 'Roboto' }}>
            <Amount>0.01</Amount>SOL
          </div>
          <div>
            <span>0.10</span> USD
          </div>
        </Col>
      </RowWrapper>
      <RowWrapper align="middle" justify="space-between">
        <Col>
          <span
            style={{
              fontSize: 20,
              verticalAlign: 'middle',
              marginLeft: 60,
              color: '#fff',
              fontStyle: 'italic',
              fontWeight: 900, fontFamily: 'Roboto'
            }}
          >
            TOTAL
          </span>
        </Col>
        <Col style={{ marginRight: 65, textAlign: 'right' }}>
          <div>Amount + GAS FEE</div>
          <div style={{ color: '#fff', fontStyle: 'italic', fontWeight: 900, fontFamily: 'Roboto' }}>
            <Amount>45.62</Amount>
            {' BTC '}
            <Amount>{'+ '}0.01</Amount>SOL
          </div>
        </Col>
      </RowWrapper>
    </Wrapper >
  );
};
export default React.memo(Step2);
