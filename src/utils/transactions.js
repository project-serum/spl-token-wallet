import bs58 from 'bs58';
import { Message, SystemInstruction, SystemProgram } from '@solana/web3.js';
import {
  decodeInstruction,
  decodeTokenInstructionData,
  Market,
  MARKETS,
  TokenInstructions,
  SETTLE_FUNDS_BASE_WALLET_INDEX,
  SETTLE_FUNDS_QUOTE_WALLET_INDEX,
  NEW_ORDER_OPEN_ORDERS_INDEX,
  NEW_ORDER_OWNER_INDEX,
} from '@project-serum/serum';
import { TOKEN_PROGRAM_ID } from './tokens/instructions';

const marketCache = {};
let marketCacheConnection = null;
const cacheDuration = 15 * 1000;

export const decodeMessage = async (connection, wallet, message) => {
  // get message object
  const transactionMessage = Message.from(message);
  if (!transactionMessage?.instructions || !transactionMessage?.accountKeys) {
    return;
  }

  // get owned keys (used for security checks)
  const publicKey = wallet.publicKey;

  // get instructions
  const instructions = [];
  for (var i = 0; i < transactionMessage.instructions.length; i++) {
    let transactionInstruction = transactionMessage.instructions[i];
    const instruction = await toInstruction(
      connection,
      publicKey,
      transactionMessage?.accountKeys,
      transactionInstruction,
      i,
    );
    instructions.push({
      ...instruction,
      rawData: transactionInstruction?.data,
    });
  }
  return instructions;
};

const toInstruction = async (
  connection,
  publicKey,
  accountKeys,
  instruction,
  index,
) => {
  if (
    !instruction?.data ||
    !instruction?.accounts ||
    !instruction?.programIdIndex
  ) {
    return;
  }

  // get instruction data
  const decoded = bs58.decode(instruction.data);

  const programId = getAccountByIndex(
    [instruction.programIdIndex],
    accountKeys,
    0,
  );
  if (!programId) {
    return null;
  }

  try {
    if (programId.equals(SystemProgram.programId)) {
      console.log('[' + index + '] Handled as system instruction');
      return handleSystemInstruction(publicKey, instruction, accountKeys);
    } else if (programId.equals(TOKEN_PROGRAM_ID)) {
      console.log('[' + index + '] Handled as token instruction');
      let decodedInstruction = decodeTokenInstruction(decoded);
      return handleTokenInstruction(
        publicKey,
        instruction.accounts,
        decodedInstruction,
        accountKeys,
      );
    } else if (
      MARKETS.some(
        (market) => market.programId && market.programId.equals(programId),
      )
    ) {
      console.log('[' + index + '] Handled as dex instruction');
      let decodedInstruction = decodeInstruction(decoded);
      return await handleDexInstruction(
        connection,
        instruction,
        accountKeys,
        decodedInstruction,
      );
    }
  } catch {}

  // all decodings failed
  console.log('[' + index + '] Failed, data: ' + JSON.stringify(decoded));

  return;
};

const handleDexInstruction = async (
  connection,
  instruction,
  accountKeys,
  decodedInstruction,
) => {
  if (!decodedInstruction || Object.keys(decodedInstruction).length > 1) {
    return;
  }

  const { accounts, programIdIndex } = instruction;

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
  let market, programIdAddress;
  try {
    const marketAddress =
      marketInfo?.address || getAccountByIndex(accounts, accountKeys, 0);
    programIdAddress =
      marketInfo?.programId ||
      getAccountByIndex([programIdIndex], accountKeys, 0);
    const strAddress = marketAddress.toBase58();
    const now = new Date().getTime();
    if (
      !(
        connection === marketCacheConnection &&
        strAddress in marketCache &&
        now - marketCache[strAddress].ts < cacheDuration
      )
    ) {
      marketCacheConnection = connection;
      console.log('Loading market', strAddress);
      marketCache[strAddress] = {
        market: await Market.load(
          connection,
          marketAddress,
          {},
          programIdAddress,
        ),
        ts: now,
      };
    }
    market = marketCache[strAddress].market;
  } catch (e) {
    console.log('Error loading market: ' + e.message);
  }

  // get data
  const type = Object.keys(decodedInstruction)[0];
  let data = decodedInstruction[type];
  if (type === 'settleFunds') {
    const settleFundsData = getSettleFundsData(accounts, accountKeys);
    if (!settleFundsData) {
      return;
    } else {
      data = { ...data, ...settleFundsData };
    }
  } else if (type === 'newOrder') {
    const newOrderData = getNewOrderData(accounts, accountKeys);
    data = { ...data, ...newOrderData };
  }
  return {
    type,
    data,
    market,
    marketInfo,
  };
};

const decodeTokenInstruction = (bufferData) => {
  if (!bufferData) {
    return;
  }

  if (bufferData.length === 1) {
    if (bufferData[0] === 1) {
      return { initializeAccount: {} };
    } else if (bufferData[0] === 9) {
      return { closeAccount: {} };
    }
  } else {
    return decodeTokenInstructionData(bufferData);
  }
};

const handleSystemInstruction = (publicKey, instruction, accountKeys) => {
  const { programIdIndex, accounts, data } = instruction;
  if (!programIdIndex || !accounts || !data) {
    return;
  }

  // construct system instruction
  const systemInstruction = {
    programId: accountKeys[programIdIndex],
    keys: accounts.map((accountIndex) => ({
      pubkey: accountKeys[accountIndex],
    })),
    data: bs58.decode(data),
  };

  // get layout
  let decoded;
  const type = SystemInstruction.decodeInstructionType(systemInstruction);
  switch (type) {
    case 'Create':
      decoded = SystemInstruction.decodeCreateAccount(systemInstruction);
      break;
    case 'CreateWithSeed':
      decoded = SystemInstruction.decodeCreateWithSeed(systemInstruction);
      break;
    case 'Allocate':
      decoded = SystemInstruction.decodeAllocate(systemInstruction);
      break;
    case 'AllocateWithSeed':
      decoded = SystemInstruction.decodeAllocateWithSeed(systemInstruction);
      break;
    case 'Assign':
      decoded = SystemInstruction.decodeAssign(systemInstruction);
      break;
    case 'AssignWithSeed':
      decoded = SystemInstruction.decodeAssignWithSeed(systemInstruction);
      break;
    case 'Transfer':
      decoded = SystemInstruction.decodeTransfer(systemInstruction);
      break;
    case 'AdvanceNonceAccount':
      decoded = SystemInstruction.decodeNonceAdvance(systemInstruction);
      break;
    case 'WithdrawNonceAccount':
      decoded = SystemInstruction.decodeNonceWithdraw(systemInstruction);
      break;
    case 'InitializeNonceAccount':
      decoded = SystemInstruction.decodeNonceInitialize(systemInstruction);
      break;
    case 'AuthorizeNonceAccount':
      decoded = SystemInstruction.decodeNonceAuthorize(systemInstruction);
      break;
    default:
      return;
  }

  if (
    !decoded ||
    (decoded.fromPubkey && !publicKey.equals(decoded.fromPubkey))
  ) {
    return;
  }

  return {
    type: 'system' + type,
    data: decoded,
  };
};

const handleTokenInstruction = (
  publicKey,
  accounts,
  decodedInstruction,
  accountKeys,
) => {
  if (!decodedInstruction || Object.keys(decodedInstruction).length > 1) {
    return;
  }

  // get data
  const type = Object.keys(decodedInstruction)[0];
  let data = decodedInstruction[type];
  if (type === 'initializeAccount') {
    const initializeAccountData = getInitializeAccountData(
      publicKey,
      accounts,
      accountKeys,
    );
    data = { ...data, ...initializeAccountData };
  } else if (type === 'transfer') {
    const transferData = getTransferData(publicKey, accounts, accountKeys);
    data = { ...data, ...transferData };
  } else if (type === 'closeAccount') {
    const closeAccountData = getCloseAccountData(
      publicKey,
      accounts,
      accountKeys,
    );
    data = { ...data, ...closeAccountData };
  }

  return {
    type,
    data,
  };
};

const getNewOrderData = (accounts, accountKeys) => {
  const openOrdersPubkey = getAccountByIndex(
    accounts,
    accountKeys,
    NEW_ORDER_OPEN_ORDERS_INDEX,
  );
  const ownerPubkey = getAccountByIndex(
    accounts,
    accountKeys,
    NEW_ORDER_OWNER_INDEX,
  );
  return { openOrdersPubkey, ownerPubkey };
};

const getSettleFundsData = (accounts, accountKeys) => {
  const basePubkey = getAccountByIndex(
    accounts,
    accountKeys,
    SETTLE_FUNDS_BASE_WALLET_INDEX,
  );

  const quotePubkey = getAccountByIndex(
    accounts,
    accountKeys,
    SETTLE_FUNDS_QUOTE_WALLET_INDEX,
  );

  if (!basePubkey || !quotePubkey) {
    return;
  }

  return { basePubkey, quotePubkey };
};

const getTransferData = (publicKey, accounts, accountKeys) => {
  const sourcePubkey = getAccountByIndex(
    accounts,
    accountKeys,
    TokenInstructions.TRANSFER_SOURCE_INDEX,
  );

  const destinationPubkey = getAccountByIndex(
    accounts,
    accountKeys,
    TokenInstructions.TRANSFER_DESTINATION_INDEX,
  );

  const ownerPubkey = getAccountByIndex(
    accounts,
    accountKeys,
    TokenInstructions.TRANSFER_OWNER_INDEX,
  );

  if (!ownerPubkey || !publicKey.equals(ownerPubkey)) {
    return;
  }

  return { sourcePubkey, destinationPubkey, ownerPubkey };
};

const getInitializeAccountData = (publicKey, accounts, accountKeys) => {
  const accountPubkey = getAccountByIndex(
    accounts,
    accountKeys,
    TokenInstructions.INITIALIZE_ACCOUNT_ACCOUNT_INDEX,
  );

  const mintPubkey = getAccountByIndex(
    accounts,
    accountKeys,
    TokenInstructions.INITIALIZE_ACCOUNT_MINT_INDEX,
  );

  const ownerPubkey = getAccountByIndex(
    accounts,
    accountKeys,
    TokenInstructions.INITIALIZE_ACCOUNT_OWNER_INDEX,
  );

  if (!ownerPubkey || !publicKey.equals(ownerPubkey)) {
    return;
  }

  return { accountPubkey, mintPubkey, ownerPubkey };
};

const getCloseAccountData = (publicKey, accounts, accountKeys) => {
  const sourcePubkey = getAccountByIndex(
    accounts,
    accountKeys,
    TokenInstructions.TRANSFER_SOURCE_INDEX,
  );

  const destinationPubkey = getAccountByIndex(
    accounts,
    accountKeys,
    TokenInstructions.TRANSFER_DESTINATION_INDEX,
  );

  const ownerPubkey = getAccountByIndex(
    accounts,
    accountKeys,
    TokenInstructions.TRANSFER_OWNER_INDEX,
  );

  if (!ownerPubkey || !publicKey.equals(ownerPubkey)) {
    return;
  }

  return { sourcePubkey, destinationPubkey, ownerPubkey };
};

const getAccountByIndex = (accounts, accountKeys, accountIndex) => {
  const index = accounts.length > accountIndex && accounts[accountIndex];
  return accountKeys?.length > index && accountKeys[index];
};
