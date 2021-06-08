import React, { useState, useEffect, useCallback } from 'react';
import BN from 'bn.js';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Chip } from '@material-ui/core';
import {
  Transaction,
  Account,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import { Program, Provider, Idl } from '@project-serum/anchor';
import { Market, OpenOrders } from '@project-serum/serum';
import { balanceAmountToUserAmount } from './SendDialog';
import { useWallet, useWalletAddressForMint } from '../utils/wallet';
import { swapApiRequest } from '../utils/swap/api';
import { getErc20Decimals } from '../utils/swap/eth.js';
import { useSendTransaction } from '../utils/notifications';
import { createAssociatedTokenAccountIx } from '../utils/tokens';
import assert from "assert";
import tuple from "immutable-tuple";

// TODO: Import these constants from somewhere.
const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
);
const DEX_PROGRAM_ID = new PublicKey(
  '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
);
const SWAP_PROGRAM_ID = new PublicKey(
  '22Y43yTVxuUkoRKdm9thyRhQ3SdgQS7c7kB6UNCiaczD',
);
const MARKET_BASE = new PublicKey(
  '6a9wpsZpZGxGhFVSQBpcTNjNjytdbSA1iUw1A5KNDxPw',
);

// Stores current version for any swap market that needs to be relisted at a version number higher than 0
// keys are base58 string representation of mints concatenated with a forward-slash
const SWAP_MARKET_VERSIONS = {}

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
  // * market.accountInfo === null => no pool exists.
  // * market.accountInfo !== null => pool exists.
  const [market, setMarket] = useState(undefined);
  const [wormholeMintAddr, setWormholeMintAddr] = useState(null);
  const [maxAvailableSwapAmount, setMaxAvailableSwapAmount] = useState(0);
  const [transferAmountString, setTransferAmountString] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const wallet = useWallet();
  const [sendTransaction] = useSendTransaction();
  const { amount: balanceAmount, decimals, tokenSymbol } = balanceInfo;
  const parsedAmount = parseFloat(transferAmountString);
  const validAmount = parsedAmount > 0 && parsedAmount <= balanceAmount;
  const ethChainId = 2;
  const wormholeTokenAddr = useWalletAddressForMint(wormholeMintAddr);
  const swapClient = new Program(
    IDL,
    SWAP_PROGRAM_ID,
    new Provider(wallet.connection, wallet),
  );

  // Parses the orderbook to retrieve the max swappable amount available.
  const parseOrderbook = useCallback(
    async (marketClient) => {
      const bids = await marketClient.loadBids(swapClient.provider.connection);
      let size = 0;
      for (let order of bids) {
        if (order.price > 0.9990) {
          size += order.size;
        }
      }
      setMaxAvailableSwapAmount(size);
    },
    [setMaxAvailableSwapAmount, swapClient.provider.connection],
  );

  // Note: there are three "useEffect" closures to be run in order.
  //       Each one triggers the next.

  // 1. Calculate wormhole wrapped token mint address..
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

  // 2. Fetch the wormhole swap market, if it exists.
  useEffect(() => {
    if (wormholeMintAddr !== null) {
      const fetch = async () => {
        const marketAddress = await getSwapMarketAddress(
          balanceInfo.mint,
          wormholeMintAddr,
          SWAP_MARKET_VERSIONS[`${balanceInfo.mint.toString()}/${wormholeMintAddr.toString()}`] || 0
        )
        console.log(marketAddress.toString())
        try {
          const account = await Market.load(
            swapClient.provider.connection,
            marketAddress,
            swapClient.provider.opts,
            DEX_PROGRAM_ID,
          );
          await parseOrderbook(account);
          setMarket({
            account,
            publicKey: marketAddress,
          });
        } catch (err) {
          // Market not found error.
          setMarket({
            publicKey: marketAddress,
            account: null,
          });
        }
      };
      fetch();
    }
  }, [
    swapClient.provider.connection,
    swapClient.provider.opts,
    wormholeMintAddr,
    balanceInfo.mint,
    wallet.connection,
    parseOrderbook,
  ]);

  // 3. Tell the bridge to create the swap market, if no
  //    sollet <-> wormhole market exists.
  useEffect(() => {
    if (
      market &&
      market.account === null &&
      market.publicKey &&
      wormholeMintAddr &&
      balanceAmount > 0
    ) {
      const url = `wormhole/pool/${
        swapCoinInfo.ticker
      }/${market.publicKey.toString()}/${balanceInfo.mint.toString()}/${wormholeMintAddr.toString()}`;
      swapApiRequest('POST', url).catch(console.error);
    }
  }, [
    market,
    wormholeMintAddr,
    balanceAmount,
    balanceInfo.mint,
    swapCoinInfo.ticker,
  ]);

  // Converts the sollet wrapped token into the wormhole wrapped token
  // by trading on swap market.
  async function convert() {
    const swapAmount = new BN(parsedAmount * 10 ** balanceInfo.decimals);
    // 1 for 1 swap, subtracting out taker fee.
    const minExpectedAmount = swapAmount.mul(new BN(9968)).div(new BN(10000));

    const [vaultSigner] = await getVaultOwnerAndNonce(
      market.account._decoded.ownAddress,
    );
    let [openOrders, needsCreateOpenOrders] = await (async () => {
      let openOrders = await OpenOrders.findForOwner(
        swapClient.provider.connection,
        wallet.publicKey,
        DEX_PROGRAM_ID,
      );

      // If we have an open orderes account use it. It doesn't matter which
      // one we use.
      const addr = openOrders[0] ? openOrders[0].address : undefined;
      return [addr, addr === undefined];
    })();
    let signers = [];

    // Build the transaction.
    const tx = new Transaction();

    // Create the wormhole associated token account, if needed.
    let _wormholeTokenAddr = wormholeTokenAddr;
    if (!_wormholeTokenAddr) {
      const [ix, addr] = await createAssociatedTokenAccountIx(
        wallet.publicKey,
        wallet.publicKey,
        wormholeMintAddr,
      );
      tx.add(ix);
      _wormholeTokenAddr = addr;
    } else {
      _wormholeTokenAddr = new PublicKey(_wormholeTokenAddr.toString());
    }

    // Create the open orders account, if needed.
    if (needsCreateOpenOrders) {
      const _openOrders = new Account();
      openOrders = _openOrders.publicKey;
      signers.push(_openOrders);
      tx.add(
        await OpenOrders.makeCreateAccountTransaction(
          swapClient.provider.connection,
          market.account._decoded.ownAddress,
          swapClient.provider.wallet.publicKey,
          openOrders,
          DEX_PROGRAM_ID,
        ),
      );
    }
    // Execute the swap.
    tx.add(
      swapClient.instruction.swap(Side.Ask, swapAmount, minExpectedAmount, {
        accounts: {
          market: {
            market: market.account._decoded.ownAddress,
            requestQueue: market.account._decoded.requestQueue,
            eventQueue: market.account._decoded.eventQueue,
            bids: market.account._decoded.bids,
            asks: market.account._decoded.asks,
            coinVault: market.account._decoded.baseVault,
            pcVault: market.account._decoded.quoteVault,
            vaultSigner,
            openOrders,
            orderPayerTokenAccount: publicKey,
            coinWallet: publicKey,
          },
          pcWallet: _wormholeTokenAddr,
          authority: swapClient.provider.wallet.publicKey,
          dexProgram: DEX_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        },
      }),
    );

    // Close the open orders account, if needed.
    if (needsCreateOpenOrders) {
      // TODO: enable once the dex supports this.
      /*
      tx.add(
        DexInstructions.closeOpenOrders({
          openOrders,
          owner: swapClient.provider.wallet.publicKey,
          destination: swapClient.provider.wallet.publicKey,
					market: market.account._decoded.ownAddress,
          programId: DEX_PROGRAM_ID,
        }),
      );
					*/
    }

    // Send the transaction to the blockchain.
    return await swapClient.provider.send(tx, signers, {
      preflightCommitment: false,
      commitment: 'recent',
    });
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
        {market === undefined || isLoading ? (
          <CircularProgress
            style={{
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
        ) : market.account === null ? (
          <DialogContentText>
            {`Wormhole conversion is not yet setup for this token. Please try later.`}
          </DialogContentText>
        ) : (
          <>
            <DialogContentText>
              {`Convert your tokens into wormhole-wrapped tokens using the Serum order book.
              Assets will be converted one-to-one minus standard DEX fees for exchange.`}
              <br />
              <br />
              {`Swap Market: `}
              <a
                href={`https://solanabeach.io/address/${market.publicKey}`}
                target="_blank"
                rel="noreferrer"
              >
                <Chip label={market.publicKey.toString()} />
              </a>
              <br />
              {`Estimated max swap amount: ${maxAvailableSwapAmount.toFixed(
                4,
              )}`}
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
                          Math.min(
                            balanceAmountToUserAmount(balanceAmount, decimals),
                            maxAvailableSwapAmount,
                          ),
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
              value={Math.min(
                parseFloat(transferAmountString),
                maxAvailableSwapAmount,
                balanceAmountToUserAmount(balanceAmount, decimals),
              )}
              onChange={(e) => setTransferAmountString(e.target.value.trim())}
              helperText={
                <span
                  onClick={() =>
                    setTransferAmountString(
                      Math.min(
                        balanceAmountToUserAmount(balanceAmount, decimals),
                        maxAvailableSwapAmount,
                      ),
                    )
                  }
                >
                  Max:{' '}
                  {Math.min(
                    balanceAmountToUserAmount(balanceAmount, decimals),
                    maxAvailableSwapAmount,
                  )}
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

async function getSwapMarketAddress(
  coinMint: PublicKey,
  priceCurrencyMint: PublicKey,
  version = 0
): Promise<PublicKey | null> {
  if (version > 99) {
    console.log("Swap market version cannot be greater than 99");
    return null;
  }
  if (version < 0) {
    console.log("Version cannot be less than zero");
    return null;
  }
  const padToTwo = number => number <= 99 ? `0${number}`.slice(-2) : number;
  const seed =
    coinMint.toString().slice(0, 15) +
    priceCurrencyMint.toString().slice(0, 15) +
    padToTwo(version);
  return await PublicKey.createWithSeed(
    MARKET_BASE,
    seed,
    DEX_PROGRAM_ID,
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

// Side rust enum used for the program's RPC API.
const Side = {
  Bid: { bid: {} },
  Ask: { ask: {} },
};

// Calculates the dex's (non standard) vault signer and nonce.
async function getVaultOwnerAndNonce(
  marketPublicKey,
  dexProgramId = DEX_PROGRAM_ID,
) {
  const nonce = new BN(0);
  while (nonce.toNumber() < 255) {
    try {
      const vaultOwner = await PublicKey.createProgramAddress(
        [marketPublicKey.toBuffer(), nonce.toArrayLike(Buffer, 'le', 8)],
        dexProgramId,
      );
      return [vaultOwner, nonce];
    } catch (e) {
      nonce.iaddn(1);
    }
  }
  throw new Error('Unable to find nonce');
}

// Swap program IDL.
const IDL: Idl = {
  version: '0.0.0',
  name: 'swap',
  instructions: [
    {
      name: 'swap',
      accounts: [
        {
          name: 'market',
          accounts: [
            {
              name: 'market',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'openOrders',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'requestQueue',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'eventQueue',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'bids',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'asks',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'orderPayerTokenAccount',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'coinVault',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'pcVault',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'vaultSigner',
              isMut: false,
              isSigner: false,
            },
            {
              name: 'coinWallet',
              isMut: true,
              isSigner: false,
            },
          ],
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'pcWallet',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'dexProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'side',
          type: {
            defined: 'Side',
          },
        },
        {
          name: 'amount',
          type: 'u64',
        },
        {
          name: 'minExpectedSwapAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'swapTransitive',
      accounts: [
        {
          name: 'from',
          accounts: [
            {
              name: 'market',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'openOrders',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'requestQueue',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'eventQueue',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'bids',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'asks',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'orderPayerTokenAccount',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'coinVault',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'pcVault',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'vaultSigner',
              isMut: false,
              isSigner: false,
            },
            {
              name: 'coinWallet',
              isMut: true,
              isSigner: false,
            },
          ],
        },
        {
          name: 'to',
          accounts: [
            {
              name: 'market',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'openOrders',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'requestQueue',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'eventQueue',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'bids',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'asks',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'orderPayerTokenAccount',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'coinVault',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'pcVault',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'vaultSigner',
              isMut: false,
              isSigner: false,
            },
            {
              name: 'coinWallet',
              isMut: true,
              isSigner: false,
            },
          ],
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'pcWallet',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'dexProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'amount',
          type: 'u64',
        },
        {
          name: 'minExpectedSwapAmount',
          type: 'u64',
        },
      ],
    },
  ],
  types: [
    {
      name: 'Side',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Bid',
          },
          {
            name: 'Ask',
          },
        ],
      },
    },
  ],
  events: [
    {
      name: 'DidSwap',
      fields: [
        {
          name: 'given_amount',
          type: 'u64',
          index: false,
        },
        {
          name: 'min_expected_swap_amount',
          type: 'u64',
          index: false,
        },
        {
          name: 'from_amount',
          type: 'u64',
          index: false,
        },
        {
          name: 'to_amount',
          type: 'u64',
          index: false,
        },
        {
          name: 'spill_amount',
          type: 'u64',
          index: false,
        },
        {
          name: 'from_mint',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'to_mint',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'quote_mint',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 100,
      name: 'SwapTokensCannotMatch',
      msg: 'The tokens being swapped must have different mints',
    },
    {
      code: 101,
      name: 'SlippageExceeded',
      msg: 'Slippage tolerance exceeded',
    },
  ],
};
