/**
 * Utility functions for CipherSwap
 */

/**
 * Format a number with thousands separators and fixed decimal places
 */
export function formatNumber(
  value: number | string,
  decimals: number = 8,
  options?: {
    thousandSeparator?: string;
    decimalSeparator?: string;
  }
): string {
  const thousandSeparator = options?.thousandSeparator || ',';
  const decimalSeparator = options?.decimalSeparator || '.';
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0';
  
  const [integerPart, decimalPart] = num.toFixed(decimals).split('.');
  
  const formattedInteger = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandSeparator
  );
  
  if (decimals > 0) {
    return `${formattedInteger}${decimalSeparator}${decimalPart}`;
  }
  
  return formattedInteger;
}

/**
 * Parse a formatted number string back to number
 */
export function parseNumber(value: string): number {
  if (!value) return 0;
  return parseFloat(value.replace(/,/g, ''));
}

/**
 * Validate Monero address format
 */
export function isValidMoneroAddress(address: string): boolean {
  // Monero addresses are 95-106 characters starting with 4
  // Integrated addresses start with 8
  // Subaddresses start with 2
  const addressRegex = /^[48][a-zA-Z0-9]{93,104}$/;
  return addressRegex.test(address);
}

/**
 * Validate Bitcoin address format
 */
export function isValidBitcoinAddress(address: string): boolean {
  // Legacy: 1..., P2SH: 3..., SegWit: bc1...
  const legacyRegex = /^1[a-zA-HJ-NP-Z1-9]{25,34}$/;
  const p2shRegex = /^3[a-zA-HJ-NP-Z1-9]{25,34}$/;
  const bech32Regex = /^bc1[a-zA-HJ-NP-Z1-9]{25,90}$/;
  
  return legacyRegex.test(address) || p2shRegex.test(address) || bech32Regex.test(address);
}

/**
 * Validate Ethereum address format
 */
export function isValidEthereumAddress(address: string): boolean {
  const regex = /^0x[a-fA-F0-9]{40}$/;
  return regex.test(address);
}

/**
 * Validate any cryptocurrency address based on currency type
 */
export function isValidAddress(address: string, currency: string): boolean {
  switch (currency.toUpperCase()) {
    case 'XMR':
      return isValidMoneroAddress(address);
    case 'BTC':
      return isValidBitcoinAddress(address);
    case 'ETH':
      return isValidEthereumAddress(address);
    default:
      return false;
  }
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, prefixLength: number = 8, suffixLength: number = 6): string {
  if (address.length <= prefixLength + suffixLength) {
    return address;
  }
  return `${address.substring(0, prefixLength)}...${address.substring(address.length - suffixLength)}`;
}

/**
 * Format currency amount with symbol
 */
export function formatCurrency(
  amount: number,
  currency: string,
  decimals: number = 8
): string {
  const symbol = getCurrencySymbol(currency);
  const formatted = formatNumber(amount, decimals);
  return `${symbol} ${formatted}`;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    XMR: '🔶',
    BTC: '₿',
    ETH: 'Ξ',
    USDT: '₮',
    USDC: '$',
  };
  return symbols[currency.toUpperCase()] || currency.toUpperCase();
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Debounce function execution
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Sleep for a specified duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await sleep(delay);
      }
    }
  }
  
  throw lastError;
}
