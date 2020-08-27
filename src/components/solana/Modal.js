import { QrcodeOutlined } from '@ant-design/icons';
import { Button, Input, Modal, message } from 'antd';
import QRCode from 'qrcode.react';
import React, { useCallback, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled from 'styled-components';

const QRCodeWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
`;
const QRImage = styled(QRCode)`
  margin-right: 1rem;
  background-color: #fff;
  padding: 4px;
  display: block;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`;
const Text = styled.p`
  color: ${({ theme }) => (theme.mode === 'dark' ? '#98a1af' : '#4a4a4a')};
`;
const Content = styled.p`
  color: ${({ theme }) => theme[theme.mode].text};
`;
const ModalComponent = (props) => {
  const [showQRCode, setShowQRCode] = useState(true);
  const { visible, onCancel } = props;
  const handleClick = useCallback(() => {
    setShowQRCode(!showQRCode);
  }, [showQRCode]);
  return (
    <Modal
      visible={visible}
      title="Deposit BTC"
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Content>All deposits go to your Solana wallet</Content>
      <Content>
        Only Bitcoin (BTC) should be sent to this address! Sending any other
        coins may result in the loss of your deposit.
      </Content>
      <Text>BTC deposit address</Text>
      <Content>
        <Input
          value={'3AVEBnfbw6Je9NruXwdoW7E8GD5o9Ab9Pj'}
          style={{ width: 'calc(100% - 140px)', height: 52 }}
          size="large"
        />
        <CopyToClipboard
          onCopy={() => message.success('copy success')}
          text={'3AVEBnfbw6Je9NruXwdoW7E8GD5o9Ab9Pj'}
        >
          <Button
            type="primary"
            style={{ width: 120, marginLeft: 20 }}
            size="large"
          >
            COPY
          </Button>
        </CopyToClipboard>
      </Content>
      {!showQRCode && (
        <Button type="link">Manage Crypto Purchases via Credit Card</Button>
      )}
      <Content style={{ textAlign: 'center', paddingTop: 26 }}>
        {!showQRCode && (
          <QRCodeWrapper>
            <QRImage value={'3AVEBnfbw6Je9NruXwdoW7E8GD5o9Ab9Pj'} size={124} />
            <Content style={{ paddingTop: 12, color: '#98a1af' }}>
              Scan to Deposit
            </Content>
          </QRCodeWrapper>
        )}

        <Button type="primary" ghost size="large" onClick={handleClick}>
          <QrcodeOutlined />
          {showQRCode ? 'SHOW QR CODE' : 'HIDE QR CODE'}
        </Button>
      </Content>
    </Modal>
  );
};
export default React.memo(ModalComponent);
