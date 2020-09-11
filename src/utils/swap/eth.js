import { useEffect, useState } from 'react';
import Web3 from 'web3';
import ERC20_ABI from './erc20-abi.json';
import SWAP_ABI from './swap-abi.json';

const web3 = new Web3(window.ethereum);

export function useEthAccount() {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }
    const onChange = (accounts) =>
      setAccount(accounts.length > 0 ? accounts[0] : null);
    window.ethereum.request({ method: 'eth_accounts' }).then(onChange);
    window.ethereum.on('accountsChanged', onChange);
    return () => window.ethereum.removeListener('accountsChanged', onChange);
  }, []);

  return account;
}

export async function getErc20Balance(account, erc20Address) {
  if (!erc20Address) {
    return parseInt(await web3.eth.getBalance(account)) / 1e18;
  }

  const erc20 = new web3.eth.Contract(ERC20_ABI, erc20Address);
  const [value, decimals] = await Promise.all([
    erc20.methods.balanceOf(account).call(),
    erc20.methods.decimals().call(),
  ]);
  return parseInt(value, 10) / 10 ** parseInt(decimals, 10);
}

export async function swapErc20ToSpl({
  ethAccount,
  erc20Address,
  swapAddress,
  destination,
  amount,
  onStatusChange,
}) {
  if (!erc20Address) {
    return swapEthToSpl({
      ethAccount,
      swapAddress,
      destination,
      amount,
      onStatusChange,
    });
  }

  const erc20 = new web3.eth.Contract(ERC20_ABI, erc20Address);
  const swap = new web3.eth.Contract(SWAP_ABI, swapAddress);
  const decimals = parseInt(await erc20.methods.decimals().call(), 10);

  const approveTx = erc20.methods
    .approve(swapAddress, Math.floor(amount * 10 ** decimals))
    .send({ from: ethAccount });
  await waitForTxid(approveTx);

  onStatusChange({ step: 1 });

  const swapTx = swap.methods
    .swapErc20(erc20Address, destination, Math.floor(amount * 10 ** decimals))
    .send({ from: ethAccount, gasLimit: 100000 });
  const swapTxid = await waitForTxid(swapTx);

  onStatusChange({ step: 2, txid: swapTxid, confirms: 0 });

  await Promise.all([
    approveTx,
    swapTx,
    waitForConfirms(swapTx, onStatusChange),
  ]);

  onStatusChange({ step: 3 });
}

export async function swapEthToSpl({
  ethAccount,
  swapAddress,
  destination,
  amount,
  onStatusChange,
}) {
  const swap = new web3.eth.Contract(SWAP_ABI, swapAddress);

  const swapTx = swap.methods
    .swapEth(destination)
    .send({ from: ethAccount, value: Math.floor(amount * 1e18) });
  const swapTxid = await waitForTxid(swapTx);

  onStatusChange({ step: 2, txid: swapTxid, confirms: 0 });

  await Promise.all([swapTx, waitForConfirms(swapTx, onStatusChange)]);

  onStatusChange({ step: 3 });
}

function waitForTxid(tx) {
  return new Promise((resolve, reject) => {
    tx.once('transactionHash', resolve).catch(reject);
  });
}

function waitForConfirms(tx, onStatusChange) {
  return new Promise((resolve, reject) => {
    let resolved = false;
    tx.on('confirmation', (confirms, receipt) => {
      if (!resolved) {
        onStatusChange({ confirms: confirms + 1 });
        if (!receipt.status) {
          reject('Transaction failed');
          resolved = true;
        } else if (confirms >= 11) {
          resolve();
          resolved = true;
        }
      }
    });
  });
}
