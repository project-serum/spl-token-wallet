import React from 'react';
import { Typography, Space } from 'antd';

const { Text } = Typography;

export default function LabelValue({ label, value, link = false, onClick }) {
  return (
    <Space direction="horizontal" style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Text type="secondary">{label}: </Text>
      {link ? (
        <a href="/#" onClick={onClick} style={{ wordBreak: 'break-all' }}>
          {value}
        </a>
      ) : (
        <Text>{value}</Text>
      )}
    </Space>
  );
}
