import { create } from 'zustand';
import { Currency, WalletProviderType, WalletState, SwapSettings, Notification, TokenBalance, ChainConfig } from '@/types';
import { SUPPORTED_CURRENCIES, DEFAULT_SLIPPAGE, DEFAULT_MIXIN_COUNT } from '@/lib/constants';

interface SwapState {
  // Currency Selection
  fromCurrencyId: string;
  toCurrencyId: string;
  fromAmount: string;
  toAmount: string;
  
  // Swap Settings
  slippage: number;
  mixinCount: number;
  customTimelock?: number;
  
  // UI State
  swapDirection: 'from-to' | 'to-from';
  
  // Actions
  setFromCurrency: (currencyId: string) => void;
  setToCurrency: (currencyId: string) => void;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  setSlippage: (slippage: number) => void;
  setMixinCount: (count: number) => void;
  setCustomTimelock: (timelock: number | undefined) => void;
  setSwapDirection: () => void;
  resetSwap: () => void;
}

export const useSwapStore = create<SwapState>((set, get) => ({
  fromCurrencyId: 'xmr',
  toCurrencyId: 'eth',
  fromAmount: '',
  toAmount: '',
  slippage: DEFAULT_SLIPPAGE,
  mixinCount: DEFAULT_MIXIN_COUNT,
  swapDirection: 'from-to',
  
  setFromCurrency: (currencyId) => {
    const { toCurrencyId } = get();
    const currency = SUPPORTED_CURRENCIES.find(c => c.id === currencyId);
    if (currency && currencyId !== toCurrencyId) {
      set({ fromCurrencyId: currencyId });
    }
  },
  
  setToCurrency: (currencyId) => {
    const { fromCurrencyId } = get();
    const currency = SUPPORTED_CURRENCIES.find(c => c.id === currencyId);
    if (currency && currencyId !== fromCurrencyId) {
      set({ toCurrencyId: currencyId });
    }
  },
  
  setFromAmount: (amount) => set({ fromAmount: amount }),
  setToAmount: (amount) => set({ toAmount: amount }),
  setSlippage: (slippage) => set({ slippage }),
  setMixinCount: (count) => set({ mixinCount: count }),
  setCustomTimelock: (timelock) => set({ customTimelock: timelock }),
  
  setSwapDirection: () => set((state) => ({
    swapDirection: state.swapDirection === 'from-to' ? 'to-from' : 'from-to',
    fromCurrencyId: state.toCurrencyId,
    toCurrencyId: state.fromCurrencyId,
    fromAmount: state.toAmount,
    toAmount: state.fromAmount,
  })),
  
  resetSwap: () => set({
    fromAmount: '',
    toAmount: '',
    swapDirection: 'from-to',
  }),
}));

// ============================================================================
// Wallet Store
// ============================================================================

interface WalletStoreState {
  // Connection State
  walletState: WalletState;
  
  // Token Balances
  tokenBalances: TokenBalance[];
  
  // Selected Chain
  selectedChain: ChainConfig | null;
  
  // Actions
  connectWallet: (provider: WalletProviderType) => Promise<void>;
  disconnectWallet: () => void;
  updateChainId: (chainId: number) => void;
  updateBalance: (balance: string) => void;
  setSelectedChain: (chain: ChainConfig) => void;
  addTokenBalance: (balance: TokenBalance) => void;
  clearTokenBalances: () => void;
  setError: (error: Error | null) => void;
}

export const useWalletStore = create<WalletStoreState>((set) => ({
  walletState: {
    isConnected: false,
    provider: null,
    address: null,
    chainId: null,
    chainType: null,
    balance: null,
    error: null,
  },
  tokenBalances: [],
  selectedChain: null,
  
  connectWallet: async (provider: WalletProviderType) => {
    try {
      set({
        walletState: {
          isConnected: false,
          provider,
          address: null,
          chainId: null,
          chainType: null,
          balance: null,
          error: null,
        },
      });
      
      if (provider === 'METAMASK') {
        await connectMetaMask();
      } else if (provider === 'PHANTOM') {
        await connectPhantom();
      }
    } catch (error) {
      set({
        walletState: {
          ...useWalletStore.getState().walletState,
          error: error instanceof Error ? error : new Error('Connection failed'),
        },
      });
    }
  },
  
  disconnectWallet: () => {
    set({
      walletState: {
        isConnected: false,
        provider: null,
        address: null,
        chainId: null,
        chainType: null,
        balance: null,
        error: null,
      },
      tokenBalances: [],
    });
  },
  
  updateChainId: (chainId: number) => {
    set((state) => ({
      walletState: {
        ...state.walletState,
        chainId,
        chainType: chainId === 0 ? 'XMR' : chainId === 25 ? 'SOLANA' : 'EVM',
      },
    }));
  },
  
  updateBalance: (balance: string) => {
    set((state) => ({
      walletState: {
        ...state.walletState,
        balance,
      },
    }));
  },
  
  setSelectedChain: (chain: ChainConfig) => {
    set({ selectedChain: chain });
    if (chain) {
      set((state) => ({
        walletState: {
          ...state.walletState,
          chainId: chain.id,
          chainType: chain.type,
        },
      }));
    }
  },
  
  addTokenBalance: (balance: TokenBalance) => {
    set((state) => ({
      tokenBalances: [...state.tokenBalances.filter(tb => tb.currency.id !== balance.currency.id), balance],
    }));
  },
  
  clearTokenBalances: () => {
    set({ tokenBalances: [] });
  },
  
  setError: (error: Error | null) => {
    set((state) => ({
      walletState: {
        ...state.walletState,
        error,
      },
    }));
  },
}));

// ============================================================================
// Wallet Connection Helpers
// ============================================================================

async function connectMetaMask(): Promise<void> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed');
  }
  
  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }
    
    const address = accounts[0];
    
    // Get chain ID
    const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
    const chainId = parseInt(chainIdHex, 16);
    
    // Get balance
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    });
    
    const balanceInEth = parseInt(balance, 16) / 1e18;
    
    useWalletStore.setState({
      walletState: {
        isConnected: true,
        provider: 'METAMASK',
        address,
        chainId,
        chainType: 'EVM',
        balance: balanceInEth.toFixed(6),
        error: null,
      },
    });
    
    // Set up chain change listener
    window.ethereum.on('chainChanged', (newChainId: string) => {
      const parsedChainId = parseInt(newChainId, 16);
      useWalletStore.getState().updateChainId(parsedChainId);
    });
    
    // Set up account change listener
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        useWalletStore.getState().disconnectWallet();
      } else {
        const address = accounts[0];
        useWalletStore.setState((state) => ({
          walletState: {
            ...state.walletState,
            address,
          },
        }));
      }
    });
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('User rejected')) {
      throw new Error('Connection rejected by user');
    }
    throw error;
  }
}

async function connectPhantom(): Promise<void> {
  if (typeof window === 'undefined' || !window.solana) {
    throw new Error('Phantom Wallet is not installed');
  }
  
  try {
    const { solana } = window;
    
    // Request connection
    const connectionResponse = await solana.connect();
    const address = connectionResponse.publicKey.toString();
    
    // Phantom is always on Solana mainnet (chainId = 25)
    const chainId = 25;
    
    // Get balance
    const balanceInLamports = await getSolanaBalance(address);
    const balanceInSol = balanceInLamports / 1e9;
    
    useWalletStore.setState({
      walletState: {
        isConnected: true,
        provider: 'PHANTOM',
        address,
        chainId,
        chainType: 'SOLANA',
        balance: balanceInSol.toFixed(6),
        error: null,
      },
    });
    
    // Set up account change listener
    solana.on('accountChanged', (publicKey: any) => {
      if (publicKey) {
        const address = publicKey.toString();
        useWalletStore.setState((state) => ({
          walletState: {
            ...state.walletState,
            address,
          },
        }));
      } else {
        useWalletStore.getState().disconnectWallet();
      }
    });
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('User rejected')) {
      throw new Error('Connection rejected by user');
    }
    throw error;
  }
}

async function getSolanaBalance(address: string): Promise<number> {
  if (typeof window === 'undefined' || !window.solana) {
    return 0;
  }
  
  try {
    const connection = new (window as any).solana.Connection(
      'https://api.mainnet-beta.solana.com',
      'confirmed'
    );
    const balance = await connection.getBalance(new (window as any).solana.PublicKey(address));
    return balance;
  } catch {
    return 0;
  }
}

// ============================================================================
// Notification Store
// ============================================================================

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      read: false,
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep last 50
    }));
    
    // Auto-remove after duration if specified
    if (notification.duration) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== newNotification.id),
        }));
      }, notification.duration);
    }
  },
  
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
  
  clearAll: () => {
    set({ notifications: [] });
  },
}));

// ============================================================================
// Settings Store
// ============================================================================

interface SettingsState {
  settings: SwapSettings;
  updateSettings: (settings: Partial<SwapSettings>) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: {
    slippage: DEFAULT_SLIPPAGE,
    mixinCount: DEFAULT_MIXIN_COUNT,
    feeLevel: 'average',
  },
  
  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },
  
  resetSettings: () => {
    set({
      settings: {
        slippage: DEFAULT_SLIPPAGE,
        mixinCount: DEFAULT_MIXIN_COUNT,
        feeLevel: 'average',
      },
    });
  },
}));

// Global type augmentation for window.ethereum
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
