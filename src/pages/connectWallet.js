import {
  LoadingOutlined,
  BlockOutlined,
  BuildOutlined,
  GlobalOutlined,
  HeatMapOutlined,
  DownOutlined
} from '@ant-design/icons'
import { Button, Checkbox, Radio, Col, Row, message, Select } from 'antd';
import React, { useCallback, useState } from 'react';
import AccountCard from '../components/connectWallet/AccountCard';
import imageMapping from '../modules/shared/imageMapping';
import styled from 'styled-components';
const Wrapper = styled(Col)`
  position: relative;
  top: -12px;
  padding: 36px 66px;
  height: 642px;
  border-radius: 20px;
  background-color: #2b2c34;
  width: 50%;
  .ant-checkbox-inner {
    border-color: #787a84;
  }
  .ant-checkbox-group {
    border-radius: 4px;
  }
  .ant-radio-wrapper {
    background-color: #34363f;
    border-bottom: dashed 1px rgba(255, 255, 255, 0.2);
    padding: 0 23px;
    margin-right: 0;
    width: 100%;
    &:last-child {
      border-bottom: none;
    }
  }
  .ant-radio-inner {
    border-color: #787a84;
  }
  .ant-select-selector {
    padding-left: 0 !important;
  }
  .ant-select-item-option {
    background-color: transparent;
  }
  .ant-select-arrow {
    top: 30%;
    .anticon-down {
      padding-top: 5px;
      margin-right: 0;
    }
  }
`;
const Title = styled.div`
  font-size: 24px;
  color: #fff;
  text-align: center;
`;
const Description = styled.div`
  padding: 16px 0 24px;
  text-align: center;
  font-size: 20px;
`;
const Btn = styled(Button)`
  font-size: 18px;
  height: 52px;
  width: 200px;
  margin-right: 24px;
  &:last-child {
    margin-right: 0;
  }
`;
const Step = styled.span`
  font-size: 24px;
  color: #fff;
  position: absolute;
  right: 30px;
  top: -80px;
`;
const SelectOption = styled(Option)`
  height: 58px;
  line-height: 58px;
`
const ArrowWrapper = styled.div`
  width: 24px;
  height: 24px;
  line-height: 24px !important;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);
`;
const ButtonWrapper = styled(Row)`
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  width: fit-content;
`
const ConnectWallet = () => {
  const plainOptions = [
    {
      label: (
        <AccountCard
          userName="Account1"
          id="0xd4e9a6DD7d47Ba556D3bf2615bf72C92955B328E"
        />
      ),
      value: 'Account1',
    },
    {
      label: (
        <AccountCard
          userName="Account2"
          id="0xd4e9a6DD7d47Ba556D3bf2615bf72C92955B328E"
        />
      ),
      value: 'Account2',
    },
    {
      label: (
        <AccountCard
          userName="Account3"
          id="0xd4e9a6DD7d47Ba556D3bf2615bf72C92955B328E"
        />
      ),
      value: 'Account3',
    },
  ];
  const [current, setCurrent] = useState(1);
  const [permittCheck, setPermittCheck] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [status, setStatus] = useState('');
  const onChange = useCallback(
    (e) => {
      setSelectedAccount(e.target.value);
    },
    [],
  );
  const handleNext = useCallback(() => {
    if (selectedAccount.length > 0) {
      setCurrent(2);
    } else {
      message.warn('please select an account');
    }
  }, [selectedAccount.length]);
  const handlePermitted = useCallback((e) => {
    setPermittCheck(e.target.checked);
  }, []);
  const handleConnect = useCallback(() => {
    if (permittCheck) {
      setStatus('loading');
      setTimeout(() => {
        setStatus('success');
      }, 1500);
    } else {
      message.warn('please premitted');
    }
  }, [permittCheck]);
  const DownArrow = () => (
    <ArrowWrapper>
      <DownOutlined rotate={0} style={{ color: '#fff' }} />
    </ArrowWrapper>
  );
  return (
    <Row
      style={{ padding: '0 78px 78px', position: 'relative', height: 642 }}
      align="middle"
    >
      {!status && <Step>{current} / 2</Step>}
      <Col flex={1} style={{ textAlign: 'center', fontSize: 40, fontWeight: 500, color: '#fff' }}>
        <img src={imageMapping.logo} alt="" style={{ marginRight: 12, width: 54 }} />
        SERUM
        <div>
          <a href="http://www.serum.com" style={{ fontSize: 20, marginTop: 24, color: '#9b9b9b' }}>http://www.serum.com</a>
        </div>
      </Col>
      {status ? (
        <Wrapper
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          {status === 'loading' ? (
            <LoadingOutlined
              style={{ width: 221, height: 215, fontSize: 32 }}
            />
          ) : (
              <img src={imageMapping.success} alt='' />
            )}

          <div style={{ fontSize: 24, textAlign: 'center', marginTop: 36 }}>
            {status === 'loading' ? 'Loading Acdount' : 'Connected for Success'}
          </div>
        </Wrapper>
      ) : (
          <>
            {current === 1 ? (
              <Wrapper>
                <Title>Connect With Solana SPL</Title>
                <Description>Select account(s)</Description>
                <Row
                  style={{ padding: '0 23px 8px 0', width: '100%' }}
                  justify="space-between"
                >
                  <Select
                    defaultValue='Main Beta'
                    dropdownStyle={{ boxShadow: 'none', border: '1px solid #98a1af', background: '#34363e', padding: '20px 0' }}
                    bordered={false}
                    style={{ width: '196px', color: '#fff' }}
                    suffixIcon={DownArrow}
                  >
                    <SelectOption style={{ marginBottom: 22 }} value='Main Beta'>
                      <BlockOutlined
                        style={{
                          fontSize: 18,
                          marginRight: 20,
                          verticalAlign: 'middle'
                        }}
                      />
                Main Beta
              </SelectOption>
                    <SelectOption style={{ marginBottom: 22 }} value='DEVNET'>
                      <HeatMapOutlined
                        style={{
                          fontSize: 18,
                          marginRight: 20,
                          verticalAlign: 'middle'
                        }}
                      />
                DEVNET
              </SelectOption>
                    <SelectOption style={{ marginBottom: 22 }} value='TESTNET'>
                      <BuildOutlined
                        style={{
                          fontSize: 18,
                          marginRight: 20,
                          verticalAlign: 'middle'
                        }}
                      />
                TESTNET
              </SelectOption>
                    <SelectOption value='NETWORK'>
                      <GlobalOutlined
                        style={{
                          fontSize: 18,
                          marginRight: 20,
                          verticalAlign: 'middle'
                        }}
                      />
                NETWORK
              </SelectOption>
                  </Select>
                  <Button type="text" style={{ color: '#2a87f6' }}>
                    New Account
                </Button>
                </Row>
                <Radio.Group
                  options={plainOptions}
                  value={selectedAccount}
                  onChange={onChange}
                />
                <div style={{ textAlign: 'center', margin: '8px 0 30px' }}>
                  Only connect with sites you trust.{' '}
                  <Button
                    type="link"
                    style={{ color: '#2a87f6', paddingLeft: 0 }}
                  >
                    Learn more
                </Button>
                </div>
                <ButtonWrapper justify="center">
                  <Btn type="primary" ghost>
                    Cancel
                </Btn>
                  <Btn type="primary" onClick={handleNext}>
                    Next
                </Btn>
                </ButtonWrapper>
              </Wrapper>
            ) : (
                <Wrapper style={{ textAlign: 'center' }}>
                  <Title>
                    {`Connect to ${selectedAccount}`}
                    <div>{'(…jdfhakdhjf45)'}</div>
                  </Title>
                  <Description style={{ marginBottom: 84 }}>
                    Allow this site to:
              </Description>
                  <Checkbox onChange={handlePermitted}>
                    View the addresses of your permitted accounts (required)
              </Checkbox>
                  <div style={{ margin: '189px 0 30px' }}>
                    Only connect with sites you trust. Learn more
              </div>
                  <ButtonWrapper justify="center" style={{ width: '100%' }}>
                    <Btn type="primary" ghost>
                      Cancel
                </Btn>
                    <Btn type="primary" onClick={handleConnect}>
                      Connect
                    </Btn>
                  </ButtonWrapper>
                </Wrapper>
              )}
          </>
        )}
    </Row>
  );
};
export default ConnectWallet;
