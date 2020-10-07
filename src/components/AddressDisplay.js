import React from 'react';
import { Typography, Button } from 'antd';
import { useSolanaExplorerUrlSuffix } from '../utils/connection';
import QRCode from 'qrcode.react';

const { Paragraph } = Typography;

export default function AddressDisplay({
  title,
  address,
  showLink = false,
  showQR = false,
  style,
  addressStyle = 18,
}) {
  const urlSuffix = useSolanaExplorerUrlSuffix();

  if (!address) {
    return null;
  }

  return (
    <>
      <div class="ant-statistic" style={style}>
        <div class="ant-statistic-title">{title}</div>
        <div class="ant-statistic-content">
          <Paragraph
            style={{ fontSize: 18, marginBottom: 0, ...addressStyle }}
            copyable
          >
            {address}
          </Paragraph>
        </div>
      </div>
      {showLink && (
        <Button
          type="link"
          component="a"
          href={`https://explorer.solana.com/account/${address}` + urlSuffix}
          target="_blank"
          rel="noopener"
        >
          View on Solana Explorer
        </Button>
      )}
      {showQR && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <QRCode value={address} size={256} includeMargin />
        </div>
      )}
    </>
  );
}
