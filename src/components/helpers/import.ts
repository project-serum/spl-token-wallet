import { Account } from '@solana/web3.js';
import * as bs58 from 'bs58';

/**
 * Returns an account object when given the private key
 *
 * @param {string} privateKey - the private key in array format
 */
export const decodeAccount = (privateKey: string) => {
    try {
        return new Account(JSON.parse(privateKey));
    } catch (_) {
        try {
           return new Account(bs58.decode(privateKey));
        } catch (_) {
           return undefined;
        }
    }
}