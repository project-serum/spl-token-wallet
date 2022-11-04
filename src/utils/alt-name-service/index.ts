import { PublicKey, Connection } from '@solana/web3.js';

import {
    findOwnedNameAccountsForUser,
    getHashedName,
    getNameAccountKeyWithBump,
    getNameOwner,
    getOriginNameAccountKey,
} from './utils';


export const ORIGIN_TLD = 'ANS';
export const ANS_PROGRAM_ID = new PublicKey(
    'ALTNSZ46uaAUU7XUV6awvdorLGqAsPwa9shm7h4uP2FK',
);
/**
 * retrieves all nameaccounts for any user in a particular tld.
 *
 * @param connection sol connection
 * @param userAccount user publickey or string
 * @param tld tld to be retrieved from
 */
export async function getAllUserDomainsFromTld(
    connection: Connection,
    userAccount: PublicKey | string,
    tld: string,
): Promise<PublicKey[]> {
    const tldName = '.' + tld;

    const nameOriginTldKey = await getOriginNameAccountKey();
    const parentHashedName = getHashedName(tldName);
    const [parentAccountKey] = await getNameAccountKeyWithBump(
        parentHashedName,
        undefined,
        nameOriginTldKey,
    );
    if (typeof userAccount == 'string') {
        userAccount = new PublicKey(userAccount);
    }
    const allDomains = await findOwnedNameAccountsForUser(
        connection,
        userAccount,
        parentAccountKey,
    );
    return allDomains;
}

/**
 * retrieves owner of a particular Name Account from domain.tld.
 *
 * @param connection sol connection
 * @param domainTld full string of domain and tld e.g. "miester.poor"
 */
export async function getOwnerFromDomainTld(
    connection: Connection,
    domainTld: string,
): Promise<PublicKey | undefined> {
    const domainTldSplit = domainTld.split('.');
    const domain = domainTldSplit[0];
    const tldName = '.' + domainTldSplit[1];

    const nameOriginTldKey = await getOriginNameAccountKey();
    const parentHashedName = getHashedName(tldName);
    const [parentAccountKey] = await getNameAccountKeyWithBump(
        parentHashedName,
        undefined,
        nameOriginTldKey,
    );

    const domainHashedName = getHashedName(domain);
    const [domainAccountKey] = await getNameAccountKeyWithBump(
        domainHashedName,
        undefined,
        parentAccountKey,
    );

    const nameOwner = await getNameOwner(connection, domainAccountKey);
    return nameOwner;
}