import { TokenInstructions } from '@project-serum/serum';
import React, { useState } from 'react';
import CoinPlaceholder from '../images/coinPlaceholder.svg';
import { CCAI_MINT } from '../utils/tokens/instructions';

export default function TokenIcon({
  mint,
  tokenLogoUri,
  tokenName,
  size = '2rem',
  style = {}
}: {
  mint?: any;
  tokenLogoUri?: string;
  tokenName: string;
  size?: string;
  style?: any
}) {
  const [hasError, setHasError] = useState(false);

  if (mint === TokenInstructions.WRAPPED_SOL_MINT.toString()) {
    tokenLogoUri =
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png';
  }
  
  if (mint === CCAI_MINT.toString()) {
    tokenLogoUri =
    'https://aldrin.com/logo_rounded.png';
  }

  if (hasError || !tokenLogoUri) {
    tokenLogoUri = CoinPlaceholder;
  }

  return (
    <img
      src={tokenLogoUri}
      title={tokenName}
      alt={tokenName}
      style={{
        width: size,
        height: size,
        borderRadius: mint === CCAI_MINT.toString() ? 0 : `calc(${size} / 2)`,
        ...style,
      }}
      onError={() => setHasError(true)}
    />
  );
}
