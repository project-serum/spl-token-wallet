import React from 'react';
import Typography from '@material-ui/core/Typography';
import KeyValue from './KeyValue';

export default function Neworder({ instruction }) {
  const { data, market, marketAddress, marketName } = instruction;
  const { clientId, side, limitPrice, maxQuantity, orderType } = data;

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
        Place an order:
      </Typography>
      <KeyValue
        label="Market"
        value={marketName || marketAddress?.toBase58() || 'Unknown'}
        link={true}
        onClick={() => onOpenAddress(marketAddress?.toBase58())}
      />
      <KeyValue
        label="Side"
        value={side.charAt(0).toUpperCase() + side.slice(1)}
      />
      <KeyValue
        label="Price"
        value={market?.priceLotsToNumber(limitPrice) || '' + limitPrice}
      />
      <KeyValue
        label="Quantity"
        value={market?.baseSizeLotsToNumber(maxQuantity) || '' + maxQuantity}
      />
      <KeyValue
        label="Type"
        value={orderType.charAt(0).toUpperCase() + orderType.slice(1)}
      />
      <KeyValue label="Client ID" value={clientId + ''} />
    </>
  );
}
