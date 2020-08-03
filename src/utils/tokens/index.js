import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import {
  initializeAccount,
  initializeMint,
  TOKEN_PROGRAM_ID,
  transfer,
} from './instructions';
import { ACCOUNT_LAYOUT, getOwnedAccountsFilters, MINT_LAYOUT } from './data';
import bs58 from 'bs58';

export async function getOwnedTokenAccounts(connection, publicKey) {
  let filters = getOwnedAccountsFilters(publicKey);
  let resp = await connection._rpcRequest('getProgramAccounts', [
    TOKEN_PROGRAM_ID.toBase58(),
    {
      commitment: connection.commitment,
      filters,
    },
  ]);
  if (resp.error) {
    throw new Error(
      'failed to get token accounts owned by ' +
        publicKey.toBase58() +
        ': ' +
        resp.error.message,
    );
  }
  return resp.result
    .map(({ pubkey, account: { data, executable, owner, lamports } }) => ({
      publicKey: new PublicKey(pubkey),
      accountInfo: {
        data: bs58.decode(data),
        executable,
        owner: new PublicKey(owner),
        lamports,
      },
    }))
    .filter(({ accountInfo }) => {
      // TODO: remove this check once mainnet is updated
      return filters.every((filter) => {
        if (filter.dataSize) {
          return accountInfo.data.length === filter.dataSize;
        } else if (filter.memcmp) {
          let filterBytes = bs58.decode(filter.memcmp.bytes);
          return accountInfo.data
            .slice(
              filter.memcmp.offset,
              filter.memcmp.offset + filterBytes.length,
            )
            .equals(filterBytes);
        }
        return false;
      });
    });
}

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
  return await connection.sendTransaction(transaction, signers);
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
  return await connection.sendTransaction(transaction, signers);
}

export async function transferTokens({
  connection,
  owner,
  sourcePublicKey,
  destinationPublicKey,
  amount,
}) {
  let transaction = new Transaction().add(
    transfer({
      source: sourcePublicKey,
      destination: destinationPublicKey,
      owner: owner.publicKey,
      amount,
    }),
  );
  let signers = [owner];
  return await connection.sendTransaction(transaction, signers);
}
