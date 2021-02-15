import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import LabelValue from './LabelValue';

const TYPE_LABELS = {
  systemCreate: 'create_account',
  systemTransfer: 'transfer_sol',
};

const DATA_LABELS = {
  toPubkey: { label: 'to', address: true },
  accountPubkey: { label: 'account', address: true },
  basePubkey: { label: 'base', address: true },
  seed: { label: 'seed', address: false },
  noncePubkey: { label: 'nonce', address: true },
  authorizedPubkey: { label: 'authorized', address: true },
  newAuthorizedPubkey: { label: 'new_authorized', address: true },
  newAccountPubkey: { label: 'new_account', address: true },
  amount: { label: 'amount', address: false },
  lamports: { label: 'lamports', address: false },
};

export default function SystemInstruction({ instruction, onOpenAddress }) {
  const { type, data } = instruction;
  const { t } = useTranslation();

  return (
    <>
      <Typography
        variant="subtitle1"
        style={{ fontWeight: 'bold' }}
        gutterBottom
      >
        {t(TYPE_LABELS[type])}
      </Typography>
      {data &&
        Object.entries(data).map(([key, value]) => {
          const dataLabel = t(DATA_LABELS[key]);
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
    </>
  );
}
