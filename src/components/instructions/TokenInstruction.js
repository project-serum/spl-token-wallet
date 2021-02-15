import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import LabelValue from './LabelValue';
import { useWallet, useWalletPublicKeys } from '../../utils/wallet';
import { TOKEN_MINTS } from '@project-serum/serum';

const TYPE_LABELS = {
  initializeMint: 'initialize_mint',
  initializeAccount: 'initialize_account',
  transfer: 'transfer',
  approve: 'approve',
  mintTo: 'mint_to',
  closeAccount: 'close_account',
};

const DATA_LABELS = {
  amount: { label: 'amount', address: false },
  accountPubkey: { label: 'account', address: true },
  mintPubkey: { label: 'mint', address: true },
  sourcePubkey: { label: 'source', address: true },
  destinationPubkey: { label: 'destination', address: true },
  ownerPubkey: { label: 'owner', address: true },
};

export default function TokenInstruction({ instruction, onOpenAddress }) {
  const wallet = useWallet();
  const [publicKeys] = useWalletPublicKeys();
  const { t } = useTranslation();
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
      ? t("this_wallet")
      : (isOwned ? t("owned") : '') + address?.toBase58();
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
