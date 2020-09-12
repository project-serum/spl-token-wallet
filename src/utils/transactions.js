import bs58 from 'bs58';
import { Message } from '@solana/web3.js';
import {
  decodeInstruction,
  decodeTokenInstructionData,
  Market,
  MARKETS,
  SETTLE_FUNDS_BASE_WALLET_INDEX,
  SETTLE_FUNDS_QUOTE_WALLET_INDEX,
  OpenOrders,
} from '@project-serum/serum';

export const decodeMessage = async (connection, wallet, message) => {
  const transactionMessage = Message.from(message);
  if (!transactionMessage?.instructions || !transactionMessage?.accountKeys) {
    return;
  }
  const instructions = [];
  for (let transactionInstruction of transactionMessage.instructions) {
    const instruction = await toInstruction(
      connection,
      wallet,
      transactionMessage?.accountKeys,
      transactionInstruction,
    );
    if (!instruction) {
      return;
    }
    instructions.push(instruction);
  }
  return instructions;
};

const toInstruction = async (connection, wallet, accountKeys, instruction) => {
  if (!instruction?.data) {
    return;
  }

  // get instruction data
  const decoded = bs58.decode(instruction?.data);
  let decodedInstruction;

  // try dex instruction decoding
  try {
    decodedInstruction = decodeInstruction(decoded);
    return await handleDexInstruction(
      connection,
      wallet,
      instruction,
      accountKeys,
      decodedInstruction,
    );
  } catch {}

  // try open orders decoding
  try {
    decodedInstruction = OpenOrders.LAYOUT.decode(decoded);
    return handleOpenOrdersInstruction(decodedInstruction);
  } catch {}

  // try token decoding
  try {
    decodedInstruction = decodeTokenInstructionData(decoded);
    return handleTokenInstruction(decodedInstruction);
  } catch {}

  // both decodings failed
  return;
};

const handleDexInstruction = async (
  connection,
  wallet,
  instruction,
  accountKeys,
  decodedInstruction,
) => {
  if (!instruction?.accounts || !decodedInstruction || Object.keys(decodedInstruction).length > 1) {
    return;
  }

  const type = Object.keys(decodedInstruction)[0];
  if (type === 'settleFunds') {
    const valid = await isValidSettleFundsInstruction(
      wallet,
      instruction,
      accountKeys,
    );
    if (!valid) return;
  }

  // get market info
  const marketInfo =
    accountKeys &&
    MARKETS.find(
      (market) =>
        accountKeys.findIndex((accountKey) =>
          accountKey.equals(market.address),
        ) > -1,
    );

  // get market
  let market;
  try {
    market =
      marketInfo &&
      (await Market.load(
        connection,
        marketInfo.address,
        {},
        marketInfo.programId,
      ));
  } catch (e) {
    console.log('Error loading market: ' + e.message);
  }

  return {
    type,
    data: decodedInstruction[type],
    market,
    marketInfo,
    accounts: instruction?.accounts,
    accountKeys,
  };
};

const handleOpenOrdersInstruction = (instruction) => {
  const { accountFlags, market, owner } = instruction;
  if (!accountFlags || !market || !owner) {
    return;
  }

  return {
    type: 'createAccount',
    data: { marketAddress: market, owner },
  };
};

const handleTokenInstruction = (decodedInstruction) => {
  if (!decodedInstruction || Object.keys(decodedInstruction).length > 1) {
    return;
  }

  const type = Object.keys(decodedInstruction)[0];
  return {
    type,
    data: decodedInstruction[type],
  };
};

const isValidSettleFundsInstruction = async (
  wallet,
  instruction,
  accountKeys,
) => {
  const { accounts } = instruction;

  // get base wallet key
  const baseIndex =
    accounts.length > SETTLE_FUNDS_BASE_WALLET_INDEX &&
    accounts[SETTLE_FUNDS_BASE_WALLET_INDEX];
  const baseWalletKey =
    baseIndex && accountKeys?.length > baseIndex && accountKeys[baseIndex];

  // get quote wallet key
  const quoteIndex =
    accounts.length > SETTLE_FUNDS_QUOTE_WALLET_INDEX &&
    accounts[SETTLE_FUNDS_QUOTE_WALLET_INDEX];
  const quoteWalletKey =
    quoteIndex && accountKeys?.length > quoteIndex && accountKeys[quoteIndex];

  if (!baseWalletKey || !quoteWalletKey) {
    return false;
  }

  // check if wallet owns these
  const publicKeys = await wallet.getTokenPublicKeys();
  return (
    publicKeys.some((ownedKey) => baseWalletKey.equals(ownedKey)) &&
    publicKeys.some((ownedKey) => quoteWalletKey.equals(ownedKey))
  );
};
