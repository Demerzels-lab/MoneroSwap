/**
 * Wallet Connection Hooks
 * 
 * Provides React hooks for connecting to MetaMask (EVM) and Phantom (Solana) wallets.
 */

import { useState, useCallback, useEffect } from 'react';
import { WalletProviderType, WalletState, Currency, ChainConfig } from '@/types';
import { isEvmChain, isSolanaChain, getChainById, SUPPORTED_CURRENCIES, SUPPORTED_CHAINS } from '@/lib/constants';

// ============================================================================
// Hook State
// ============================================================================

interface UseWalletReturn {
  walletState: WalletState;
  connect: (provider: WalletProviderType) => Promise<void>;
  disconnect: () => void;
  switchChain: (chainId: number) => Promise<void>;
  getBalance: () => Promise<void>;
  formatAddress: (address: string) => string;
}

interface UseTokensReturn {
  tokens: Currency[];
  tokenBalances: Record<string, string>;
  fetchTokenBalances: (address: string, chainId: number) => Promise<void>;
  approveToken: (currency: Currency, amount: string) => Promise<boolean>;
}

// ============================================================================
// useWallet Hook
// ============================================================================

export function useWallet(): UseWalletReturn {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    provider: null,
    address: null,
    chainId: null,
    chainType: null,
    balance: null,
    error: null,
  });

  // Auto-connect on mount if previously connected (optional feature)
  useEffect(() => {
    const savedProvider = localStorage.getItem('cipherswap_provider') as WalletProviderType | null;
    if (savedProvider && !walletState.isConnected) {
      // Would implement auto-reconnection here
    }
  }, [walletState.isConnected]);

  const connect = useCallback(async (provider: WalletProviderType) => {
    setWalletState(prev => ({ ...prev, error: null }));

    try {
      if (provider === 'METAMASK') {
        await connectMetaMask(setWalletState);
      } else if (provider === 'PHANTOM') {
        await connectPhantom(setWalletState);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      setWalletState(prev => ({ ...prev, error: new Error(errorMessage) }));
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem('cipherswap_provider');
    setWalletState({
      isConnected: false,
      provider: null,
      address: null,
      chainId: null,
      chainType: null,
      balance: null,
      error: null,
    });
  }, []);

  const switchChain = useCallback(async (chainId: number) => {
    if (!walletState.isConnected || walletState.provider !== 'METAMASK') {
      throw new Error('Cannot switch chain: not connected to MetaMask');
    }

    try {
      // For MetaMask
      if (window.ethereum) {
        const chainHex = '0x' + chainId.toString(16);
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        });
        setWalletState(prev => ({ ...prev, chainId }));
      }
    } catch (error) {
      // Chain might not be added to MetaMask
      if (error instanceof Error && error.message.includes('Unrecognized chain')) {
        throw new Error(`Chain ${chainId} is not supported by MetaMask`);
      }
      throw error;
    }
  }, [walletState.isConnected, walletState.provider]);

  const getBalance = useCallback(async () => {
    if (!walletState.isConnected || !walletState.address) return;

    try {
      if (walletState.provider === 'METAMASK' && isEvmChain(walletState.chainId || 0)) {
        const balance = await window.ethereum?.request({
          method: 'eth_getBalance',
          params: [walletState.address, 'latest'],
        });
        
        if (balance) {
          const balanceInEth = parseInt(balance as string, 16) / 1e18;
          setWalletState(prev => ({ ...prev, balance: balanceInEth.toFixed(6) }));
        }
      } else if (walletState.provider === 'PHANTOM' && isSolanaChain(walletState.chainId || 0)) {
        const balance = await getSolanaBalance(walletState.address);
        const balanceInSol = balance / 1e9;
        setWalletState(prev => ({ ...prev, balance: balanceInSol.toFixed(6) }));
      }
    } catch (error) {
      console.error('Failed to get balance:', error);
    }
  }, [walletState.isConnected, walletState.provider, walletState.address, walletState.chainId]);

  const formatAddress = useCallback((address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  return {
    walletState,
    connect,
    disconnect,
    switchChain,
    getBalance,
    formatAddress,
  };
}

// ============================================================================
// useTokens Hook
// ============================================================================

export function useTokens(): UseTokensReturn {
  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>({});

  const tokens = useMemo(() => {
    return SUPPORTED_CURRENCIES.filter(c => c.isToken);
  }, []);

  const fetchTokenBalances = useCallback(async (address: string, chainId: number) => {
    const chainTokens = tokens.filter(t => t.chainId === chainId);
    
    // This would be implemented with actual RPC calls or an indexer API
    const balances: Record<string, string> = {};
    
    for (const token of chainTokens) {
      if (token.contractAddress) {
        try {
          // Mock balance for demo - in production, call the chain RPC
          // For ERC-20: balanceOf(address)
          // For SPL: getTokenAccountBalance
          balances[token.id] = '0.00';
        } catch {
          balances[token.id] = 'Error';
        }
      }
    }
    
    setTokenBalances(balances);
  }, [tokens]);

  const approveToken = useCallback(async (currency: Currency, amount: string): Promise<boolean> => {
    if (!currency.contractAddress || !isEvmChain(currency.chainId)) {
      return false;
    }

    try {
      // This would interact with the token contract
      // const tokenContract = new web3.eth.Contract(ERC20_ABI, currency.contractAddress);
      // await tokenContract.methods.approve(SPENDER_ADDRESS, amount).send({ from: address });
      console.log(`Approved ${amount} ${currency.symbol}`);
      return true;
    } catch (error) {
      console.error('Approval failed:', error);
      return false;
    }
  }, []);

  return {
    tokens,
    tokenBalances,
    fetchTokenBalances,
    approveToken,
  };
}

// ============================================================================
// useChain Hook
// ============================================================================

interface UseChainReturn {
  currentChain: ChainConfig | null;
  supportedChains: ChainConfig[];
  switchChain: (chainId: number) => Promise<void>;
  getExplorerUrl: (address: string) => string | null;
}

export function useChain(chainId?: number): UseChainReturn {
  const [currentChainId, setCurrentChainId] = useState<number | null>(chainId || null);

  const currentChain = useMemo(() => {
    if (currentChainId === null) return null;
    return getChainById(currentChainId) || null;
  }, [currentChainId]);

  const supportedChains = useMemo(() => {
    return SUPPORTED_CHAINS.filter(c => c.type !== 'XMR');
  }, []);

  const switchChain = useCallback(async (newChainId: number) => {
    if (!isEvmChain(newChainId) && !isSolanaChain(newChainId)) {
      throw new Error('Unsupported chain');
    }

    setCurrentChainId(newChainId);
  }, []);

  const getExplorerUrl = useCallback((address: string): string | null => {
    if (!currentChain) return null;
    return `${currentChain.blockExplorer}/address/${address}`;
  }, [currentChain]);

  return {
    currentChain,
    supportedChains,
    switchChain,
    getExplorerUrl,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

async function connectMetaMask(
  setWalletState: React.Dispatch<React.SetStateAction<WalletState>>
): Promise<void> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    if (accounts.length === 0) {
      throw new Error('No accounts found. Please unlock your MetaMask wallet.');
    }

    const address = accounts[0];
    const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
    const chainId = parseInt(chainIdHex, 16);

    // Get balance
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    });
    const balanceInEth = parseInt(balance as string, 16) / 1e18;

    // Save provider to localStorage
    localStorage.setItem('cipherswap_provider', 'METAMASK');

    setWalletState({
      isConnected: true,
      provider: 'METAMASK',
      address,
      chainId,
      chainType: 'EVM',
      balance: balanceInEth.toFixed(6),
      error: null,
    });

    // Set up listeners
    window.ethereum.on('chainChanged', (newChainId: string) => {
      const parsedChainId = parseInt(newChainId, 16);
      setWalletState(prev => ({
        ...prev,
        chainId: parsedChainId,
        chainType: parsedChainId === 0 ? 'XMR' : parsedChainId === 25 ? 'SOLANA' : 'EVM',
      }));
    });

    window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
      if (newAccounts.length === 0) {
        setWalletState({
          isConnected: false,
          provider: null,
          address: null,
          chainId: null,
          chainType: null,
          balance: null,
          error: null,
        });
        localStorage.removeItem('cipherswap_provider');
      } else {
        setWalletState(prev => ({
          ...prev,
          address: newAccounts[0],
        }));
      }
    });

  } catch (error) {
    if (error instanceof Error && error.message.includes('User rejected')) {
      throw new Error('Connection rejected. Please approve the connection request in MetaMask.');
    }
    throw error;
  }
}

async function connectPhantom(
  setWalletState: React.Dispatch<React.SetStateAction<WalletState>>
): Promise<void> {
  if (typeof window === 'undefined' || !window.solana) {
    throw new Error('Phantom Wallet is not installed. Please install Phantom to continue.');
  }

  try {
    const { solana } = window;

    // Request connection
    const connectionResponse = await solana.connect();
    const address = connectionResponse.publicKey.toString();

    // Phantom is always on Solana mainnet
    const chainId = 25;

    // Get balance
    const balanceLamports = await getSolanaBalance(address);
    const balanceSol = balanceLamports / 1e9;

    // Save provider to localStorage
    localStorage.setItem('cipherswap_provider', 'PHANTOM');

    setWalletState({
      isConnected: true,
      provider: 'PHANTOM',
      address,
      chainId,
      chainType: 'SOLANA',
      balance: balanceSol.toFixed(6),
      error: null,
    });

    // Set up listener for account changes
    solana.on('accountChanged', (publicKey: any) => {
      if (publicKey) {
        const newAddress = publicKey.toString();
        setWalletState(prev => ({
          ...prev,
          address: newAddress,
        }));
      } else {
        setWalletState({
          isConnected: false,
          provider: null,
          address: null,
          chainId: null,
          chainType: null,
          balance: null,
          error: null,
        });
        localStorage.removeItem('cipherswap_provider');
      }
    });

  } catch (error) {
    if (error instanceof Error && error.message.includes('User rejected')) {
      throw new Error('Connection rejected. Please approve the connection request in Phantom.');
    }
    throw error;
  }
}

async function getSolanaBalance(address: string): Promise<number> {
  if (typeof window === 'undefined' || !window.solana) {
    return 0;
  }

  try {
    // In a real app, you'd use @solana/web3.js Connection
    // For demo purposes, this is a placeholder
    // const connection = new Connection('https://api.mainnet-beta.solana.com');
    // const balance = await connection.getBalance(new PublicKey(address));
    // return balance;
    
    return 0; // Placeholder
  } catch {
    return 0;
  }
}

// Import useMemo for React hooks
import { useMemo } from 'react';

// Type augmentation for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      providers?: Array<{ isMetaMask?: boolean }>;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
    };
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      on: (event: string, handler: (publicKey: any) => void) => void;
    };
  }
}
