import React from 'react';
import { Card } from 'antd';
import LabelValue from './LabelValue';

const TYPE_LABELS = {
  systemCreate: 'Create account',
  systemTransfer: 'Transfer SOL',
};

const DATA_LABELS = {
  toPubkey: { label: 'To', address: true },
  accountPubkey: { label: 'Account', address: true },
  basePubkey: { label: 'Base', address: true },
  seed: { label: 'Seed', address: false },
  noncePubkey: { label: 'Nonce', address: true },
  authorizedPubkey: { label: 'Authorized', address: true },
  newAuthorizedPubkey: { label: 'New authorized', address: true },
  newAccountPubkey: { label: 'New account', address: true },
  amount: { label: 'Amount', address: false },
  lamports: { label: 'Lamports', address: false },
};

export default function SystemInstruction({ instruction, onOpenAddress }) {
  const { type, data } = instruction;

  return (
    <Card bordered={false} size="small" title={TYPE_LABELS[type]}>
      {data &&
        Object.entries(data).map(([key, value]) => {
          const dataLabel = DATA_LABELS[key];
          if (!dataLabel) {
            return null;
          }
          const { label, address } = dataLabel;
          return (
            <LabelValue
              key={key}
              label={label + ''}
              value={address ? value?.toBase58() : value}
              link={address}
              onClick={() => address && onOpenAddress(value?.toBase58())}
            />
          );
        })}
    </Card>
  );
}
