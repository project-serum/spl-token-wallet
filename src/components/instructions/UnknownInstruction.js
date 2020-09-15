import React from 'react';
import Typography from '@material-ui/core/Typography';

export default function UnknownInstruction({ instruction }) {
  return (
    <>
      <Typography
        variant="subtitle1"
        style={{ fontWeight: 'bold' }}
        gutterBottom
      >
        Unknown instruction:
      </Typography>
      <Typography style={{ wordBreak: 'break-all' }}>
        {instruction?.rawData}
      </Typography>
    </>
  );
}
