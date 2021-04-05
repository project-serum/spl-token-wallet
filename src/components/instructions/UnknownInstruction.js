import React from 'react';
import { Title } from '../../pages/commonStyles';
import LabelValue from './LabelValue';

export default function UnknownInstruction({ instruction, onOpenAddress }) {
  return (
    <>
      <Title
        variant="subtitle1"
        style={{ fontWeight: 'bold' }}
        gutterBottom
      >
        Unknown instruction:
      </Title>
      <LabelValue
        key="Program"
        label="Program"
        value={instruction.programId?.toBase58()}
        link={true}
        gutterBottom={true}
        onClick={() => onOpenAddress(instruction.programId.toBase58())}
      />
      {instruction.accountMetas &&
        instruction.accountMetas.map((accountMeta, index) => {
          return (
            <>
              <LabelValue
                key={index + ''}
                label={'Account #' + (index + 1)}
                value={accountMeta.publicKey.toBase58()}
                link={true}
                onClick={() => onOpenAddress(accountMeta.publicKey.toBase58())}
              />
              <Title gutterBottom>
                Writable: {accountMeta.isWritable.toString()}
              </Title>
            </>
          );
        })}
      <Title style={{ wordBreak: 'break-all' }}>
        Data: {instruction.rawData}
      </Title>
    </>
  );
}
