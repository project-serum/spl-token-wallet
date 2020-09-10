import bs58 from 'bs58';
import { Message } from '@solana/web3.js';
import { decodeInstruction, Market, MARKETS } from '@project-serum/serum';

export const decodeMessage = async (connection, message) => {
  const transactionMessage = Message.from(message);
  const instructions = [];
  if (!transactionMessage?.instructions || !transactionMessage?.accountKeys) {
    return instructions;
  }
  for (let instruction of transactionMessage.instructions) {
    if (!instruction?.data || !instruction?.accounts) {
      continue;
    }
    // get market address
    const marketAccountIndex = instruction.accounts[0];
    const marketAddress =
      transactionMessage.accountKeys.length > marketAccountIndex &&
      transactionMessage.accountKeys[marketAccountIndex];
    if (!marketAddress) {
      continue;
    }

    // get market
    const marketInfo = MARKETS.find((market) =>
      market.address.equals(marketAddress),
    );
    if (!marketInfo) {
      continue;
    }
    const market = await Market.load(
      connection,
      marketInfo.address,
      {},
      marketInfo.programId,
    );

    // get instruction data
    const decoded = bs58.decode(instruction.data);
    const decodedInstruction = decodeInstruction(decoded);
    const type = decodedInstruction && Object.keys(decodedInstruction)[0];

    instructions.push({ type, data: decodedInstruction[type], market, marketName: marketInfo.name });
  }
  return instructions;
};
