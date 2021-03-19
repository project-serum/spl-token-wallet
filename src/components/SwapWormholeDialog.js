import React, { useState, useEffect } from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import { PublicKey } from '@solana/web3.js';
import { Pool } from '@project-serum/swap';
import { balanceAmountToUserAmount } from './SendDialog';
import { useWallet, useWalletAddressForMint } from '../utils/wallet';
import { swapApiRequest } from '../utils/swap/api';
import { getErc20Decimals } from '../utils/swap/eth.js';
import { useSendTransaction } from '../utils/notifications';
import { signAndSendTransaction } from '../utils/tokens';

const SWAP_PROGRAM_ID = new PublicKey(
  'SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8',
);
const POOL_BASE = new PublicKey(
  'CAXLccDUeS6egtNNEBLrxAqxSvuL6SwspqYX14JdKaiK',
);

export default function SwapWormholeDialog({
  publicKey,
  onClose,
  balanceInfo,
  swapCoinInfo,
  onSubmitRef,
}) {
  // Possible values:
  //
  // * undefined => loading.
  // * pool.accountInfo === null => no pool exists.
  // * pool.accountInfo !== null => pool exists.
  const [pool, setPool] = useState(undefined);
  const [wormholeMintAddr, setWormholeMintAddr] = useState(null);
  const [transferAmountString, setTransferAmountString] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const wallet = useWallet();
  const [sendTransaction] = useSendTransaction();
  const { amount: balanceAmount, decimals, tokenSymbol } = balanceInfo;
  const parsedAmount = parseFloat(transferAmountString);
  const validAmount = parsedAmount > 0 && parsedAmount <= balanceAmount;
  const ethChainId = 2;
  const wormholeTokenAddr = useWalletAddressForMint(wormholeMintAddr);

  // Note: there are three "useEffect" closures to be run in order.
  //       Each one triggers the next.

  // 1. Calculate wormhole wrapped token mint address *and*
  //    url to initialize the AMM pool.
  useEffect(() => {
    if (wormholeMintAddr === null) {
      const fetch = async () => {
        let erc20Contract;
        let decimals;
        let _wormholeMintAddr;
        if (swapCoinInfo.ticker === 'ETH') {
          erc20Contract = 'eth';
          decimals = -1;
          _wormholeMintAddr = new PublicKey(
            'FeGn77dhg1KXRRFeSwwMiykZnZPw5JXW6naf2aQgZDQf',
          );
        } else if (swapCoinInfo.ticker === 'BTC') {
          erc20Contract = 'btc';
          decimals = -1;
          _wormholeMintAddr = new PublicKey(
            'qfnqNqs3nCAHjnyCgLRDbBtq4p2MtHZxw8YjSyYhPoL',
          );
        } else {
          erc20Contract = swapCoinInfo.erc20Contract;
          decimals = await getErc20Decimals(erc20Contract);
          _wormholeMintAddr = await wormholeMintAddress(
            ethChainId,
            Math.min(decimals, 9),
            Buffer.from(erc20Contract.slice(2), 'hex'),
          );
        }
        setWormholeMintAddr(_wormholeMintAddr);
      };
      fetch();
    }
  }, [
    ethChainId,
    swapCoinInfo.erc20Contract,
    swapCoinInfo.ticker,
    wormholeMintAddr,
  ]);

  // 2. Fetch the wormhole pool, if it exists.
  useEffect(() => {
    if (wormholeMintAddr !== null) {
      const fetch = async () => {
        const seed =
          balanceInfo.mint.toString().slice(0, 16) +
          wormholeMintAddr.toString().slice(0, 16);
        const publicKey = await PublicKey.createWithSeed(
          POOL_BASE,
          seed,
          SWAP_PROGRAM_ID,
        );
        const accountInfo = await wallet.connection.getAccountInfo(publicKey);
        setPool({
          publicKey,
          accountInfo,
        });
      };
      fetch();
    }
  }, [wormholeMintAddr, balanceInfo.mint, wallet.connection]);

  // 3. Tell the bridge to create the AMM pool, if no
  //    sollet <-> wormhole pool exists.
  useEffect(() => {
    if (
      pool &&
      pool.accountInfo === null &&
      pool.publicKey &&
      wormholeMintAddr &&
      balanceAmount > 0
    ) {
      const url = `wormhole/pool/${
        swapCoinInfo.ticker
      }/${pool.publicKey.toString()}/${balanceInfo.mint.toString()}/${wormholeMintAddr.toString()}`;
      swapApiRequest('POST', url).catch(console.error);
    }
  }, [
    pool,
    wormholeMintAddr,
    balanceAmount,
    balanceInfo.mint,
    swapCoinInfo.ticker,
  ]);

  // Converts the sollet wrapped token into the wormhole wrapped token
  // by trading on the constant price pool.
  async function convert() {
    // User does not have a wormhole account. Make it.
    let _wormholeTokenAddr = wormholeTokenAddr;
    if (!_wormholeTokenAddr) {
      const createWormholeAccount = async () => {
        const [addr, txSig] = await wallet.createAssociatedTokenAccount(
          wormholeMintAddr,
        );
        _wormholeTokenAddr = addr;
        return txSig;
      };

      let err = await new Promise((resolve) => {
        sendTransaction(createWormholeAccount(), {
          onSuccess: () => resolve(false),
          onError: () => resolve(true),
        });
      });
      if (err) {
        return;
      }
    }
    // Swapping from: sollet.
    const tokenIn = {
      mint: balanceInfo.mint,
      tokenAccount: publicKey,
      amount: parsedAmount,
    };
    // Swapping to: wormhole.
    const tokenOut = {
      mint: wormholeMintAddr,
      tokenAccount: _wormholeTokenAddr,
      amount: parsedAmount,
    };

    // Misc swap params.
    const owner = wallet.publicKey;
    const slippage = 0.5;
    const hostFeeAccount = undefined;
    const skipPreflight = true;

    // Constant price AMM client.
    const poolClient = await Pool.load(
      wallet.connection,
      pool.publicKey,
      SWAP_PROGRAM_ID,
    );
    // Execute swap.
    const { transaction, signers } = await poolClient.makeSwapTransaction(
      wallet.connection,
      owner,
      tokenIn,
      tokenOut,
      slippage,
      hostFeeAccount,
    );
    const txSig = await signAndSendTransaction(
      wallet.connection,
      transaction,
      wallet,
      signers,
      skipPreflight,
    );
    console.log('Transaction: ', txSig);
    return txSig;
  }
  async function onSubmit() {
    setIsLoading(true);
    await new Promise((resolve) => {
      sendTransaction(convert(), {
        onSuccess: () => resolve(),
        onError: () => resolve(),
      });
    });
    setIsLoading(false);
  }
  onSubmitRef.current = onSubmit;

  return (
    <>
      <DialogContent style={{ paddingTop: 16 }}>
        {pool === undefined || isLoading ? (
          <CircularProgress
            style={{
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
        ) : pool.accountInfo === null ? (
          <DialogContentText>
            {`Wormhole conversion is not yet setup for this token. Please try later.`}
          </DialogContentText>
        ) : (
          <>
            <DialogContentText>
              {`Convert your tokens into wormhole-wrapped tokens.`}
            </DialogContentText>
            <TextField
              label="Amount"
              fullWidth
              variant="outlined"
              margin="normal"
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={() =>
                        setTransferAmountString(
                          balanceAmountToUserAmount(balanceAmount, decimals),
                        )
                      }
                    >
                      MAX
                    </Button>
                    {tokenSymbol ? tokenSymbol : null}
                  </InputAdornment>
                ),
                inputProps: {
                  step: Math.pow(10, -decimals),
                },
              }}
              value={transferAmountString}
              onChange={(e) => setTransferAmountString(e.target.value.trim())}
              helperText={
                <span
                  onClick={() =>
                    setTransferAmountString(
                      balanceAmountToUserAmount(balanceAmount, decimals),
                    )
                  }
                >
                  Max: {balanceAmountToUserAmount(balanceAmount, decimals)}
                </span>
              }
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={!validAmount} type="submit" color="primary">
          Convert
        </Button>
      </DialogActions>
    </>
  );
}

// Currently, only used for calculating the Solana wrapped token mint address.
// I.e. assetChain is always === 2 and assetAddress always is the ethereum
// contract address.
async function wormholeMintAddress(
  assetChain: number,
  assetDecimals: number,
  assetAddress: Buffer,
): PublicKey {
  const bridgeId = new PublicKey('WormT3McKhFJ2RkiGpdw9GKvNCrB2aB54gb2uV9MfQC');
  const bridgeAuthority = await getBridgeAuthority(bridgeId);
  const seeds = [
    Buffer.from('wrapped'),
    bridgeAuthority.toBuffer(),
    Buffer.of(assetChain),
    Buffer.of(assetDecimals),
    padBuffer(assetAddress, 32),
  ];

  const [mint] = await PublicKey.findProgramAddress(seeds, bridgeId);

  return mint;
}

async function getBridgeAuthority(bridgeId: PublicKey): PublicKey {
  const [ba] = await PublicKey.findProgramAddress(
    [Buffer.from('bridge')],
    bridgeId,
  );
  return ba;
}

export function padBuffer(b: Buffer, len: number): Buffer {
  const zeroPad = Buffer.alloc(len);
  b.copy(zeroPad, len - b.length);
  return zeroPad;
}
