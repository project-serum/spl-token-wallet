import { Button, Form, Input, Modal, Radio } from 'antd'
import React, { useCallback, useState } from 'react'
import imageMapping from '../../modules/shared/imageMapping'
import styled from 'styled-components'
import Card from './AddTokenCard'
const Wrapper = styled.div`
  input:-webkit-autofill,.ant-form-item-has-error .ant-input-affix-wrapper input:focus {
    -webkit-text-fill-color: #fff;
    box-shadow: 0 0 0px 1000px #2b2c34 inset !important;
  }
`
const Btn = styled(Button)`
  height: 52px;
  width: 200px;
  font-size: 18px;
`
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
}
const ModalComponent = (props) => {
  const { showAddToken, onCancel } = props
  const [tabKey, setTabKey] = useState('popularTokens')
  const handleModeChange = useCallback(e => {
    const key = e.target.value
    setTabKey(key)
  }, [])
  const onFinish = useCallback((values: object) => {
    console.log('Success:', values)
  }, [])

  const onFinishFailed = useCallback((errorInfo: object) => {
    console.log('Failed:', errorInfo)
  }, [])
  return (
    <Modal
      visible={showAddToken}
      title='Add Token'
      onCancel={onCancel}
      footer={null}
      width={818}
    >
      <div>Add a token to your wallet. This will cost 0.001726 Solana.</div>
      <Radio.Group
        onChange={handleModeChange}
        value={tabKey}
        buttonStyle='solid'
        style={{ margin: '24px 0' }}
        size='large'
      >
        <Radio.Button
          value='popularTokens'
          style={{ width: 160, textAlign: 'center' }}
        >
          Popular Tokens
        </Radio.Button>
        <Radio.Button
          value='manualInput'
          style={{ width: 160, textAlign: 'center' }}
        >
          Manual Input
        </Radio.Button>
      </Radio.Group>
      {tabKey === 'popularTokens' ? (
        <>
          <Card
            name='Serum(SRM)'
            addressId='0xd4e9a6DD7d47Ba556D3bf2615bf72C92955B328E'
            logo={imageMapping.logo}
          />
          <Card
            name='MegaSerum(MSRM)'
            addressId='0xd4e9a6DD7d47Ba556D3bf2615bf72C92955B328F'
            logo={imageMapping.MegaLogo}
          />
          <Button
            type='primary'
            ghost
            style={{ width: 200, height: 52, marginTop: 30, fontSize: 18 }}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </>
      ) : (
          <Wrapper>
            <Form
              {...layout}
              name='basic'
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label='Token Mint Address'
                name='mintAddress'
                rules={[
                  {
                    required: true,
                    message: 'Please input your Token Mint Address!'
                  }
                ]}
              >
                <Input size='large' />
              </Form.Item>
              <Form.Item
                label='Token Name'
                name='tokenName'
                rules={[
                  { required: true, message: 'Please input your Token Name!' }
                ]}
              >
                <Input size='large' />
              </Form.Item>
              <Form.Item
                label='Token Symbol'
                name='tokenSymbol'
                rules={[
                  { required: true, message: 'Please input your Token Symbol!' }
                ]}
              >
                <Input size='large' />
              </Form.Item>
              <Form.Item style={{ marginTop: 39 }}>
                <Btn
                  type='primary'
                  ghost
                  style={{ marginRight: 20 }}
                  onClick={onCancel}
                >
                  Cancel
              </Btn>
                <Btn
                  type='primary'
                  htmlType='submit'
                  style={{ background: '#00c853', borderColor: '#00c853' }}
                >
                  Add
              </Btn>
              </Form.Item>
            </Form>
          </Wrapper>
        )}
    </Modal>
  )
}
export default React.memo(ModalComponent)
