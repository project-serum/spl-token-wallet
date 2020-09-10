import bs58 from 'bs58';
import { Message } from '@solana/web3.js';
import { decodeInstruction, Market, MARKETS } from '@project-serum/serum';

export const decodeMessage = async (connection, message) => {
  const transactionMessage = Message.from(message);
  if (!transactionMessage?.instructions || !transactionMessage?.accountKeys) {
    return;
  }
  const instructions = [];
  for (let transactionInstruction of transactionMessage.instructions) {
    const instruction = await toInstruction(
      connection,
      transactionMessage?.accountKeys,
      transactionInstruction,
    );
    instructions.push(instruction || { type: 'invalid' });
  }
  return instructions;
};

const toInstruction = async (connection, accountKeys, instruction) => {
  const { data, accounts } = instruction;
  if (!data || !accounts) {
    return;
  }

  // get instruction data
  const decoded = bs58.decode(data);
  const decodedInstruction = decodeInstruction(decoded);
  const type = decodedInstruction && Object.keys(decodedInstruction)[0];

  // get market address
  const marketAccountIndex = accounts && accounts.length > 0 && accounts[0];
  const marketAddress =
    accountKeys &&
    accountKeys.length > marketAccountIndex &&
    accountKeys[marketAccountIndex];

  // get market
  const marketInfo =
    marketAddress &&
    MARKETS.find((market) => market.address.equals(marketAddress));
  const market =
    marketInfo &&
    (await Market.load(
      connection,
      marketInfo.address,
      {},
      marketInfo.programId,
    ));

  return {
    type,
    data: decodedInstruction[type],
    market,
    marketName: marketInfo?.name,
    marketAddress,
  };
};
