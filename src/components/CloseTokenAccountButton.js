import React from 'react';
import { Modal } from 'antd';
import { abbreviateAddress } from '../utils/utils';
import { useSendTransaction } from '../utils/notifications';
import { refreshWalletPublicKeys, useWallet } from '../utils/wallet';
import { Text } from './layout/StyledComponents';

export default function CloseTokenAccountDialog({
  open,
  onClose,
  publicKey,
  balanceInfo,
}) {
  const wallet = useWallet();
  const [sendTransaction, sending] = useSendTransaction();
  const { mint, tokenName } = balanceInfo;

  function onSubmit() {
    sendTransaction(wallet.closeTokenAccount(publicKey), {
      onSuccess: () => {
        refreshWalletPublicKeys(wallet);
        onClose();
      },
    });
  }

  return (
    <Modal
      title={
        <span>
          Delete {tokenName ?? mint.toBase58()} Address{' '}
          {abbreviateAddress(publicKey)}
        </span>
      }
      visible={open}
      onCancel={onClose}
      onOk={onSubmit}
      okText="Delete"
      okButtonProps={{ disabled: sending, danger: true }}
    >
      <Text>
        Are you sure you want to delete your {tokenName ?? mint.toBase58()}{' '}
        address {publicKey.toBase58()}? This will permanently disable token
        transfers to this address and remove it from your wallet.
      </Text>
    </Modal>
  );
}
