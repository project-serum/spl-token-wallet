import { QrcodeOutlined } from '@ant-design/icons'
import { Button, Input, Modal, message } from 'antd'
import QRCode from 'qrcode.react'
import React, { useCallback, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import styled from 'styled-components'

const QRCodeWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
`
const QRImage = styled(QRCode)`
  margin-right: 1rem;
  background-color: #fff;
  padding: 4px;
  display: block;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`
const ModalComponent = (props) => {
  const [showQRCode, setShowQRCode] = useState(true)
  const { visible, onCancel } = props
  const handleClick = useCallback(() => {
    setShowQRCode(!showQRCode)
  }, [showQRCode])
  return (
    <Modal
      visible={visible}
      title='Deposit BTC'
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <p>All deposits go to your Solana wallet</p>
      <p>
        Only Bitcoin (BTC) should be sent to this address! Sending any other
        coins may result in the loss of your deposit.
      </p>
      <p>BTC deposit address</p>
      <p>
        <Input
          value={'3AVEBnfbw6Je9NruXwdoW7E8GD5o9Ab9Pj'}
          style={{ width: 'calc(100% - 140px)', height: 52 }}
          size='large'
        />
        <CopyToClipboard
          onCopy={() => message.success('copy success')}
          text={'3AVEBnfbw6Je9NruXwdoW7E8GD5o9Ab9Pj'}
        >
          <Button
            type='primary'
            style={{ width: 120, marginLeft: 20 }}
            size='large'
          >
            COPY
          </Button>
        </CopyToClipboard>
      </p>
      <p style={{ textAlign: 'center', paddingTop: 26 }}>
        {!showQRCode && (
          <QRCodeWrapper>
            <QRImage value={'3AVEBnfbw6Je9NruXwdoW7E8GD5o9Ab9Pj'} size={124} />
            <p style={{ paddingTop: 12, color: '#98a1af' }}>Scan to Deposit</p>
          </QRCodeWrapper>
        )}

        <Button type='primary' ghost size='large' onClick={handleClick}>
          <QrcodeOutlined />
          {showQRCode ? 'SHOW QR CODE' : 'HIDE QR CODE'}
        </Button>
      </p>
    </Modal>
  )
}
export default React.memo(ModalComponent)
