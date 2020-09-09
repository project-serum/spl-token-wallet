import bs58 from 'bs58';
import { Message, PublicKey } from '@solana/web3.js';
import { decodeInstruction, Market } from '@project-serum/serum';

const DEX_PROGRAM_ID = '4ckmDgGdxQoPDLUkDT3vHgSAkzA3QRdNq5ywwY4sUSJn';

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
    // get market
    const marketAccountIndex = instruction.accounts[0];
    const marketAddress = transactionMessage.accountKeys.length > marketAccountIndex && transactionMessage.accountKeys[marketAccountIndex];
    if (!marketAddress) {
      continue;
    }
    const market = await Market.load(
      connection,
      marketAddress,
      {},
      new PublicKey(DEX_PROGRAM_ID),
    );

    // get instruction data
    const decoded = bs58.decode(instruction.data);
    const decodedInstruction = decodeInstruction(decoded);
    const type = decodedInstruction && Object.keys(decodedInstruction)[0];

    instructions.push({ type, data: decodedInstruction[type], market });
  }
  return instructions;
};
