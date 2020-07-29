import { sendAndConfirmTransaction, SystemProgram } from '@solana/web3.js';
import {
  initializeAccount,
  initializeMint,
  TOKEN_PROGRAM_ID,
} from './token-instructions';

export async function createAndInitializeMint({
  connection,
  payer,
  mint,
  amount,
  decimals,
  initialAccount,
  mintOwner,
}) {
  let transaction = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mint.publicKey,
    lamports: await connection.getMinimumBalanceForRentExemption(40),
    space: 40,
    programId: TOKEN_PROGRAM_ID,
  });
  let signers = [payer, mint];
  if (amount) {
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: initialAccount.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(120),
        space: 120,
        programId: TOKEN_PROGRAM_ID,
      }),
    );
    signers.push(initialAccount);
    transaction.add(
      initializeAccount({
        account: initialAccount.publicKey,
        mint: mint.publicKey,
        owner: payer.publicKey,
      }),
    );
  }
  transaction.add(
    initializeMint({
      mint: mint.publicKey,
      amount,
      decimals,
      initialAccount: initialAccount?.publicKey,
      mintOwner: mintOwner.publicKey,
    }),
  );
  return await sendAndConfirmTransaction(connection, transaction, signers, {
    confirmations: 1,
  });
}
