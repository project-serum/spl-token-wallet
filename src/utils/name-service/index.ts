import { PublicKey, Connection } from '@solana/web3.js';
import {
  getTwitterRegistry,
  getHashedName,
  getNameAccountKey,
  NameRegistryState,
} from '@bonfida/spl-name-service';

// Address of the SOL TLD
export const SOL_TLD_AUTHORITY = new PublicKey(
  '58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx',
);

export const resolveTwitterHandle = async (
  connection: Connection,
  twitterHandle: string,
): Promise<string | undefined> => {
  try {
    const registry = await getTwitterRegistry(connection, twitterHandle);
    return registry.owner.toBase58();
  } catch (err) {
    console.warn(`err`);
    return undefined;
  }
};

export const resolveDomainName = async (
  connection: Connection,
  domainName: string,
): Promise<string | undefined> => {
  let hashedDomainName = await getHashedName(domainName);
  let inputDomainKey = await getNameAccountKey(
    hashedDomainName,
    undefined,
    SOL_TLD_AUTHORITY,
  );
  try {
    const registry = await NameRegistryState.retrieve(
      connection,
      inputDomainKey,
    );
    return registry.owner.toBase58();
  } catch (err) {
    console.warn(err);
    return undefined;
  }
};
