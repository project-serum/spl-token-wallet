import React from 'react';
import Typography from '@material-ui/core/Typography';
import KeyValue from './KeyValue';

export default function InitializeMint({ instruction, onOpenAddress }) {
  const { data } = instruction;
  const { decimals, freezeAuthorityOption, freezeAuthority } = data;

  return (
    <>
      <Typography
        variant="subtitle1"
        style={{ fontWeight: 'bold' }}
        gutterBottom
      >
        Initialize mint:
      </Typography>
      <KeyValue label="Decimals" value={decimals} />
      <KeyValue label="Free authority option" value={freezeAuthorityOption} />
      {freezeAuthority && (
        <KeyValue
          label="Free authority"
          value={freezeAuthority?.toBase58()}
          link={true}
          onClick={() => onOpenAddress(freezeAuthority?.toBase58())}
        />
      )}
    </>
  );
}
