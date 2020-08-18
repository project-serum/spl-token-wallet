import React, { useState, useCallback } from 'react'
import { Row, Col, message, Button, Modal } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import CopyToClipboard from 'react-copy-to-clipboard'

const CardWrapper = styled(Row)`
  border-radius: 4px;
  background-color: #34363f;
  padding: 20px;
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
  .ant-btn-primary {
    background: #00c853;
  }
  .ant-btn-primary[disabled] {
    background: rgba(255, 255, 255, 0.1);
  }
`
const Btn = styled(Button)`
  width: 122px;
  height: 39px;
  font-size: 18px;
`

const Card = (props) => {
  const { name, addressId, logo } = props
  const [isAdded, setIsAdded] = useState(false)
  const [visible, setVisible] = useState(false)
  const handleOk = useCallback(() => {
    setVisible(false)
  }, [])
  const toggleModal = useCallback(() => {
    setVisible(!visible)
  }, [visible])
  const handleAdd = useCallback(() => {
    message.success(
      'Success! Please wait up to 30 seconds for the SOL tokens to appear in your wallet'
    )
    setIsAdded(true)
  }, [])
  return (
    <CardWrapper justify='space-between' align='middle'>
      <Modal
        visible={visible}
        footer={null}
        onCancel={toggleModal}
      >
        <p style={{ padding: '20px 0 46px' }}>You already have an Serum (SRM) deposit address. Are you sure you want to create one more? </p>
        <Row justify='center'>
          <Button size='large' ghost style={{ width: 200, marginRight: 24 }} onClick={toggleModal}>Cancel</Button>
          <Button size='large' type='primary' style={{ width: 200 }} onClick={handleOk}>Confirm</Button>
        </Row>
      </Modal>
      <Col style={{ fontSize: 24 }}>
        <img src={logo} width='30' style={{ marginRight: 16 }} alt='' />
        {name}
        <div style={{ fontSize: 12, marginTop: 12 }}>
          {addressId}
          <CopyToClipboard
            onCopy={(text, result) => result && message.success('copy success')}
            text={addressId}
          >
            <CopyOutlined
              onClick={e => e.stopPropagation()}
              style={{ color: '#fff', marginLeft: '4px' }}
            />
          </CopyToClipboard>
          {isAdded && (
            <div style={{ color: '#fff', marginTop: 16 }}>
              {
                'If you want to create another deposit address under this account, '
              }
              <span
                style={{
                  cursor: 'pointer',
                  color: '#ff6971',
                  textDecoration: 'underline'
                }}
                onClick={toggleModal}
              >
                click here.
              </span>
            </div>
          )}
        </div>
      </Col>
      <Col>
        <Btn disabled={isAdded} onClick={handleAdd} type='primary'>
          Add
        </Btn>
      </Col>
    </CardWrapper>
  )
}
export default Card
