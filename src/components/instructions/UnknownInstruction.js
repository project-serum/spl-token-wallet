import React from 'react';
import Typography from '@material-ui/core/Typography';
import bs58 from 'bs58';

export default function UnknownInstruction({ origin, message }) {
  return (
    <>
      <Typography variant="h6" component="h1" gutterBottom>
        {origin} would like to send the following transaction:
      </Typography>
      <Typography style={{ wordBreak: 'break-all' }}>
        {bs58.encode(message)}
      </Typography>
    </>
  );
}
