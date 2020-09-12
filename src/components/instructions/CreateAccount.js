import React from 'react';
import Typography from '@material-ui/core/Typography';
import KeyValue from './KeyValue';

export default function CreateAccount({ instruction, onOpenAddress }) {
  const { data } = instruction;
  const { marketAddress, owner } = data;

  return (
    <>
      <Typography
        variant="subtitle1"
        style={{ fontWeight: 'bold' }}
        gutterBottom
      >
        Create an account:
      </Typography>
      <KeyValue
        label="Address"
        value={marketAddress?.toBase58()}
        link={true}
        onClick={() => onOpenAddress(marketAddress?.toBase58())}
      />
      <KeyValue
        label="Owner"
        value={owner?.toBase58()}
        link={true}
        onClick={() => onOpenAddress(owner?.toBase58())}
      />
    </>
  );
}
