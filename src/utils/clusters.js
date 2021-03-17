import { clusterApiUrl } from '@solana/web3.js';
import { MAINNET_URL } from '../utils/connection';

export const CLUSTERS = [
  {
    name: 'mainnet-beta',
    apiUrl: MAINNET_URL,
    label: 'Mainnet Beta'
  },
  {
    name: 'devnet',
    apiUrl: clusterApiUrl('devnet'),
    label: 'Devnet'
  },
  {
    name: 'testnet',
    apiUrl: clusterApiUrl('testnet'),
    label: 'Testnet'
  },
  {
    name: 'localnet',
    apiUrl: 'http://localhost:8899',
    label: null
  }
];

export function clusterForEndpoint(endpoint) {
  return CLUSTERS.find(({ apiUrl }) => apiUrl === endpoint);
}