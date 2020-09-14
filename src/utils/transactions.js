import bs58 from 'bs58';
import { Message, SystemInstruction } from '@solana/web3.js';
import {
  decodeInstruction,
  decodeTokenInstructionData,
  Market,
  MARKETS,
  TokenInstructions,
  SETTLE_FUNDS_BASE_WALLET_INDEX,
  SETTLE_FUNDS_QUOTE_WALLET_INDEX,
} from '@project-serum/serum';

export const decodeMessage = async (connection, wallet, message) => {
  // get message object
  const transactionMessage = Message.from(message);
  if (!transactionMessage?.instructions || !transactionMessage?.accountKeys) {
    return;
  }

  // get owned keys (used for security checks)
  const publicKey = wallet.publicKey;
  const ownedKeys = await wallet.getTokenPublicKeys();

  // get instructions
  const instructions = [];
  for (var i = 0; i < transactionMessage.instructions.length; i++) {
    let transactionInstruction = transactionMessage.instructions[i];
    const instruction = await toInstruction(
      connection,
      publicKey,
      ownedKeys,
      transactionMessage?.accountKeys,
      transactionInstruction,
      i,
    );
    instructions.push(instruction ? instruction : { type: 'invalid' });
  }
  return instructions;
};

const toInstruction = async (
  connection,
  publicKey,
  ownedKeys,
  accountKeys,
  instruction,
  index,
) => {
  if (!instruction?.data) {
    return;
  }

  // get instruction data
  const decoded = bs58.decode(instruction.data);
  let decodedInstruction;

  // try dex instruction decoding
  try {
    decodedInstruction = decodeInstruction(decoded);
    console.log('[' + index + '] Handled as dex instruction');
    return await handleDexInstruction(
      connection,
      ownedKeys,
      instruction,
      accountKeys,
      decodedInstruction,
    );
  } catch {}

  // try token decoding
  try {
    decodedInstruction = decodeTokenInstruction(decoded);
    console.log('[' + index + '] Handled as token instruction');
    return handleTokenInstruction(
      publicKey,
      instruction,
      decodedInstruction,
      accountKeys,
    );
  } catch {}

  // try system instruction decoding
  try {
    const systemInstruction = handleSystemInstruction(
      publicKey,
      instruction,
      accountKeys,
    );
    console.log('[' + index + '] Handled as system instruction');
    return systemInstruction;
  } catch {}

  // all decodings failed
  console.log('[' + index + '] Failed, data: ' + JSON.stringify(decoded));
  return;
};

const handleDexInstruction = async (
  connection,
  ownedKeys,
  instruction,
  accountKeys,
  decodedInstruction,
) => {
  if (
    !instruction?.accounts ||
    !decodedInstruction ||
    Object.keys(decodedInstruction).length > 1
  ) {
    return;
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

  // get data
  const type = Object.keys(decodedInstruction)[0];
  let data = decodedInstruction[type];
  if (type === 'settleFunds') {
    const settleFundsData = getSettleFundsData(
      ownedKeys,
      instruction.accounts,
      accountKeys,
    );
    if (!settleFundsData) {
      return;
    } else {
      data = { ...data, ...settleFundsData };
    }
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
    type: type.charAt(0).toLowerCase() + type.slice(1),
    data: decoded,
  };
};

const handleTokenInstruction = (
  publicKey,
  instruction,
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
      instruction.accounts,
      accountKeys,
    );
    data = { ...data, ...initializeAccountData };
  } else if (type === 'transfer') {
    const transferData = getTransferData(
      publicKey,
      instruction.accounts,
      accountKeys,
    );
    data = { ...data, ...transferData };
  } else if (type === 'closeAccount') {
    const closeAccountData = getCloseAccountData(
      publicKey,
      instruction.accounts,
      accountKeys,
    );
    data = { ...data, ...closeAccountData };
  }

  return {
    type,
    data,
  };
};

const getSettleFundsData = (ownedKeys, accounts, accountKeys) => {
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
    return false;
  }

  if (!isOwner(ownedKeys, basePubkey) || !isOwner(ownedKeys, quotePubkey)) {
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

const isOwner = (ownedKeys, key) => {
  return ownedKeys.some((ownedKey) => key.equals(ownedKey));
};

const getAccountByIndex = (accounts, accountKeys, accountIndex) => {
  const index = accounts.length > accountIndex && accounts[accountIndex];
  return accountKeys?.length > index && accountKeys[index];
};
