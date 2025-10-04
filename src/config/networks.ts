/**
 * Network configuration for 0xio SDK
 */

import { NetworkInfo } from '../types';

export const NETWORKS: Record<string, NetworkInfo> = {
  '0xio-testnet': {
    id: '0xio-testnet',
    name: '0xio Testnet',
    rpcUrl: 'https://0xio.network',
    explorerUrl: 'https://0xioscan.io/',
    color: '#6366f1',
    isTestnet: true
  },
  // Legacy network ID for backward compatibility
  'octra-testnet': {
    id: 'octra-testnet',
    name: '0xio Testnet (Legacy)',
    rpcUrl: 'https://0xio.network',
    explorerUrl: 'https://0xioscan.io/',
    color: '#6366f1',
    isTestnet: true
  },
  'custom': {
    id: 'custom',
    name: 'Custom Network',
    rpcUrl: '',
    explorerUrl: '',
    color: '#64748b',
    isTestnet: false // User configurable - can be mainnet or testnet
  }
};

export const DEFAULT_NETWORK_ID = '0xio-testnet';

/**
 * Get network configuration by ID
 */
export function getNetworkConfig(networkId: string = DEFAULT_NETWORK_ID): NetworkInfo {
  const network = NETWORKS[networkId];
  if (!network) {
    throw new Error(`Unknown network ID: ${networkId}`);
  }
  return network;
}

/**
 * Get all available networks
 */
export function getAllNetworks(): NetworkInfo[] {
  return Object.values(NETWORKS);
}

/**
 * Check if network ID is valid
 */
export function isValidNetworkId(networkId: string): boolean {
  return networkId in NETWORKS;
}