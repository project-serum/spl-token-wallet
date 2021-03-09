import React from 'react';
import LabelValue from './LabelValue';
import Typography from '@material-ui/core/Typography';

export default function UnknownInstruction({ instruction, onOpenAddress }) {
  return (
    <>
      <Typography
        variant="subtitle1"
        style={{ fontWeight: 'bold' }}
        gutterBottom
      >
        Unknown instruction:
      </Typography>
      {instruction.accounts.map((accountAddress, index) => {
          return (
            <LabelValue
              key={index + ''}
              label={'Account #' + (index + 1)}
              value={accountAddress?.toBase58()}
              link={true}
              onClick={() => onOpenAddress(accountAddress?.toBase58())}
            />
          );
        })}
      <LabelValue
        key='Program Id'
        label='Program Id:'
        value={instruction.programId?.toBase58()}
        link={true}
        onClick={() => onOpenAddress(instruction.programId?.toBase58())}
      />
      <Typography style={{ wordBreak: 'break-all' }}>
        data: {instruction.rawData}
      </Typography>
    </>
  );
}
