import React from 'react';
import Typography from '@material-ui/core/Typography';
import KeyValue from './KeyValue';

export default function MatchOrder({ instruction, onOpenAddress }) {
  const { data, marketInfo } = instruction;
  const { limit } = data;

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
        value={marketInfo?.name || marketInfo?.address?.toBase58() || 'Unknown'}
        link={true}
        onClick={() => onOpenAddress(marketInfo?.address?.toBase58())}
      />
      {limit && <KeyValue label="Limit" value={limit} />}
    </>
  );
}
