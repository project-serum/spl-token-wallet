import { Button, Form, Input } from 'antd'
import { withRouter } from "react-router-dom";

import React, { useCallback } from 'react'
import styled from 'styled-components'
const Wrapper = styled.div`
  height: 100%;
  padding: 48px;
  background: #2b2c33;
  input:-webkit-autofill,.ant-form-item-has-error .ant-input-affix-wrapper input:focus {
    -webkit-text-fill-color: #fff;
    box-shadow: 0 0 0px 1000px #2b2c33 inset !important;
  }
`
const Title = styled.h1`
  font-size: 30px;
`
const SeedWords = styled.div`
  padding: 24px 40px;
  border-radius: 10px;
  border: solid 1px #74daf6;
  background-color: #2b2c34;
  line-height: 1.64;
  color: #ffffff;
  font-size: 22px;
  margin: 8px 0 24px;
`
const Btn = styled(Button)`
  height: 52px;
  width: 240px;
  font-size: 18px;
`
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
}
const Restore = (props) => {
  const onFinish = useCallback((values: object) => {
    console.log('Success:', values)
  }, [])

  const onFinishFailed = useCallback((errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }, [])
  return (
    <Wrapper>
      <Title>Restore Existing Wallet</Title>
      <div style={{ margin: '16px 0 24px' }}>
        Restore your wallet using your twelve seed words. Note that this will
        delete any existing wallet on this device.
      </div>
      <div style={{ width: '71.57%' }}>
        Seed words
        <SeedWords>
          phrase lens defense jacket around increase link oppose grab february
          later stamp
        </SeedWords>
        <Form
          {...layout}
          name='basic'
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item label='New Password (Optional)' name='newPassword'>
            <Input.Password size='large' />
          </Form.Item>
          <Form.Item
            label='Confirm Password'
            name='confirmPassword'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password size='large' />
          </Form.Item>
          <Form.Item style={{ marginTop: 39 }}>
            <Btn
              type='primary'
              ghost
              style={{ marginRight: 20 }}
              onClick={() => props.history.goBack()}
            >
              Cancel
            </Btn>
            <Btn type='primary' htmlType='submit'>
              Restore
            </Btn>
          </Form.Item>
        </Form>
      </div>
    </Wrapper>
  )
}
export default withRouter(Restore)
