import React from 'react';
import LabelValue from './LabelValue';
import { useWallet } from '../../utils/wallet';
import { Title } from '../../pages/commonStyles';

export default function Neworder({ instruction, onOpenAddress, v3=false }) {
  const wallet = useWallet();
  const { data, market, marketInfo } = instruction;
  const marketLabel =
    (marketInfo &&
      marketInfo?.name + (marketInfo?.deprecated ? ' (deprecated)' : '')) ||
    market?._decoded?.ownAddress?.toBase58() ||
    'Unknown';

  const getAddressValue = (address) => {
    const isOwner = wallet.publicKey.equals(address);
    return isOwner ? 'This wallet' : address?.toBase58() || 'Unknown';
  };

  const { side, limitPrice, orderType, ownerPubkey } = data;
  const maxQuantity = v3 ? data.maxBaseQuantity : data.maxQuantity;
  return (
    <>
      <Title
        variant="subtitle1"
        style={{ fontWeight: 'bold', fontSize: '1.6rem' }}
        gutterBottom
      >
        Place an order
      </Title>
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
    </>
  );
}
