import React from 'react';
import Typography from '@material-ui/core/Typography';
import {
  SETTLE_FUNDS_BASE_WALLET_INDEX,
  SETTLE_FUNDS_QUOTE_WALLET_INDEX,
} from '@project-serum/serum';
import KeyValue from './KeyValue';

export default function SettleFunds({ instruction, onOpenAddress }) {
  const { marketInfo, accounts, accountKeys } = instruction;

  // get base wallet key
  const baseIndex =
    accounts.length > SETTLE_FUNDS_BASE_WALLET_INDEX &&
    accounts[SETTLE_FUNDS_BASE_WALLET_INDEX];
  const baseWalletKey =
    baseIndex && accountKeys?.length > baseIndex && accountKeys[baseIndex];

  // get quote wallet key
  const quoteIndex =
    accounts.length > SETTLE_FUNDS_QUOTE_WALLET_INDEX &&
    accounts[SETTLE_FUNDS_QUOTE_WALLET_INDEX];
  const quoteWalletKey =
    quoteIndex && accountKeys?.length > quoteIndex && accountKeys[quoteIndex];

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
        Settle funds:
      </Typography>
      <KeyValue
        label="Market"
        value={marketLabel}
        link={true}
        onClick={() => onOpenAddress(marketInfo?.address?.toBase58())}
      />
      <KeyValue
        label="Base address"
        value={baseWalletKey?.toBase58()}
        link={true}
        onClick={() => onOpenAddress(baseWalletKey?.toBase58())}
      />
      <KeyValue
        label="Quote address"
        value={quoteWalletKey?.toBase58()}
        link={true}
        onClick={() => onOpenAddress(quoteWalletKey?.toBase58())}
      />
    </>
  );
}
