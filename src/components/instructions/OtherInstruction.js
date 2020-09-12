import React from 'react';
import Typography from '@material-ui/core/Typography';
import KeyValue from './KeyValue';

const TYPE_LABELS = {
  initializeAccount: 'Initialize account',
  transfer: 'Transfer',
  approve: 'Approve',
  mintTo: 'Mint to',
  closeAccount: 'Close account',
};

const DATA_LABELS = {
  amount: 'Amount',
};

export default function OtherInstruction({ instruction }) {
  const { type, data } = instruction;

  return (
    <>
      <Typography
        variant="subtitle1"
        style={{ fontWeight: 'bold' }}
        gutterBottom
      >
        {TYPE_LABELS[type]}
      </Typography>
      {data &&
        Object.entries(data).map(([key, value]) => (
          <KeyValue
            label={DATA_LABELS[key]}
            value={value}
          />
        ))}
    </>
  );
}
