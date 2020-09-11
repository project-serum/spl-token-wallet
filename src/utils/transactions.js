import bs58 from 'bs58';
import { Message } from '@solana/web3.js';
import {
  decodeInstruction,
  Market,
  MARKETS,
  SETTLE_FUNDS_BASE_WALLET_INDEX,
  SETTLE_FUNDS_QUOTE_WALLET_INDEX,
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
  const { data, accounts } = instruction;
  if (!data || !accounts) {
    return;
  }

  // get instruction data
  const decoded = bs58.decode(data);
  const decodedInstruction = decodeInstruction(decoded);
  if (Object.keys(decodedInstruction).length > 1) {
    return;
  }
  const type = decodedInstruction && Object.keys(decodedInstruction)[0];
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
    accounts,
    accountKeys,
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
