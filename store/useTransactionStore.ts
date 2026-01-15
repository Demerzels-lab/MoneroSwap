import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => string;
  updateTransactionStatus: (id: string, status: TransactionStatus, txHash?: string) => void;
  clearHistory: () => void;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      
      addTransaction: (tx) => {
        const id = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newTx: Transaction = {
          ...tx,
          id,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
        
        set((state) => ({
          transactions: [newTx, ...state.transactions],
        }));
        
        return id;
      },
      
      updateTransactionStatus: (id, status, txHash) => {
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id
              ? { ...tx, status, txHash: txHash || tx.txHash }
              : tx
          ),
        }));
      },
      
      clearHistory: () => {
        set({ transactions: [] });
      },
    }),
    {
      name: 'moneroswap-transactions',
    }
  )
);
