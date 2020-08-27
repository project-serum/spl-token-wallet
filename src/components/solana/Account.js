import {
  CopyOutlined,
  PlusCircleOutlined,
  RedoOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Col, Collapse, Popover, Row, message } from 'antd';
import React, { useCallback, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled from 'styled-components';

import AddToken from './AddTokenModal';
import ModalComponent from './Modal';
import imageMapping from '../../modules/shared/imageMapping';
const { Panel } = Collapse;
const Wrapper = styled.div`
  .ant-avatar {
    color: ${({ theme }) => theme[theme.mode].menu};
  }
  .ant-collapse,
  .ant-collapse-item {
    border: none;
  }
  .ant-collapse {
    border: ${({ theme }) =>
    theme.mode === 'dark' ? 'none' : 'solid 1px rgba(151,151,151,.2)'};
  }
  .ant-collapse-content {
    border-top: ${({ theme }) =>
    theme.mode === 'dark'
      ? '1px dashed rgba(255, 255, 255, 0.2)'
      : '1px dashed rgba(151, 151, 151, 0.2)'};
    background: ${({ theme }) => (theme.mode === 'dark' ? '#33343b' : '#fff')};
    margin: 0 16px;
    color: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.8)'};
  }
  .ant-collapse-header {
    border-radius: 4px !important;
  }
`;
const HeaderWrapper = styled(Row)`
  margin-top: 40px;
  svg {
    cursor: pointer;
  }
`;
const Title = styled(Col)`
  font-size: 30px;
  margin-bottom: 4px;
  color: ${({ theme }) => theme[theme.mode].text};
  font-family: Roboto;
  font-weight: bold;
`;
const CoinName = styled.span`
  font-size: 24px;
  padding: 0 24px 0 12px;
`;
const CollapseWrapper = styled(Collapse)`
  margin-top: 16px;
`;
const ActionRow = styled(Row)`
  .ant-avatar-circle {
    background: transparent;
    :hover {
      color: #fff;
      background: #17181c;
    }
  }
`;
const ArrowWrapper = styled.div`
  width: 40px;
  height: 40px;
  line-height: 40px !important;
  border-radius: 8px;
  background-color: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#7857c6'};
`;
const AirdropButton = styled(Button)`
  color: ${({ theme }) => theme[theme.mode].background}!important;
  width: 184px;
`;
const MinTokenButton = styled(Button)`
  color: #fff;
  width: 184px;
  background: ${({ theme }) => theme[theme.mode].disabled};
  border-color: ${({ theme }) => theme[theme.mode].disabled};
`;
const PanelHeaderCol = styled(Col)`
  color: ${({ theme }) => `rgba(${theme.mode !== 'dark' && '0,0,0, 0.8'})`};
`;
const CopyOutlinedIcon = styled(CopyOutlined)`
  color: ${({ theme }) => theme[theme.mode].text};
  margin-left: 4px;
`;
const TokenId = styled.div`
  color: ${({ theme }) => theme[theme.mode].text};
`;
const Explorer = styled.a`
  color: rgba(
    ${({ theme }) => (theme.mode === 'dark' ? '255,255,255' : '0,0,0')},
    0.6
  );
`;
const RedoOutlinedIcon = styled(RedoOutlined)`
  font-size: 26px;
  margin: 0 28px;
  color: ${({ theme }) => theme[theme.mode].menu};
`;
const Price = styled(Row)`
  color: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(255,255,255,.85)' : '#4a4a4a'};
`;
const Account = (props) => {
  const { handleClickSendButton, isNetwork } = props;
  const [visible, setVisible] = useState(false);
  const [showAddToken, setShowAddToken] = useState(false);
  const handleCancel = useCallback(() => {
    setVisible(false);
    setShowAddToken(false);
  }, []);
  const handleClick = useCallback(() => {
    setVisible(true);
  }, []);
  const showAddTokenModal = useCallback(() => {
    setShowAddToken(true);
  }, []);
  const PanelHeader = ({ tokenId, name, addressId }) => (
    <Row
      align="middle"
      justify="space-between"
      style={{ padding: '0 16px', height: 74 }}
    >
      <PanelHeaderCol
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {tokenId ? (
          <Avatar size={46} style={{ fontSize: 30, background: '#004390', color: '#fff' }}>
            {name.slice(0, 1)}
          </Avatar>
        ) : (
            <img src={imageMapping.logo} width="30" alt="" />
          )}
        <CoinName>{name}</CoinName>
        <div style={{ paddingTop: tokenId ? 18 : 0 }}>
          {addressId}
          <CopyToClipboard
            onCopy={(text, result) => result && message.success('copy success')}
            text={'0xd4e9a6DD7d47Ba556D3bf2615bf72C92955B328E'}
          >
            <CopyOutlinedIcon onClick={(e) => e.stopPropagation()} />
          </CopyToClipboard>
          {tokenId && (
            <TokenId>
              <span style={{ fontWeight: 500 }}>{'Token ID'}</span>
              <span style={{ opacity: 0.6, marginLeft: '1em' }}>{tokenId}</span>
            </TokenId>
          )}
        </div>
      </PanelHeaderCol>
      <Col>
        <Price
          style={{
            fontWeight: 'bold',
            fontFamily: 'Roboto',
            fontStyle: 'italic',
            marginRight: 24,
            alignItems: 'baseline',
          }}
        >
          <Col style={{ fontSize: 44, marginRight: 6 }}>45.62</Col>
          <Col style={{ fontSize: 16 }}>{name}</Col>
        </Price>
      </Col>
    </Row>
  );
  const DownArrow = ({ isActive }) => (
    <ArrowWrapper>
      <DownOutlined rotate={isActive ? -180 : 0} />
    </ArrowWrapper>
  );

  return (
    <Wrapper>
      <ModalComponent visible={visible} onCancel={handleCancel} />
      <AddToken showAddToken={showAddToken} onCancel={handleCancel} />
      <HeaderWrapper justify="space-between">
        <Col>
          <Row align="middle" style={{ marginBottom: 16 }}>
            <Title>Balances</Title>
            {isNetwork && (
              <>
                <Col style={{ margin: '0 20px 0 28px' }}>
                  <AirdropButton type="primary" size="large">
                    Request Airdrop
                  </AirdropButton>
                </Col>
                <Col>
                  <MinTokenButton size="large">Mint test token</MinTokenButton>
                </Col>
              </>
            )}
          </Row>
          Different Assets Under The Same Account Have Different Addresses.
          Please View Your Trade Status on Solana Explorer
        </Col>
        <Col>
          <ActionRow align="middle">
            <Popover
              content="Add Token"
              trigger="hover"
              style={{ fontSize: 12, color: '#fff' }}
            >
              <Avatar
                style={{
                  fontSize: 50,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 12,
                  height: 'auto',
                  width: 'auto',
                }}
                icon={
                  <PlusCircleOutlined
                    onClick={showAddTokenModal}
                    style={{ fontSize: 26 }}
                  />
                }
              />
            </Popover>
            <RedoOutlinedIcon />
          </ActionRow>
        </Col>
      </HeaderWrapper>
      <CollapseWrapper
        defaultActiveKey={['1']}
        expandIconPosition="right"
        expandIcon={DownArrow}
      >
        <Panel
          header={
            <PanelHeader
              addressId="0xd4e9a6DD7d47Ba556D3bf2615bf72C92955B328E"
              name="SOL"
            />
          }
          key="1"
        >
          <Row align="middle" justify="space-between" style={{ height: 60 }}>
            <Col>
              Token Name: <span>SOL</span>
            </Col>
            <Col>
              <Explorer
                style={{
                  textDecoration: 'underline',
                }}
                href="/"
              >
                View on Solana Explorer
              </Explorer>
              <Button
                type="primary"
                ghost
                style={{ margin: '0 16px 0 24px', width: 160 }}
                size="large"
                onClick={handleClick}
              >
                Deposit
              </Button>
              <Button
                type="primary"
                size="large"
                style={{ width: 160 }}
                onClick={handleClickSendButton}
              >
                Send
              </Button>
            </Col>
          </Row>
        </Panel>
      </CollapseWrapper>

      <CollapseWrapper expandIconPosition="right" expandIcon={DownArrow}>
        <Panel
          header={
            <PanelHeader
              tokenId="0xd4e9a6DD7d47Ba556D3bf261"
              name="BTC"
              addressId="0xd4e9a6DD7d47Ba556D3bf2615bf72C92955B328E"
            />
          }
          key="1"
        >
          <Row align="middle" justify="space-between">
            <Col>
              Token Name: <span>BTC</span>
            </Col>
            <Col>
              <a
                style={{
                  textDecoration: 'underline',
                  color: 'rgba(255,255,255, 0.6)',
                }}
                href="/"
              >
                View on Solana Explorer
              </a>
              <Button
                type="primary"
                ghost
                style={{ margin: '0 16px 0 24px', width: 160 }}
                size="large"
                onClick={handleClick}
              >
                Deposit
              </Button>
              <Button
                type="primary"
                size="large"
                style={{ width: 160 }}
                onClick={handleClickSendButton}
              >
                Send
              </Button>
            </Col>
          </Row>
        </Panel>
      </CollapseWrapper>
    </Wrapper>
  );
};
export default React.memo(Account);
