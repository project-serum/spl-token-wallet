import { Avatar, Col, Row } from 'antd'
import React from 'react'
import styled from 'styled-components'
const Card = styled(Row)`
  vertical-align: middle;
  margin-left: 26px;
  display: inline-flex;
  padding: 24px 0;
`

const RenderCard = (props) => {
  const { userName, id } = props
  return (
    <Card align='middle'>
      <Col>
        <Avatar size={46} style={{ background: '#37abff', marginRight: 24 }} />
      </Col>
      <Col>
        <div style={{ color: '#fff' }}>{userName}</div>
        <div style={{ fontSize: 12 }}>{id}</div>
      </Col>
    </Card>
  )
}
export default React.memo(RenderCard)
