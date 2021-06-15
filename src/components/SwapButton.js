import React from 'react';
import { Tooltip, Popover, IconButton } from '@material-ui/core';
import SwapHoriz from '@material-ui/icons/SwapHoriz';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import Swap from '@project-serum/swap-ui';
import { Provider } from '@project-serum/anchor';
import { Connection, TransactionSignature } from '@solana/web3.js';
import { TokenListContainer } from '@solana/spl-token-registry';
import { useTokenInfos } from '../utils/tokens/names';
import { useSendTransaction } from '../utils/notifications';
import { useWallet } from '../utils/wallet';
import { useConnection } from '../utils/connection';

export default function SwapButton({ size }) {
  const [sendTransaction] = useSendTransaction();
  const connection = useConnection();
  const wallet = useWallet();
  const tokenInfos = useTokenInfos();
  const tokenList = tokenInfos && new TokenListContainer(tokenInfos);
  const provider = new NotifyingProvider(connection, wallet, sendTransaction);

  return (
    tokenList && (
      <PopupState variant="popover">
        {(popupState) => (
          <div style={{ display: 'flex' }}>
            <Tooltip title="Swap Tokens">
              <IconButton {...bindTrigger(popupState)} size={size} >
                <SwapHoriz />
              </IconButton>
            </Tooltip>
            <Popover
              {...bindPopover(popupState)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{ style: { borderRadius: '10px' } }}
              disableRestoreFocus
              keepMounted
            >
              <Swap provider={provider} tokenList={tokenList} />
            </Popover>
          </div>
        )}
      </PopupState>
    )
  );
}

class NotifyingProvider extends Provider {
  constructor(
    connection: Connection,
    wallet: Wallet,
    sendTransaction: (Promise<TransactionSignature>, Function) => void,
  ) {
    super(connection, wallet, {
      commitment: 'recent',
    });
    this.sendTransaction = sendTransaction;
  }

  async send(
    tx: Transaction,
    signers?: Array<Signer | undefined>,
    opts?: ConfirmOptions,
  ): Promise<TransactionSignature> {
    return new Promise((onSuccess, onError) => {
      this.sendTransaction(super.send(tx, signers, opts), {
        onSuccess,
        onError,
      });
    });
  }

  async sendAll(
    txs: Array<{ tx: Transaction, signers: Array<Signer | undefined> }>,
    opts?: ConfirmOptions,
  ): Promise<Array<TransactionSignature>> {
    return new Promise(async (resolve, onError) => {
      let txSigs: Array<TransactionSignature> = [];
      for (const tx of txs) {
        txSigs.push(
          await new Promise((onSuccess) => {
            this.sendTransaction(super.send(tx.tx, tx.signers, opts), {
              onSuccess,
              onError,
            });
          }),
        );
      }
      resolve(txSigs);
    });
  }
}
