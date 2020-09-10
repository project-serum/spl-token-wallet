import React from 'react';
import Typography from '@material-ui/core/Typography';
import KeyValue from './KeyValue';

export default function MatchOrder({ instruction }) {
  const { data, marketAddress, marketName } = instruction;
  const { limit } = data;

  const onOpenAddress = (address) => {
    address &&
      window.open('https://explorer.solana.com/address/' + address, '_blank');
  };

  return (
    <>
      <Typography
        variant="subtitle1"
        style={{ fontWeight: 'bold' }}
        gutterBottom
      >
        Match orders
      </Typography>
      <KeyValue
        label="Market"
        value={marketName || marketAddress?.toBase58() || 'Unknown'}
        link={true}
        onClick={() => onOpenAddress(marketAddress?.toBase58())}
      />
      {limit && <KeyValue label="Limit" value={limit} />}
    </>
  );
}
