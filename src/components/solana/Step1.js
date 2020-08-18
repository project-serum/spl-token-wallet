import { CheckCircleOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Input, Modal, Row } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';

const CulcWrapper = styled.div`
  background: #34363f;
  border-radius: 4px;
  padding: 26px 285px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
  input {
    text-align: right;
  }
`;
const Max = styled.div`
  width: 80px;
  height: 44px;
  line-height: 28px;
  text-align: center;
  border-radius: 8px;
  background-color: rgba(74, 144, 226, 0.7);
  padding: 8px 16px;
  font-size: 20px;
  transform: scale(0.5);
  display: inline-block;
  vertical-align: middle;
`;
const AddressBook = styled.span`
  color: #06e6ff;
  margin-left: 12px;
`;
const Step1 = (props) => {
  const ref = useRef(null);
  const [address, setAddress] = useState('');
  const [visible, setVisible] = useState(false);
  const [isRight, setIsRight] = useState(false);
  const toggleModal = useCallback(() => {
    setVisible(!visible);
  }, [visible]);
  const addBook = useCallback(() => {
    setAddress(ref.current.state.value);
    setVisible(false);
  }, []);
  const handleInput = useCallback((e) => {
    setIsRight(e.target.value);
  }, []);
  return (
    <>
      <Modal
        title="Add to address book"
        visible={visible}
        footer={null}
        onCancel={toggleModal}
      >
        <p style={{ color: '#98a1af' }}>Enter an alias</p>
        <Input size="large" type="text" ref={ref} spellCheck={false} />
        <Row justify="space-around" style={{ marginTop: 34 }}>
          <Col>
            <Button
              type="primary"
              ghost
              size="large"
              style={{ width: 200 }}
              onClick={toggleModal}
            >
              Cancel
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              style={{ width: 200 }}
              onClick={addBook}
            >
              Save
            </Button>
          </Col>
        </Row>
      </Modal>
      <Input
        size="large"
        type="text"
        autoFocus
        allowClear
        spellCheck={false}
        onChange={handleInput}
        placeholder="Input address"
        prefix={
          <>
            <Avatar
              size={24}
              style={{
                color: '#fff',
                backgroundColor: '#ea973d',
                margin: '0 8px 0 4px',
              }}
            >
              B
            </Avatar>
            {'BTC'}
            <AddressBook>{address}</AddressBook>
          </>
        }
        suffix={
          isRight && (
            <CheckCircleOutlined
              style={{
                backgroundColor: '#7ed321',
                borderRadius: '50%',
                position: 'relative',
                left: -40,
              }}
            />
          )
        }
      />
      <CulcWrapper>
        <div style={{ width: 516, textAlign: 'left' }}>
          Amount<Max>Max</Max>Balance: 11.101 BTC
        </div>
        <Input
          size="large"
          type="text"
          defaultValue={'8.78'}
          allowClear
          spellCheck={false}
          style={{ width: 516, textAlign: 'right', marginTop: 16 }}
          prefix={
            <>
              <Avatar
                size={24}
                style={{
                  color: '#fff',
                  backgroundColor: '#ea973d',
                  margin: '0 8px 0 4px',
                }}
              >
                B
              </Avatar>
              {'BTC'}
            </>
          }
        />
      </CulcWrapper>
    </>
  );
};
export default React.memo(Step1);
