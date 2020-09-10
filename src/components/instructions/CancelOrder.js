import React from 'react';
import Typography from '@material-ui/core/Typography';
import KeyValue from './KeyValue';

export default function CancelOrder({ instruction }) {
  const { data, marketAddress, marketName } = instruction;
  const { side, orderId } = data;

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
        Cancel an order:
      </Typography>
      <KeyValue
        label="Market"
        value={marketName || marketAddress?.toBase58() || 'Unknown'}
        link={true}
        onClick={() => onOpenAddress(marketAddress?.toBase58())}
      />
      <KeyValue label="Order Id" value={orderId + ''} />
      <KeyValue
        label="Side"
        value={side.charAt(0).toUpperCase() + side.slice(1)}
      />
    </>
  );
}
