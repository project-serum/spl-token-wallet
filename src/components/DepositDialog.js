import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogForm from './DialogForm';
import { abbreviateAddress } from '../utils/utils';
import { Button, Typography } from '@material-ui/core';
import CopyableDisplay from './CopyableDisplay';
import { makeStyles } from '@material-ui/core/styles';
import QrcodeIcon from 'mdi-material-ui/Qrcode';
import QRCode from 'qrcode.react';

export default function DepositDialog({
  open,
  onClose,
  publicKey,
  balanceInfo,
}) {
  let { mint, tokenName, tokenSymbol, owner } = balanceInfo;

  return (
    <DialogForm open={open} onClose={onClose}>
      <DialogTitle>
        Deposit {tokenName ?? abbreviateAddress(mint)}
        {tokenSymbol ? ` (${tokenSymbol})` : null}
      </DialogTitle>
      <DialogContent>
        {publicKey.equals(owner) ? (
          <Typography>
            This address can only be used to receive SOL. Do not send other
            tokens to this address.
          </Typography>
        ) : (
          <Typography>
            This address can only be used to receive {tokenSymbol}. Do not send
            SOL to this address.
          </Typography>
        )}
        <CopyableDisplay
          value={publicKey.toBase58()}
          label={'Deposit Address'}
          autoFocus
        />
        <Qrcode value={publicKey.toBase58()} />
      </DialogContent>
    </DialogForm>
  );
}

const useQrCodeStyles = makeStyles((theme) => ({
  qrcodeButton: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  qrcodeIcon: {
    marginRight: theme.spacing(1),
  },
  qrcodeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
}));

function Qrcode({ value }) {
  const [showQrcode, setShowQrcode] = React.useState(false);

  const classes = useQrCodeStyles();
  return (
    <>
      <Button
        variant="contained"
        onClick={() => setShowQrcode(!showQrcode)}
        className={classes.qrcodeButton}
      >
        <QrcodeIcon className={classes.qrcodeIcon} />
        {showQrcode ? 'Hide QR Code' : 'Show QR Code'}
      </Button>
      {showQrcode && (
        <div className={classes.qrcodeContainer}>
          <QRCode value={value} size={256} includeMargin />
        </div>
      )}
    </>
  );
}
