import { Typography } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSolanaExplorerUrlSuffix } from '../utils/connection';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogForm from './DialogForm';
import { abbreviateAddress } from '../utils/utils';
import CopyableDisplay from './CopyableDisplay';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  explorerLink: {
    marginBottom: theme.spacing(2),
  },
  warning: {
    marginBottom: theme.spacing(2),
  },
  container: {
    minWidth: 600,
  },
}));

export default function TokenInfoDialog({
  open,
  onClose,
  publicKey,
  balanceInfo,
}) {
  let { mint, tokenName, tokenSymbol } = balanceInfo;
  const urlSuffix = useSolanaExplorerUrlSuffix();
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <DialogForm open={open} onClose={onClose}>
      <DialogTitle>
        {tokenName ?? abbreviateAddress(mint)}
        {tokenSymbol ? ` (${tokenSymbol})` : null}
      </DialogTitle>
      <DialogContent className={classes.container}>
        <Typography className={classes.warning}>
          {t("info_about", {tokenName: tokenName ?? abbreviateAddress(mint)})}
        </Typography>
        <Typography variant="body2" className={classes.explorerLink}>
          <Link
            href={
              `https://explorer.solana.com/account/${publicKey.toBase58()}` +
              urlSuffix
            }
            target="_blank"
            rel="noopener"
          >
            {t("view_solana")}
          </Link>
        </Typography>
        {!!mint && (
          <CopyableDisplay
            value={mint.toBase58()}
            label={t("token_mint_address")}
            autoFocus
            helperText={
              <>
                {t("not_your_deposit_address")}
              </>
            }
          />
        )}
        {!!tokenName && (
          <CopyableDisplay value={tokenName} label={t("token_name")} />
        )}
        {!!tokenSymbol && (
          <CopyableDisplay value={tokenSymbol} label={t("token_symbol")} />
        )}
      </DialogContent>
    </DialogForm>
  );
}
