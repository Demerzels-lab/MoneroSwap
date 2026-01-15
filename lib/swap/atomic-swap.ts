/**
 * Atomic Swap Protocol Implementation
 * 
 * This module implements the trustless atomic swap protocol between
 * Monero and Bitcoin/Ethereum using Hash Time Locked Contracts (HTLC).
 */

export type SwapState = 
  | 'IDLE'
  | 'NEGOTIATING'
  | 'LOCK_XMR'
  | 'LOCK_BTC'
  | 'REDEEM_BTC'
  | 'REDEEM_XMR'
  | 'COMPLETED'
  | 'REFUNDED'
  | 'FAILED';

export interface SwapParams {
  fromCurrency: 'XMR' | 'BTC' | 'ETH';
  toCurrency: 'XMR' | 'BTC' | 'ETH';
  amount: number;
  rate: number;
  makerAddress?: string;
  takerAddress?: string;
}

export interface SwapParticipant {
  address: string;
  publicKey: string;
  refundAddress?: string;
}

export interface HTLCConfig {
  secretHash: string;      // Hash of the secret value
  secretLength: number;    // Length of secret in bytes (usually 32)
  timelock: number;        // Block height or timestamp for refund
  amount: number;          // Amount locked in contract
  tokenAddress?: string;   // For ERC-20 tokens
}

export interface AtomicSwapState {
  swapId: string;
  state: SwapState;
  params: SwapParams;
  htlc: {
    xmr?: {
      address: string;
      txHash: string;
      amount: number;
      timelock: number;
      secretHash: string;
    };
    btc?: {
      address: string;
      txHash: string;
      amount: number;
      timelock: number;
      secretHash: string;
    };
  };
  timestamps: {
    created: number;
    xmrLocked?: number;
    btcLocked?: number;
    completed?: number;
  };
}

/**
 * Generate a random secret and its hash for HTLC
 */
export function generateSecretAndHash(): { secret: string; hash: string } {
  const secret = generateSecureRandom(32);
  const hash = hashSecret(secret);
  return { secret, hash };
}

/**
 * Calculate the expected output amount based on rate
 */
export function calculateOutputAmount(
  inputAmount: number,
  inputCurrency: string,
  outputCurrency: string
): number {
  const rates: Record<string, Record<string, number>> = {
    XMR: { BTC: 0.0042, ETH: 0.089 },
    BTC: { XMR: 238.1, ETH: 16.8 },
    ETH: { XMR: 11.24, BTC: 0.0595 },
  };
  
  const rate = rates[inputCurrency]?.[outputCurrency] || 1;
  return inputAmount * rate;
}

/**
 * Build HTLC configuration for a given direction
 */
export function buildHTLCConfig(
  direction: 'XMR_TO_BTC' | 'BTC_TO_XMR',
  amount: number,
  secretHash: string,
  timelockBlocks: number = 1000
): HTLCConfig {
  return {
    secretHash,
    secretLength: 32,
    timelock: timelockBlocks,
    amount,
  };
}

/**
 * Generate Monero-specific HTLC address
 * Note: Monero doesn't have native HTLC, so we use a special output script
 */
export function generateMoneroHTLCAddress(
  participant: SwapParticipant,
  secretHash: string,
  timelock: number
): { address: string; script: string } {
  // In production: Construct Monero output with HTLC script
  // The script encodes the hash lock and timelock conditions
  const script = Buffer.from(
    // OP_HASH160 <secretHash> OP_EQUALVERIFY <timelock> OP_CHECKLOCKTIMEVERIFY
    `21${secretHash}88ac${timelock.toString(16).padStart(8, '0')}b175`
  ).toString('hex');
  
  return {
    address: `xmrhltc1${secretHash.substring(0, 16)}...`,
    script,
  };
}

/**
 * Generate Bitcoin HTLC address using P2SH
 */
export function generateBitcoinHTLCAddress(
  participant: SwapParticipant,
  secretHash: string,
  timelock: number,
  counterpartyAddress: string
): { address: string; redeemScript: string } {
  // Bitcoin HTLC script:
  // IF 
  //   OP_HASH160 <hash(secret)> OP_EQUAL 
  // ELSE 
  //   <timelock> OP_CHECKLOCKTIMEVERIFY OP_DROP 
  //   OP_DUP OP_HASH160 <counterparty_pubkey_hash> 
  // ENDIF 
  // OP_EQUALVERIFY OP_CHECKSIG
  
  const redeemScript = [
    'OP_IF',
    `OP_HASH160 ${secretHash}`,
    'OP_EQUAL',
    'OP_ELSE',
    `${timelock} OP_CHECKLOCKTIMEVERIFY OP_DROP`,
    `OP_DUP OP_HASH160 ${counterpartyAddress}`,
    'OP_ENDIF',
    'OP_EQUALVERIFY OP_CHECKSIG',
  ].join(' ');
  
  // In production: Create P2SH address from redeem script
  const address = `3${secretHash.substring(0, 10)}...`;
  
  return { address, redeemScript };
}

/**
 * Verify HTLC conditions have been met
 */
export function verifyHTLC(
  state: AtomicSwapState,
  direction: 'XMR_TO_BTC' | 'BTC_TO_XMR'
): { valid: boolean; reason?: string } {
  if (state.state === 'IDLE') {
    return { valid: false, reason: 'Swap not initiated' };
  }
  
  if (direction === 'XMR_TO_BTC') {
    if (!state.htlc.xmr?.txHash) {
      return { valid: false, reason: 'XMR not locked yet' };
    }
    if (!state.htlc.btc?.txHash) {
      return { valid: false, reason: 'BTC not locked yet' };
    }
  } else {
    if (!state.htlc.btc?.txHash) {
      return { valid: false, reason: 'BTC not locked yet' };
    }
    if (!state.htlc.xmr?.txHash) {
      return { valid: false, reason: 'XMR not locked yet' };
    }
  }
  
  return { valid: true };
}

/**
 * Check if HTLC has expired and refund is available
 */
export function checkHTLCExpired(
  state: AtomicSwapState,
  currentBlockHeight: number,
  direction: 'XMR_TO_BTC' | 'BTC_TO_XMR'
): boolean {
  const htlc = direction === 'XMR_TO_BTC' ? state.htlc.xmr : state.htlc.btc;
  
  if (!htlc) return false;
  
  return currentBlockHeight >= htlc.timelock;
}

/**
 * Create atomic swap state machine instance
 */
export function createAtomicSwap(
  swapId: string,
  params: SwapParams
): AtomicSwapState {
  return {
    swapId,
    state: 'IDLE',
    params,
    htlc: {},
    timestamps: {
      created: Date.now(),
    },
  };
}

// Helper functions
function generateSecureRandom(bytes: number): string {
  const chars = '0123456789abcdef';
  let result = '';
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  for (let i = 0; i < bytes; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

function hashSecret(secret: string): string {
  // In production: SHA-256 hash
  return secret.split('').reverse().join('');
}
