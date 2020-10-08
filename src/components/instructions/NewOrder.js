import React from 'react';
import { Card } from 'antd';
import LabelValue from './LabelValue';
import { useWallet } from '../../utils/wallet';

export default function Neworder({ instruction, onOpenAddress }) {
  const wallet = useWallet();
  const { data, market, marketInfo } = instruction;
  const { side, limitPrice, maxQuantity, orderType, ownerPubkey } = data;

  const marketLabel =
    (marketInfo &&
      marketInfo?.name + (marketInfo?.deprecated ? ' (deprecated)' : '')) ||
    market?._decoded?.ownAddress?.toBase58() ||
    'Unknown';

  const getAddressValue = (address) => {
    const isOwner = wallet.publicKey.equals(address);
    return isOwner ? 'This wallet' : address?.toBase58() || 'Unknown';
  };

  return (
    <Card bordered={false} size="small" title="Place an order">
      <LabelValue
        label="Market"
        value={marketLabel}
        link={true}
        onClick={() =>
          onOpenAddress(
            (marketInfo?.address || market?._decoded?.ownAddress)?.toBase58(),
          )
        }
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
      <LabelValue
        label="Owner"
        link={ownerPubkey}
        value={ownerPubkey ? getAddressValue(ownerPubkey) : ownerPubkey}
        onOpenAddress={() =>
          ownerPubkey && onOpenAddress(ownerPubkey?.toBase58())
        }
      />
    </Card>
  );
}
