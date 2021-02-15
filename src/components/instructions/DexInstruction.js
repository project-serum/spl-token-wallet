import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import LabelValue from './LabelValue';
import { useWallet, useWalletPublicKeys } from '../../utils/wallet';

const TYPE_LABELS = {
  cancelOrder: 'cancel_order',
  newOrder: 'place_order',
  settleFunds: 'settle_funds',
  matchOrders: 'match_orders',
};

const DATA_LABELS = {
  side: { label: 'side', address: false },
  orderId: { label: 'order_id', address: false },
  limit: { label: 'limit', address: false },
  basePubkey: { label: 'base_wallet', address: true },
  quotePubkey: { label: 'quote_wallet', address: true },
};

export default function DexInstruction({ instruction, onOpenAddress }) {
  const wallet = useWallet();
  const [publicKeys] = useWalletPublicKeys();
  const { t } = useTranslation();
  const { type, data, market, marketInfo } = instruction;

  const marketLabel =
    (marketInfo &&
      marketInfo?.name + (marketInfo?.deprecated ? t("deprecated") : '')) ||
    market?._decoded?.ownAddress?.toBase58() ||
    t("unknown");

  const getAddressValue = (address) => {
    const isOwned = publicKeys.some((ownedKey) => ownedKey.equals(address));
    const isOwner = wallet.publicKey.equals(address);
    return isOwner
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
      <LabelValue
        label={t("market")}
        value={marketLabel}
        link={true}
        onClick={() =>
          onOpenAddress(
            (marketInfo?.address || market?._decoded?.ownAddress)?.toBase58(),
          )
        }
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
              key={key}
              label={label + ''}
              value={address ? getAddressValue(value) : value + ''}
              link={address}
              onClick={() => address && onOpenAddress(value?.toBase58())}
            />
          );
        })}
    </>
  );
}
