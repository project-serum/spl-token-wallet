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
  };
};
