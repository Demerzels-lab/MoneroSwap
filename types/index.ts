/**
 * Type definitions for CipherSwap Multi-Chain
 */

// ============================================================================
// Chain Types
// ============================================================================

export type ChainType = 'EVM' | 'SOLANA' | 'XMR';

export interface ChainConfig {
  id: number;
  type: ChainType;
  name: string;
  nativeCurrency: string;
  rpcUrl: string;
  blockExplorer: string;
  icon: string;
  color: string;
}

// ============================================================================
// Currency Types
// ============================================================================

export interface Currency {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  color: string;
  decimals: number;
  chainId: number;
  chainType: ChainType;
  contractAddress?: string;
  isNative: boolean;
  isToken: boolean;
  coingeckoId?: string;
  wrappedAddress?: string;
}

export interface TokenBalance {
  currency: Currency;
  balance: string;
  balanceUsd: number;
  allowance?: string;
}

// ============================================================================
// Wallet Types
// ============================================================================

export type WalletProviderType = 'METAMASK' | 'PHANTOM';

export interface WalletState {
  isConnected: boolean;
  provider: WalletProviderType | null;
  address: string | null;
  chainId: number | null;
  chainType: ChainType | null;
  balance: string | null;
  error: Error | null;
}

export interface WalletConnectionParams {
  provider: WalletProviderType;
}

// ============================================================================
// Monero Types (Preserved for Privacy Protocol Backend)
// ============================================================================

export interface MoneroKeys {
  publicViewKey: string;
  privateViewKey: string;
  publicSpendKey: string;
  privateSpendKey: string;
  address: string;
}

export interface StealthAddress {
  publicViewKey: string;
  publicSpendKey: string;
  outputIndex: number;
  address: string;
}

export interface KeyImage {
  image: string;
  publicKey: string;
}

export interface TransactionOutput {
  amount: number;
  publicKey: string;
  stealthAddress: string;
  commitment?: string;
}

export interface RingSignature {
  type: 'CLSAG' | 'MLSAG';
  version: number;
  inputs: string[];
  keyImage: string;
  signatures: string[];
  pseudoOuts?: string[];
}

export interface PedersenCommitment {
  commitment: string;
  blindingFactor: string;
}

export interface RangeProof {
  type: 'Bulletproof' | 'BulletproofPlus';
  proof: string;
  minValue: number;
  maxValue: number;
}

export interface MoneroTransaction {
  txHash: string;
  blockHeight: number;
  timestamp: number;
  inputs: TransactionOutput[];
  outputs: TransactionOutput[];
  fee: number;
  ringSize: number;
  mixinCount: number;
}

// ============================================================================
// Swap Types
// ============================================================================

export type SwapDirection = string; // Dynamic: e.g., 'ETH_TO_SOL', 'XMR_TO_USDC'

export type SwapStatus = 
  | 'IDLE'
  | 'NEGOTIATING'
  | 'CREATING_HTLC'
  | 'LOCKING_FROM'
  | 'LOCKING_TO'
  | 'CLAIMING'
  | 'COMPLETED'
  | 'REFUNDED'
  | 'FAILED'
  | 'CANCELLED';

export interface SwapParams {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  rate: number;
  minAmount?: number;
  maxAmount?: number;
  slippage: number;
}

export interface SwapParticipant {
  address: string;
  publicKey: string;
  viewKey?: string;
  refundAddress?: string;
}

export interface HTLCConfig {
  secretHash: string;
  secretLength: number;
  timelock: number;
  amount: number;
  tokenAddress?: string;
  chainId: number;
}

export interface HTLCInfo {
  address: string;
  txHash: string;
  amount: number;
  timelock: number;
  secretHash: string;
  confirmed: boolean;
  createdAt: number;
}

export interface AtomicSwapState {
  swapId: string;
  status: SwapStatus;
  direction: SwapDirection;
  params: SwapParams;
  htlc: {
    from: HTLCInfo | null;
    to: HTLCInfo | null;
  };
  secret?: string;
  timestamps: {
    created: number;
    fromLocked?: number;
    toLocked?: number;
    claimed?: number;
    refunded?: number;
    completed?: number;
  };
  participants: {
    maker: SwapParticipant;
    taker: SwapParticipant;
  };
}

// ============================================================================
// API Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface ExchangeRate {
  pair: string;
  rate: number;
  timestamp: number;
  source: string;
  volume24h?: number;
  change24h?: number;
}

export interface SwapQuote {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  inputAmount: number;
  outputAmount: number;
  rate: number;
  minInput: number;
  maxInput: number;
  expiresAt: number;
  makerAddress: string;
  chainId: number;
  priceImpact: number;
  fee: {
    percentage: number;
    amount: number;
    currency: string;
  };
}

export interface MarketData {
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
}

// ============================================================================
// UI Types
// ============================================================================

export interface SwapSettings {
  slippage: number;
  mixinCount: number;
  feeLevel: 'slow' | 'average' | 'fast';
  customTimelock?: number;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  duration?: number;
}

// ============================================================================
// Config Types
// ============================================================================

export interface AppConfig {
  appName: string;
  appVersion: string;
  supportedCurrencies: Currency[];
  supportedChains: ChainConfig[];
  defaultSwapSettings: SwapSettings;
  apiEndpoints: {
    rates: string;
    quotes: string;
    swap: string;
    history: string;
  };
  atomicSwap: {
    defaultTimelock: number;
    makerFee: number;
    takerFee: number;
    minSwapAmount: number;
    maxSwapAmount: number;
  };
}

// ============================================================================
// Privacy Protocol Types
// ============================================================================

export interface PrivacyProof {
  type: 'ZEROCOIN' | 'RING_SIGNATURE' | 'BULLETPROOFS';
  proof: string;
  commitment: string;
  scale: string;
}

export interface ShieldedTransaction {
  proof: PrivacyProof;
  commitment: string;
  nullifier: string;
  merkleRoot: string;
}

// ============================================================================
// Bridge Types
// ============================================================================

export interface BridgeRoute {
  fromChain: ChainConfig;
  toChain: ChainConfig;
  fromCurrency: Currency;
  toCurrency: Currency;
  supported: boolean;
  bridgeAddress?: string;
  estimatedTime: number; // in minutes
  feePercentage: number;
}
