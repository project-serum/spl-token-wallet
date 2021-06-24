import React from 'react';
import Typography from '@material-ui/core/Typography';
import LabelValue from './LabelValue';

const TYPE_LABELS = {
  stakeAuthorizeWithSeed: 'Create account',
  stakeAuthorize: 'Create account with seed',
  stakeDeactivate: 'Transfer SOL',
  stakeDelegate: 'Transfer SOL',
  stakeInitialize: 'Transfer SOL',
  stakeSplit: 'Transfer SOL',
  stakeWithdraw: 'Transfer SOL',
};

const DATA_LABELS = {
  stakePubkey: { label: 'Stake', address: true },
  authorized: { label: 'Authorized', address: false },
  lockup: { label: 'Lockup', address: false, transform: () => JSON.stringify },
  authorizedPubkey: { label: 'Authorized', address: false },
  votePubkey: { label: 'Vote', address: true },
  authorizedSeed: { label: 'Seed', address: false },
  noncePubkey: { label: 'Nonce', address: true },
  authorityBase: { label: 'Authority base', address: true },
  authoritySeed: { label: 'Authority base', address: true },
  authorityOwner: { label: 'Authority owner', address: true },
  newAuthorizedPubkey: { label: 'New authorized', address: true },
  stakeAuthorizationType: { label: 'Stake authorization type', address: false, transform: () => JSON.stringify },
  custodianPubkey: { label: 'Custodian', address: true },
  splitStakePubkey: { label: 'Split to', address: true },
  lamports: { label: 'Lamports', address: false },
};

export default function StakeInstruction({ instruction, onOpenAddress }) {
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
          const { label, address, transform } = dataLabel;
          return (
            <LabelValue
              key={key}
              label={label + ''}
              value={address ? value?.toBase58() : (transform ? transform(value) : value)}
              link={address}
              onClick={() => address && onOpenAddress(value?.toBase58())}
            />
          );
        })}
    </>
  );
}
