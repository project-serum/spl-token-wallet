import { clusterApiUrl } from '@solana/web3.js';
import { MAINNET_URL, MAINNET_BACKUP_URL } from '../utils/connection';

export const CLUSTERS = [
  {
    name: 'mainnet-beta',
    apiUrl: MAINNET_URL,
    label: 'Mainnet Beta',
    clusterSlug: 'mainnet-beta',
  },
  {
    name: 'mainnet-beta-backup',
    apiUrl: MAINNET_BACKUP_URL,
      label: 'Mainnet Beta Backup',
    clusterSlug: 'mainnet-beta',
  },
  {
    name: 'devnet',
    apiUrl: clusterApiUrl('devnet'),
    label: 'Devnet',
    clusterSlug: 'devnet',
  },
  {
    name: 'testnet',
    apiUrl: clusterApiUrl('testnet'),
    label: 'Testnet',
    clusterSlug: 'testnet',
  },
  {
    name: 'localnet',
    apiUrl: 'http://localhost:8899',
    label: null,
    clusterSlug: 'localnet',
  }
];

export function clusterForEndpoint(endpoint) {
  return getClusters().find(({ apiUrl }) => apiUrl === endpoint);
}

const customClusterConfigKey = "customClusterConfig";

export function addCustomCluster(name, apiUrl) {
  const stringifiedConfig = JSON.stringify({name: name, label: name, apiUrl: apiUrl, clusterSlug: null});
  localStorage.setItem(customClusterConfigKey, stringifiedConfig);
}

export function customClusterExists() {
  return !!localStorage.getItem(customClusterConfigKey)
}

export function getClusters() {
  const stringifiedConfig = localStorage.getItem(customClusterConfigKey);
  const config = stringifiedConfig ? JSON.parse(stringifiedConfig) : null;
  return  config ? [...CLUSTERS, config] : CLUSTERS;
}
