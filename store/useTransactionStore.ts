import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService, TransactionPayload } from '@/lib/api';

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: string;
  date: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  status: TransactionStatus;
  txHash: string;
}

interface TransactionStore {
  transactions: Transaction[];
  isLoading: boolean;
  lastSyncedAddress: string | null;
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>, walletAddress?: string) => Promise<string>;
  updateTransactionStatus: (id: string, status: TransactionStatus, txHash?: string) => void;
  clearHistory: () => void;
  fetchTransactions: (walletAddress?: string) => Promise<void>;
}

// Helper to generate local ID
const generateLocalId = () => `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper to format date
const formatDate = () => new Date().toISOString().replace('T', ' ').substring(0, 16);

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      isLoading: false,
      lastSyncedAddress: null,
      
      addTransaction: async (tx, walletAddress) => {
        const localId = generateLocalId();
        const date = formatDate();
        
        // Create local transaction immediately for UI responsiveness
        const newTx: Transaction = {
          ...tx,
          id: localId,
          date,
        };
        
        set((state) => ({
          transactions: [newTx, ...state.transactions],
        }));
        
        // Try to sync with server
        try {
          const payload: TransactionPayload = {
            fromToken: tx.fromToken,
            toToken: tx.toToken,
            fromAmount: tx.fromAmount,
            toAmount: tx.toAmount,
            status: tx.status,
            txHash: tx.txHash,
            walletAddress,
          };
          
          const serverTx = await apiService.createTransaction(payload);
          
          if (serverTx) {
            // Update local transaction with server ID
            set((state) => ({
              transactions: state.transactions.map((t) =>
                t.id === localId ? { ...t, id: serverTx.id } : t
              ),
            }));
            return serverTx.id;
          }
        } catch (error) {
          console.error('Failed to sync transaction to server, keeping local:', error);
        }
        
        return localId;
      },
      
      updateTransactionStatus: async (id, status, txHash) => {
        // Update locally first
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id
              ? { ...tx, status, txHash: txHash || tx.txHash }
              : tx
          ),
        }));
        
        // Try to sync with server
        try {
          await apiService.updateTransactionStatus(id, status, txHash);
        } catch (error) {
          console.error('Failed to sync status update to server:', error);
        }
      },
      
      clearHistory: () => {
        set({ transactions: [], lastSyncedAddress: null });
      },
      
      fetchTransactions: async (walletAddress) => {
        set({ isLoading: true });
        
        try {
          const serverTransactions = await apiService.getTransactions(walletAddress);
          
          if (serverTransactions.length > 0) {
            // Merge server transactions with local ones
            const localTxs = get().transactions;
            const serverIds = new Set(serverTransactions.map(t => t.id));
            
            // Keep local transactions that aren't on server (offline-created)
            const localOnlyTxs = localTxs.filter(t => !serverIds.has(t.id) && t.id.startsWith('tx_'));
            
            set({
              transactions: [...localOnlyTxs, ...serverTransactions],
              lastSyncedAddress: walletAddress || null,
            });
          }
        } catch (error) {
          console.error('Failed to fetch transactions from server:', error);
          // Keep local transactions as fallback
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'moneroswap-transactions',
    }
  )
);
