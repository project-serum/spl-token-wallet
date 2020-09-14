import React from 'react';
import Typography from '@material-ui/core/Typography';
import LabelValue from './LabelValue';

const TYPE_LABELS = {
  initializeMint: 'Initialize mint',
  initializeAccount: 'Initialize account',
  transfer: 'Transfer',
  approve: 'Approve',
  mintTo: 'Mint to',
  closeAccount: 'Close account',
};

const DATA_LABELS = {
  amount: { label: 'Amount', address: false },
  accountPubkey: { label: 'Account', address: true },
  mintPubkey: { label: 'Mint', address: true },
  sourcePubkey: { label: 'Source', address: true },
  destinationPubkey: { label: 'Destination', address: true },
};

export default function TokenInstruction({ instruction, onOpenAddress }) {
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
        Object.entries(data).map(([key, value]) => {
          const dataLabel = DATA_LABELS[key];
          if (!dataLabel) {
            return null;
          }
          const { label, address } = dataLabel;
          return (
            <LabelValue
              label={label + ''}
              value={address ? value?.toBase58() : value}
              link={address}
              onClick={() => address && onOpenAddress(value?.toBase58())}
            />
          );
        })}
    </>
  );
}
