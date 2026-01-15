/**
 * CipherSwap Constants - Supported Chains and Currencies
 */

import { ChainConfig, Currency } from '@/types';

// ============================================================================
// Chain Configurations
// ============================================================================

export const SUPPORTED_CHAINS: ChainConfig[] = [
  {
    id: 1,
    type: 'EVM',
    name: 'Ethereum',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/demo',
    blockExplorer: 'https://etherscan.io',
    icon: '⟠',
    color: 'indigo-500',
  },
  {
    id: 137,
    type: 'EVM',
    name: 'Polygon',
    nativeCurrency: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    icon: '⬡',
    color: 'purple-500',
  },
  {
    id: 56,
    type: 'EVM',
    name: 'BSC',
    nativeCurrency: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com',
    icon: '🟡',
    color: 'yellow-500',
  },
  {
    id: 43114,
    type: 'EVM',
    name: 'Avalanche',
    nativeCurrency: 'AVAX',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    blockExplorer: 'https://snowtrace.io',
    icon: '🔺',
    color: 'red-500',
  },
  {
    id: 42161,
    type: 'EVM',
    name: 'Arbitrum',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    icon: 'A',
    color: 'blue-500',
  },
  {
    id: 10,
    type: 'EVM',
    name: 'Optimism',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://mainnet.optimism.io',
    blockExplorer: 'https://optimistic.etherscan.io',
    icon: '⟵',
    color: 'red-500',
  },
  {
    id: 25,
    type: 'SOLANA',
    name: 'Solana',
    nativeCurrency: 'SOL',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    blockExplorer: 'https://solscan.io',
    icon: '◎',
    color: 'cyan-500',
  },
  {
    id: 0,
    type: 'XMR',
    name: 'Monero',
    nativeCurrency: 'XMR',
    rpcUrl: 'http://127.0.0.1:18081',
    blockExplorer: 'https://xmrchain.net',
    icon: '◈',
    color: 'monero-orange',
  },
];

// ============================================================================
// Currency Configurations
// ============================================================================

export const SUPPORTED_CURRENCIES: Currency[] = [
  // Native Assets
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '⟠',
    color: 'indigo-500',
    decimals: 18,
    chainId: 1,
    chainType: 'EVM',
    isNative: true,
    isToken: false,
    coingeckoId: 'ethereum',
  },
  {
    id: 'matic',
    name: 'Polygon',
    symbol: 'MATIC',
    icon: '⬡',
    color: 'purple-500',
    decimals: 18,
    chainId: 137,
    chainType: 'EVM',
    isNative: true,
    isToken: false,
    coingeckoId: 'matic-network',
  },
  {
    id: 'bnb',
    name: 'BNB',
    symbol: 'BNB',
    icon: '🟡',
    color: 'yellow-500',
    decimals: 18,
    chainId: 56,
    chainType: 'EVM',
    isNative: true,
    isToken: false,
    coingeckoId: 'binancecoin',
  },
  {
    id: 'avax',
    name: 'Avalanche',
    symbol: 'AVAX',
    icon: '🔺',
    color: 'red-500',
    decimals: 18,
    chainId: 43114,
    chainType: 'EVM',
    isNative: true,
    isToken: false,
    coingeckoId: 'avalanche-2',
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    icon: '◎',
    color: 'cyan-500',
    decimals: 9,
    chainId: 25,
    chainType: 'SOLANA',
    isNative: true,
    isToken: false,
    coingeckoId: 'solana',
  },
  {
    id: 'xmr',
    name: 'Monero',
    symbol: 'XMR',
    icon: '◈',
    color: 'monero-orange',
    decimals: 12,
    chainId: 0,
    chainType: 'XMR',
    isNative: true,
    isToken: false,
    coingeckoId: 'monero',
  },
  
  // ERC-20 Tokens (Ethereum Mainnet)
  {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    icon: '💵',
    color: 'blue-500',
    decimals: 6,
    chainId: 1,
    chainType: 'EVM',
    contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    isNative: false,
    isToken: true,
    coingeckoId: 'usd-coin',
  },
  {
    id: 'usdt',
    name: 'Tether',
    symbol: 'USDT',
    icon: '💲',
    color: 'green-500',
    decimals: 6,
    chainId: 1,
    chainType: 'EVM',
    contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    isNative: false,
    isToken: true,
    coingeckoId: 'tether',
  },
  {
    id: 'dai',
    name: 'Dai',
    symbol: 'DAI',
    icon: '◈',
    color: 'orange-500',
    decimals: 18,
    chainId: 1,
    chainType: 'EVM',
    contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    isNative: false,
    isToken: true,
    coingeckoId: 'dai',
  },
  {
    id: 'link',
    name: 'Chainlink',
    symbol: 'LINK',
    icon: '🔗',
    color: 'blue-600',
    decimals: 18,
    chainId: 1,
    chainType: 'EVM',
    contractAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    isNative: false,
    isToken: true,
    coingeckoId: 'chainlink',
  },
  {
    id: 'uni',
    name: 'Uniswap',
    symbol: 'UNI',
    icon: '🦄',
    color: 'pink-500',
    decimals: 18,
    chainId: 1,
    chainType: 'EVM',
    contractAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    isNative: false,
    isToken: true,
    coingeckoId: 'uniswap',
  },
  {
    id: 'wbtc',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    icon: '₿',
    color: 'orange-500',
    decimals: 8,
    chainId: 1,
    chainType: 'EVM',
    contractAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    isNative: false,
    isToken: true,
    coingeckoId: 'wrapped-bitcoin',
  },
  {
    id: 'aave',
    name: 'Aave',
    symbol: 'AAVE',
    icon: '👻',
    color: 'blue-400',
    decimals: 18,
    chainId: 1,
    chainType: 'EVM',
    contractAddress: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E63DD9E',
    isNative: false,
    isToken: true,
    coingeckoId: 'aave',
  },
  {
    id: 'matic_token',
    name: 'Polygon (Token)',
    symbol: 'MATIC',
    icon: '⬡',
    color: 'purple-500',
    decimals: 18,
    chainId: 1,
    chainType: 'EVM',
    contractAddress: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    isNative: false,
    isToken: true,
    coingeckoId: 'matic-network',
  },
  
  // SPL Tokens (Solana)
  {
    id: 'usdc_sol',
    name: 'USD Coin (Solana)',
    symbol: 'USDC',
    icon: '💵',
    color: 'blue-500',
    decimals: 6,
    chainId: 25,
    chainType: 'SOLANA',
    contractAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    isNative: false,
    isToken: true,
    coingeckoId: 'usd-coin',
  },
  {
    id: 'usdt_sol',
    name: 'Tether (Solana)',
    symbol: 'USDT',
    icon: '💲',
    color: 'green-500',
    decimals: 6,
    chainId: 25,
    chainType: 'SOLANA',
    contractAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    isNative: false,
    isToken: true,
    coingeckoId: 'tether',
  },
];

// ============================================================================
// Token Addresses by Chain for Quick Lookup
// ============================================================================

export const TOKEN_ADDRESSES: Record<number, Record<string, string>> = {
  1: {
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    AAVE: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E63DD9E',
  },
  137: {
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    DAI: '0x53E0bca35eC356BD5ddDFEbdD1Fc0fD03FaBad39',
  },
  25: {
    USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  },
};

// ============================================================================
// Default Settings
// ============================================================================

export const DEFAULT_SLIPPAGE = 1; // 1%
export const DEFAULT_MIXIN_COUNT = 16;
export const DEFAULT_TIMELOCK = 24; // 24 hours in blocks

// ============================================================================
// Swap Routes
// ============================================================================

export const SUPPORTED_SWAP_PAIRS = [
  // XMR pairs
  { from: 'xmr', to: 'eth', minAmount: 0.01, maxAmount: 1000 },
  { from: 'xmr', to: 'usdc', minAmount: 1, maxAmount: 50000 },
  { from: 'xmr', to: 'usdt', minAmount: 1, maxAmount: 50000 },
  { from: 'xmr', to: 'dai', minAmount: 1, maxAmount: 50000 },
  
  // ETH pairs
  { from: 'eth', to: 'xmr', minAmount: 0.001, maxAmount: 100 },
  { from: 'eth', to: 'usdc', minAmount: 0.001, maxAmount: 10000 },
  { from: 'eth', to: 'usdt', minAmount: 0.001, maxAmount: 10000 },
  { from: 'eth', to: 'dai', minAmount: 0.001, maxAmount: 10000 },
  { from: 'eth', to: 'link', minAmount: 1, maxAmount: 10000 },
  { from: 'eth', to: 'uni', minAmount: 1, maxAmount: 10000 },
  
  // SOL pairs
  { from: 'sol', to: 'xmr', minAmount: 0.1, maxAmount: 5000 },
  { from: 'sol', to: 'usdc', minAmount: 1, maxAmount: 50000 },
  { from: 'sol', to: 'usdt', minAmount: 1, maxAmount: 50000 },
  { from: 'sol', to: 'eth', minAmount: 0.01, maxAmount: 5000 },
  
  // Stablecoin pairs
  { from: 'usdc', to: 'xmr', minAmount: 1, maxAmount: 50000 },
  { from: 'usdc', to: 'eth', minAmount: 1, maxAmount: 50000 },
  { from: 'usdc', to: 'sol', minAmount: 1, maxAmount: 50000 },
  { from: 'usdc', to: 'dai', minAmount: 1, maxAmount: 100000 },
  
  { from: 'usdt', to: 'xmr', minAmount: 1, maxAmount: 50000 },
  { from: 'usdt', to: 'eth', minAmount: 1, maxAmount: 50000 },
  { from: 'usdt', to: 'sol', minAmount: 1, maxAmount: 50000 },
  
  // Cross-chain from BSC/Polygon
  { from: 'bnb', to: 'xmr', minAmount: 0.01, maxAmount: 500 },
  { from: 'matic', to: 'xmr', minAmount: 10, maxAmount: 50000 },
];

// ============================================================================
// Utility Functions
// ============================================================================

export function getCurrencyById(id: string): Currency | undefined {
  return SUPPORTED_CURRENCIES.find((c) => c.id === id);
}

export function getCurrencyBySymbolAndChain(symbol: string, chainId: number): Currency | undefined {
  return SUPPORTED_CURRENCIES.find((c) => c.symbol === symbol && c.chainId === chainId);
}

export function getChainById(id: number): ChainConfig | undefined {
  return SUPPORTED_CHAINS.find((c) => c.id === id);
}

export function getCurrenciesByChain(chainId: number): Currency[] {
  return SUPPORTED_CURRENCIES.filter((c) => c.chainId === chainId);
}

export function getNativeCurrency(chainId: number): Currency | undefined {
  return SUPPORTED_CURRENCIES.find((c) => c.chainId === chainId && c.isNative);
}

export function isSwapPairSupported(fromId: string, toId: string): boolean {
  return SUPPORTED_SWAP_PAIRS.some((pair) => pair.from === fromId && pair.to === toId);
}

export function getSwapLimits(fromId: string, toId: string): { minAmount: number; maxAmount: number } | null {
  const pair = SUPPORTED_SWAP_PAIRS.find((p) => p.from === fromId && p.to === toId);
  return pair ? { minAmount: pair.minAmount, maxAmount: pair.maxAmount } : null;
}

// ============================================================================
// Wallet Detection
// ============================================================================

export const EVM_CHAINS = [1, 56, 137, 43114, 42161, 10];
export const SOLANA_CHAIN_ID = 25;
export const MONERO_CHAIN_ID = 0;

export function isEvmChain(chainId: number): boolean {
  return EVM_CHAINS.includes(chainId);
}

export function isSolanaChain(chainId: number): boolean {
  return chainId === SOLANA_CHAIN_ID;
}

export function isMoneroChain(chainId: number): boolean {
  return chainId === MONERO_CHAIN_ID;
}

export function detectWalletProvider(): 'METAMASK' | 'PHANTOM' | 'NONE' {
  if (typeof window === 'undefined') return 'NONE';
  
  // Check for MetaMask
  if (window.ethereum?.isMetaMask || (window.ethereum as any)?.providers?.some((p: any) => p.isMetaMask)) {
    return 'METAMASK';
  }
  
  // Check for Phantom
  if ((window as any).solana?.isPhantom || window.solana?.isPhantom) {
    return 'PHANTOM';
  }
  
  return 'NONE';
}

export const WALLET_LINKS: Record<string, string> = {
  METAMASK: 'https://metamask.io/download/',
  PHANTOM: 'https://phantom.app/download',
};
