import React from 'react';
import Typography from '@material-ui/core/Typography';
import LabelValue from './LabelValue';

const TYPE_LABELS = {
  cancelOrder: 'Cancel order',
  newOrder: 'Place order',
  settleFunds: 'Settle funds',
  matchOrders: 'Match orders',
};

const DATA_LABELS = {
  side: { label: 'Side', address: false },
  orderId: { label: 'Order Id', address: false },
  limit: { label: 'Limit', address: false },
  basePubkey: { label: 'Base wallet', address: true },
  quotePubkey: { label: 'Quote wallet', address: true },
};

export default function DexInstruction({ instruction, onOpenAddress }) {
  const { type, data, marketInfo } = instruction;

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
        {TYPE_LABELS[type]}
      </Typography>
      <LabelValue
        label="Market"
        value={marketLabel}
        link={true}
        onClick={() => onOpenAddress(marketInfo?.address?.toBase58())}
      />
      {data &&
        Object.entries(data).map(([key, value]) => {
          const dataLabel = DATA_LABELS[key];
          if (!dataLabel) {
            return null;
          }
          const { label, address } = dataLabel;
          return (
            <LabelValue
              label={label + ''}
              value={address ? value?.toBase58() : value + ''}
              link={address}
              onClick={() => address && onOpenAddress(value?.toBase58())}
            />
          );
        })}
    </>
  );
}
