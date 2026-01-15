'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseMoneroNodeReturn {
  isConnected: boolean;
  isLoading: boolean;
  blockHeight: number;
  peers: number;
  error: Error | null;
  latency: number;
}

/**
 * Hook to manage Monero node connection and status
 */
export function useMoneroNode(nodeUrl: string = 'node.xmr.to:18081') {
  const [state, setState] = useState<UseMoneroNodeReturn>({
    isConnected: false,
    isLoading: true,
    blockHeight: 0,
    peers: 0,
    error: null,
    latency: 0,
  });

  useEffect(() => {
    // Simulate node connection for demo
    // In production: Use actual RPC calls to Monero daemon
    const connectToNode = async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate successful connection
        setState({
          isConnected: true,
          isLoading: false,
          blockHeight: 2938200 + Math.floor(Math.random() * 100),
          peers: 15 + Math.floor(Math.random() * 20),
          error: null,
          latency: 45 + Math.floor(Math.random() * 50),
        });
      } catch (error) {
        setState({
          isConnected: false,
          isLoading: false,
          blockHeight: 0,
          peers: 0,
          error: error as Error,
          latency: 0,
        });
      }
    };

    connectToNode();

    // Poll for updates
    const interval = setInterval(async () => {
      try {
        // Simulate periodic sync check
        setState(prev => ({
          ...prev,
          blockHeight: prev.blockHeight + (Math.random() > 0.7 ? 1 : 0),
        }));
      } catch (error) {
        // Silently fail on polling errors
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [nodeUrl]);

  return state;
}

/**
 * Hook to manage wallet connection state
 */
export function useWalletConnection() {
  const [walletState, setWalletState] = useState({
    isConnected: false,
    address: '',
    viewKey: '',
    balance: 0,
    unlockedBalance: 0,
    error: null as Error | null,
  });

  const connect = useCallback(async (type: 'rpc' | 'viewkey' | 'hardware', params: Record<string, string>) => {
    setWalletState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful connection
      setWalletState({
        isConnected: true,
        address: params.address || '4A4Dr...3G2q',
        viewKey: params.viewKey || '',
        balance: 12.5,
        unlockedBalance: 10.2,
        error: null,
      });
    } catch (error) {
      setWalletState(prev => ({
        ...prev,
        isConnected: false,
        error: error as Error,
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: '',
      viewKey: '',
      balance: 0,
      unlockedBalance: 0,
      error: null,
    });
  }, []);

  return {
    ...walletState,
    connect,
    disconnect,
  };
}

/**
 * Hook to track transaction history
 */
export function useTransactionHistory() {
  const [transactions, setTransactions] = useState<Array<{
    id: string;
    type: 'swap_in' | 'swap_out' | 'transfer';
    fromCurrency: string;
    toCurrency: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    timestamp: number;
    txHash?: string;
  }>>([]);

  const addTransaction = useCallback((tx: Omit<typeof transactions[0], 'id' | 'timestamp'>) => {
    const newTx = {
      ...tx,
      id: `tx_${Date.now()}`,
      timestamp: Date.now(),
    };
    setTransactions(prev => [newTx, ...prev]);
  }, []);

  const clearHistory = useCallback(() => {
    setTransactions([]);
  }, []);

  return {
    transactions,
    addTransaction,
    clearHistory,
  };
}
