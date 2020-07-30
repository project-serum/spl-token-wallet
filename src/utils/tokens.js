import { sendAndConfirmTransaction, SystemProgram } from '@solana/web3.js';
import {
  initializeAccount,
  initializeMint,
  TOKEN_PROGRAM_ID,
} from './token-instructions';
import { ACCOUNT_LAYOUT, MINT_LAYOUT } from './token-state';

export async function createAndInitializeMint({
  connection,
  payer, // Account for paying fees
  mint, // Account to hold token information
  amount, // Number of tokens to issue
  decimals,
  initialAccount, // Account to hold newly issued tokens, if amount > 0
  mintOwner, // Optional account, allowed to mint tokens
}) {
  let transaction = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mint.publicKey,
    lamports: await connection.getMinimumBalanceForRentExemption(
      MINT_LAYOUT.span,
    ),
    space: MINT_LAYOUT.span,
    programId: TOKEN_PROGRAM_ID,
  });
  let signers = [payer, mint];
  if (amount) {
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: initialAccount.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(
          ACCOUNT_LAYOUT.span,
        ),
        space: ACCOUNT_LAYOUT.span,
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

export async function createAndInitializeTokenAccount({
  connection,
  payer,
  mintPublicKey,
  newAccount,
}) {
  let transaction = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: newAccount.publicKey,
    lamports: await connection.getMinimumBalanceForRentExemption(
      ACCOUNT_LAYOUT.span,
    ),
    space: ACCOUNT_LAYOUT.span,
    programId: TOKEN_PROGRAM_ID,
  });
  transaction.add(
    initializeAccount({
      account: newAccount.publicKey,
      mint: mintPublicKey,
      owner: payer.publicKey,
    }),
  );
  let signers = [payer, newAccount];
  return await sendAndConfirmTransaction(connection, transaction, signers, {
    confirmations: 1,
  });
}
