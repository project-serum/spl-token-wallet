import React, { useState } from 'react';
import { useEffectAfterTimeout } from '../utils/utils';
import { Spin } from 'antd';

export default function LoadingIndicator({ delay = 500, ...rest }) {
  const [visible, setVisible] = useState(false);

  useEffectAfterTimeout(() => setVisible(true), delay);

  if (!visible) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      {...rest}
    >
      <Spin />
    </div>
  );
}
