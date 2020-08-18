import { Button, Checkbox, Col, Form, Input, Row } from 'antd';
import { withRouter } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import imageMapping from '../modules/shared/imageMapping';
import styled from 'styled-components';
import { getQueryString } from '../modules/shared/tools';
const LoginWrapper = styled(Col)`
  height: 612px;
  border-radius: 20px;
  background-color: #2b2c34;
  
  input:-webkit-autofill,
  .ant-form-item-has-error .ant-input-affix-wrapper input:focus {
    -webkit-text-fill-color: #fff;
    box-shadow: 0 0 0px 1000px #232429 inset !important;
  }
  .ant-form {
    padding: 0 160px;
  }
`;
const Title = styled.div`
  color: #fff;
  font-size: 40px;
  margin: 80px 0;
  text-align: center;
  font-family: Robotoo;
  font-weight: bold;
`;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const SetPassword = (props) => {
  const [statusSuccess, setStatusSuccess] = useState('');
  const onFinish = useCallback(
    (values: object) => {
      console.log('Success:', values);
      props.history.push('/createAccount');
    },
    [props.history],
  );

  const onFinishFailed = useCallback((errorInfo: any) => {
    console.log('Failed:', errorInfo);
  }, []);
  const toRestore = useCallback(() => {
    props.history.push('/restore');
  }, [props.history]);
  useEffect(() => {
    setStatusSuccess(getQueryString('status') || '');
  }, [props.history]);
  return (
    <Row justify="space-between" style={{ padding: '0 78px' }}>
      <Col style={{ width: '46.89%' }}>
        <img
          src={imageMapping.man}
          alt=""
          style={{
            position: 'absolute',
            bottom: -66,
            left: '50%',
            transform: 'translateX(-60%)',
          }}
        />
      </Col>
      <LoginWrapper style={{ width: '53.11%' }}>
        {statusSuccess ? (
          <>
            <Title style={{ marginBottom: 3 }}>Welcom Back!</Title>
            <div style={{ marginBottom: 80, textAlign: 'center' }}>
              The decetralized web awaits
            </div>
            <Form
              {...layout}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}
              >
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item style={{ marginTop: 8 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ height: 52, fontSize: 18 }}
                  block
                >
                  Unlock
                </Button>
              </Form.Item>
              <Form.Item
                name="agreement"
                valuePropName="checked"
                style={{ marginBottom: 10 }}
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject('Should accept agreement'),
                  },
                ]}
              >
                <Checkbox>Keep wallet unlockede</Checkbox>
              </Form.Item>
              <div
                style={{ color: '#2a87f6', cursor: 'pointer' }}
                onClick={toRestore}
              >
                Restore existing wallet
              </div>
            </Form>
          </>
        ) : (
            <>
              <Title>Set your pass words</Title>
              <Form
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  label="Password（min 8 chars）"
                  name="password"
                  rules={[
                    { required: true, message: 'Please input your password!' },
                    { min: 8, message: 'Username must be minimum 8 characters.' },
                  ]}
                >
                  <Input.Password size="large" />
                </Form.Item>

                <Form.Item
                  label="Comfirm password"
                  name="comfirmPassword"
                  rules={[
                    { required: true, message: 'Please input your password!' },
                    { min: 5, message: 'Username must be minimum 8 characters.' },
                  ]}
                >
                  <Input.Password size="large" />
                </Form.Item>
                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject('Should accept agreement'),
                    },
                  ]}
                >
                  <Checkbox>
                    I have read and agree to the{' '}
                    <span style={{ color: '#2a87f6' }}>T&C</span>
                  </Checkbox>
                </Form.Item>
                <Form.Item style={{ marginTop: 8 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ height: 52, fontSize: 18 }}
                    block
                  >
                    Confirm
                </Button>
                </Form.Item>
              </Form>
            </>
          )}
      </LoginWrapper>
    </Row>
  );
};
export default withRouter(SetPassword);
