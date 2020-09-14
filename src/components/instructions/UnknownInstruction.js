import React from 'react';
import Typography from '@material-ui/core/Typography';
import bs58 from 'bs58';

export default function UnknownInstruction({ message }) {
  return (
    <>
      <Typography
        variant="subtitle1"
        style={{ fontWeight: 'bold' }}
        gutterBottom
      >
        Send the following transaction:
      </Typography>
      <Typography style={{ wordBreak: 'break-all' }}>
        {bs58.encode(message)}
      </Typography>
    </>
  );
}
