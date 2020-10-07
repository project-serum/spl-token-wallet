import React from 'react';
import { Switch } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

export default function SwitchComponent({ text, checked, onChange }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        padding: 10,
        borderRadius: 10,
      }}
    >
      <Switch
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
        onChange={onChange}
        checked={checked}
      />
      <span style={{ marginLeft: 8, fontWeight: 500 }}>{text}</span>
    </div>
  );
}
