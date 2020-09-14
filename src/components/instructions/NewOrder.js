import React from 'react';
import Typography from '@material-ui/core/Typography';
import LabelValue from './LabelValue';

export default function Neworder({ instruction, onOpenAddress }) {
  const { data, market, marketInfo } = instruction;
  const { side, limitPrice, maxQuantity, orderType } = data;

  const marketLabel =
    marketInfo?.name + (marketInfo?.deprecated ? '(deprecated)' : '') ||
    marketInfo?.address?.toBase58() ||
    'Unknown';

  return (
    <>
      <Typography
        variant="subtitle1"
        style={{ fontWeight: 'bold' }}
        gutterBottom
      >
        Place an order
      </Typography>
      <LabelValue
        label="Market"
        value={marketLabel}
        link={true}
        onClick={() => onOpenAddress(marketInfo?.address?.toBase58())}
      />
      <LabelValue
        label="Side"
        value={side.charAt(0).toUpperCase() + side.slice(1)}
      />
      <LabelValue
        label="Price"
        value={market?.priceLotsToNumber(limitPrice) || '' + limitPrice}
      />
      <LabelValue
        label="Quantity"
        value={market?.baseSizeLotsToNumber(maxQuantity) || '' + maxQuantity}
      />
      <LabelValue
        label="Type"
        value={orderType.charAt(0).toUpperCase() + orderType.slice(1)}
      />
    </>
  );
}
