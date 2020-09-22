import React from 'react';
import Typography from '@material-ui/core/Typography';
import LabelValue from './LabelValue';
import { useWallet, useWalletPublicKeys } from '../../utils/wallet';
import { TOKEN_MINTS } from '@project-serum/serum';

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
  ownerPubkey: { label: 'Owner', address: true },
};

export default function TokenInstruction({ instruction, onOpenAddress }) {
  const wallet = useWallet();
  const [publicKeys] = useWalletPublicKeys();
  const { type, data } = instruction;

  const getAddressValue = (address) => {
    const tokenMint = TOKEN_MINTS.find((token) =>
      token.address.equals(address),
    );
    const isOwned = publicKeys.some((ownedKey) => ownedKey.equals(address));
    const isOwner = wallet.publicKey.equals(address);
    return tokenMint
      ? tokenMint.name
      : isOwner
      ? 'This wallet'
      : (isOwned ? '(Owned) ' : '') + address?.toBase58();
  };

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
              key={key}
              label={label + ''}
              value={address ? getAddressValue(value) : value}
              link={address}
              onClick={() => address && onOpenAddress(value?.toBase58())}
            />
          );
        })}
    </>
  );
}
