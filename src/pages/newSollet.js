import { DownloadOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Col, Row } from 'antd'
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";

import React, { useCallback } from 'react'
import styled from 'styled-components'
const Wrapper = styled.div`
  padding: 107px 195px 0;
`
const Title = styled.div`
  color: #fff;
  font-size: 30px;
  padding-bottom: 61px;
  text-align: center;
`
const Box = styled(Col)`
  width: 47.619%;
  height: 318px;
  border-radius: 6px;
  border: solid 2px #74daf6;
  margin-right: 50px;
  text-align: center;
  &:last-child {
    margin-right: 0;
  }
`
const Tip = styled.div`
  color: #fff;
  font-size: 20px;
  padding: 19px 0 8px;
`
const Descrition = styled.div`
  font-size: 14px;
  color: #aaaaad;
  padding-bottom: 30px;
`
const Btn = styled(Button)`
  width: 240px;
  height: 52px;
  color: #000;
  border-radius: 6px;
`
const NewSollet = (props) => {
  const toRestore = useCallback(() => {
    props.history.push('/restore')
  }, [props.history])
  return (
    <Wrapper>
      <Title>New to Sollet?</Title>
      <Row>
        <Box>
          <DownloadOutlined style={{ fontSize: 51, marginTop: 55 }} />
          <Tip>No, I already have a seed phrase</Tip>
          <Descrition>
            Import your existing wallet using a 12 word seed phrase
          </Descrition>
          <Btn type='primary' onClick={toRestore}>
            Import wallet
          </Btn>
        </Box>
        <Box style={{ borderColor: '#979797' }}>
          <PlusOutlined style={{ fontSize: 51, marginTop: 55 }} />
          <Tip>Yes, let’s get set up!</Tip>
          <Descrition>This will create a new wallet and seed phrase</Descrition>
          <Btn type='primary'>
            <Link to='/setPassword'>Create a Wallet</Link>
          </Btn>
        </Box>
      </Row>
    </Wrapper>
  )
}
export default withRouter(NewSollet)
