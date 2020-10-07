import React from 'react';
import { Card, Typography } from 'antd';

const { Text } = Typography;

export default function UnknownInstruction({ instruction }) {
  return (
    <Card bordered={false} size="small" title="Unknown instruction">
      <Text type="secondary" style={{ wordBreak: 'break-all' }}>
        {instruction?.rawData}
      </Text>
    </Card>
  );
}
