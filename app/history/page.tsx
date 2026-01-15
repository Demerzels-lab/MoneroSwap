'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/core/Header';
import Footer from '@/components/core/Footer';
import WalletConnectModal from '@/components/wallet/WalletConnectModal';
import { useWalletStore } from '@/store/useSwapStore';
import { useTransactionStore, Transaction } from '@/store/useTransactionStore';
import { TableRowSkeleton } from '@/components/core/Skeleton';
import { 
  ArrowRightLeft, Calendar, Search, Trash2,
  ExternalLink, Clock, CheckCircle, XCircle, Loader2
} from 'lucide-react';

const statusStyles = {
  completed: { icon: CheckCircle, class: 'status-success' },
  pending: { icon: Loader2, class: 'status-pending' },
  failed: { icon: XCircle, class: 'status-error' },
};

export default function HistoryPage() {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { walletState } = useWalletStore();
  const { transactions, clearHistory } = useTransactionStore();

  const filteredTransactions = transactions.filter((tx: Transaction) => {
    const matchesSearch = tx.fromToken.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.toToken.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.txHash.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all transaction history?')) {
      clearHistory();
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="scanline-overlay" />
      
      <Header 
        onConnectWallet={() => setShowWalletModal(true)} 
        walletConnected={walletState.isConnected}
        walletAddress={walletState.address}
        walletProvider={walletState.provider}
      />

      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-start justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
            <p className="text-gray-400">View and track all your privacy-preserving swaps</p>
          </div>
          {transactions.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-terminal-red hover:bg-obsidian-800 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by token or tx hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'completed', 'pending', 'failed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-mono text-sm capitalize transition-colors ${
                    statusFilter === status 
                      ? 'bg-monero-orange text-white' 
                      : 'bg-obsidian-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card overflow-hidden"
        >
          {transactions.length === 0 ? (
            <div className="p-12 text-center">
              <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Transactions Yet</h3>
              <p className="text-gray-400 mb-6">Your swap history will appear here after you make your first swap</p>
              <Link href="/swap">
                <button className="btn-primary">
                  Start Swapping
                </button>
              </Link>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Matching Transactions</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-6 gap-4 p-4 bg-obsidian-900 text-gray-500 text-sm font-mono border-b border-obsidian-800">
                <div>Date</div>
                <div>From</div>
                <div>To</div>
                <div>Status</div>
                <div>TX Hash</div>
                <div></div>
              </div>
              
              {/* Table Rows */}
              <div className="divide-y divide-obsidian-800">
                {filteredTransactions.map((tx: Transaction, i: number) => {
                  const StatusIcon = statusStyles[tx.status].icon;
                  return (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="grid grid-cols-2 md:grid-cols-6 gap-4 p-4 hover:bg-obsidian-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4 text-gray-600 md:hidden" />
                        <span className="text-sm">{tx.date}</span>
                      </div>
                      <div className="text-white font-mono">
                        {tx.fromAmount} <span className="text-monero-orange">{tx.fromToken}</span>
                      </div>
                      <div className="text-white font-mono">
                        {tx.toAmount} <span className="text-terminal-green">{tx.toToken}</span>
                      </div>
                      <div>
                        <span className={statusStyles[tx.status].class}>
                          <StatusIcon className={`w-4 h-4 ${tx.status === 'pending' ? 'animate-spin' : ''}`} />
                          {tx.status}
                        </span>
                      </div>
                      <div className="text-gray-500 font-mono text-sm">
                        {tx.txHash}
                      </div>
                      <div className="flex justify-end">
                        <button className="p-2 hover:bg-obsidian-700 rounded-lg transition-colors" title="View on explorer">
                          <ExternalLink className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      </main>

      <Footer />

      {showWalletModal && (
        <WalletConnectModal onClose={() => setShowWalletModal(false)} />
      )}
    </div>
  );
}
