import React, { useState, useEffect } from 'react';
import LabelValue from './LabelValue';
import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Program, Provider } from '@project-serum/anchor';
import { useWallet } from '../../utils/wallet';
import { useConnection } from '../../utils/connection';

export default function UnknownInstruction({ instruction, onOpenAddress }) {
  const [anchorProgram, setAnchorProgram] = useState(null);
  const connection = useConnection();
  const wallet = useWallet();

  // Fetch the anchor IDL and generate a client. If the IDL isn't on chain,
  // do nothing.
  useEffect(() => {
    const provider = new Provider(connection, wallet, {});
    Program.at(instruction.programId, provider)
      .then(setAnchorProgram)
      .catch((err) => {});
  }, [connection, wallet, instruction, setAnchorProgram]);

  // Format all the fields of the instruction.
  let formattedIx = null,
    ix = null;
  if (anchorProgram) {
    ix = anchorProgram.coder.instruction.decode(instruction.rawData);
    if (ix !== null) {
      formattedIx = anchorProgram.coder.instruction.format(
        ix,
        instruction.accountMetas,
      );
    }
  }

  return (
    <>
      <Typography
        variant="subtitle1"
        style={{ fontWeight: 'bold' }}
        gutterBottom
      >
        {formattedIx && ix.name
          ? sentenceCase(ix.name)
          : 'Unknown instruction:'}
      </Typography>
      <LabelValue
        key="Program"
        label={<b>Program</b>}
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
                label={
                  <b>
                    {formattedIx && formattedIx.accounts[index].name
                      ? formattedIx.accounts[index].name
                      : 'Account #' + (index + 1)}
                  </b>
                }
                value={accountMeta.publicKey.toBase58()}
                link={true}
                onClick={() => onOpenAddress(accountMeta.publicKey.toBase58())}
              />
              <Typography gutterBottom>
                Writable: {accountMeta.isWritable.toString()}
              </Typography>
            </>
          );
        })}
      {formattedIx ? (
        <>
          <Typography style={{ wordBreak: 'breaking-all' }}>
            <b>Data:</b>
          </Typography>
          <DecodedInstruction formattedFields={formattedIx.args} />
        </>
      ) : (
        <Typography style={{ wordBreak: 'breaking-all' }}>
          <b>Data:</b> {instruction.rawData}
        </Typography>
      )}
    </>
  );
}

function DecodedInstruction({ formattedFields }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>#</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Data</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {formattedFields.map((field, idx) => {
          return (
            <TableRow>
              <TableCell>{idx.toString()}</TableCell>
              <TableCell>{field.name}</TableCell>
              <TableCell>{field.type}</TableCell>
              <TableCell>{field.data}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function sentenceCase(field: string): string {
  const result = field.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}
