import { Avatar, Button, Col, Row } from 'antd'
import React from 'react'

const AccountCard = (props) => {
  const { name, id, handleSend } = props
  return (
    <Row
      justify='space-between'
      style={{
        height: 98,
        background: '#34363f',
        borderRadius: 4,
        padding: '0 20px',
        marginBottom: 24
      }}
      align='middle'
    >
      <Col>
        <Row align='middle'>
          <Col>
            <Avatar style={{ background: '#6dbcf7', marginRight: 14 }} />
          </Col>
          <Col>
            {name && <div>{name}</div>}
            {id}
          </Col>
        </Row>
      </Col>
      <Col>
        <Button
          type='primary'
          size='large'
          style={{ width: 120 }}
          onClick={handleSend}
        >
          Send
        </Button>
      </Col>
    </Row>
  )
}
export default React.memo(AccountCard)
