'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/core/Header';
import Footer from '@/components/core/Footer';
import WalletConnectModal from '@/components/wallet/WalletConnectModal';
import { useWalletStore } from '@/store/useSwapStore';
import { useTransactionStore, Transaction } from '@/store/useTransactionStore';
import { 
  ArrowRight, Search, Trash2,
  ExternalLink, Clock, Check, X, Loader2, ArrowUpRight, History
} from 'lucide-react';

export default function HistoryPage() {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { walletState } = useWalletStore();
  const { transactions, clearHistory, fetchTransactions, isLoading } = useTransactionStore();

  useEffect(() => {
    fetchTransactions(walletState.address || undefined);
  }, [walletState.address, fetchTransactions]);

  const filteredTransactions = transactions.filter((tx: Transaction) => {
    const matchesSearch = tx.fromToken.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.toToken.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.txHash.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleClearHistory = () => {
    if (confirm('Clear local transaction history?')) {
      clearHistory();
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-background text-white selection:bg-white selection:text-black">
      {/* Background Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <Header 
        onConnectWallet={() => setShowWalletModal(true)} 
        walletConnected={walletState.isConnected}
        walletAddress={walletState.address}
        walletProvider={walletState.provider}
      />

      {/* Main Content - Vertical Rhythm */}
      <main className="flex-1 container mx-auto px-6 pt-32 pb-20 relative z-10 max-w-5xl">
        
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-obsidian-700"></span>
              <span className="text-[10px] font-mono text-obsidian-500 uppercase tracking-widest">Ledger</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">
              Transaction History
            </h1>
          </div>
          
          {/* Actions Bar */}
          <div className="flex items-center gap-4">
            {transactions.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-obsidian-500 hover:text-red-400 hover:bg-red-500/5 rounded transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                CLEAR LOGS
              </button>
            )}
          </div>
        </motion.div>

        {/* Controls: Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bento-card p-2 flex flex-col md:flex-row gap-4 items-center bg-obsidian-950/50 backdrop-blur-md">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-500" />
              <input
                type="text"
                placeholder="Search tx hash or token..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none pl-12 pr-4 py-3 text-sm font-mono text-white placeholder-obsidian-600 focus:ring-0"
              />
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-obsidian-800" />

            {/* Status Tabs */}
            <div className="flex gap-1 p-1 w-full md:w-auto overflow-x-auto">
              {['all', 'completed', 'pending', 'failed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded text-xs font-mono uppercase tracking-wide transition-all whitespace-nowrap ${
                    statusFilter === status 
                      ? 'bg-white text-black' 
                      : 'text-obsidian-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* The Ledger Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bento-card overflow-hidden min-h-[400px] flex flex-col"
        >
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-obsidian-800 bg-obsidian-900/30">
            <div className="col-span-3 text-[10px] font-mono text-obsidian-500 uppercase tracking-widest">Timestamp</div>
            <div className="col-span-5 text-[10px] font-mono text-obsidian-500 uppercase tracking-widest">Route Details</div>
            <div className="col-span-2 text-[10px] font-mono text-obsidian-500 uppercase tracking-widest">Status</div>
            <div className="col-span-2 text-right text-[10px] font-mono text-obsidian-500 uppercase tracking-widest">Explorer</div>
          </div>

          {/* Table Content */}
          <div className="flex-1 bg-surface/30">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center p-12">
                <Loader2 className="w-6 h-6 text-white animate-spin mb-4" />
                <p className="text-xs font-mono text-obsidian-500 uppercase">Synchronizing Ledger...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-obsidian-900 border border-obsidian-800 flex items-center justify-center mb-6">
                  <History className="w-6 h-6 text-obsidian-600" />
                </div>
                <h3 className="text-lg font-serif text-white mb-2">No Records Found</h3>
                <p className="text-sm text-obsidian-400 max-w-xs mx-auto mb-8 font-light">
                  {transactions.length === 0 
                    ? "Your anonymous transaction history will appear here." 
                    : "No transactions match your current filters."}
                </p>
                {transactions.length === 0 && (
                  <Link href="/swap">
                    <button className="btn-primary">
                      Initiate Swap <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y divide-obsidian-800/50">
                {filteredTransactions.map((tx: Transaction) => (
                  <div 
                    key={tx.id}
                    className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Date */}
                    <div className="col-span-3 flex flex-col justify-center">
                      <span className="text-sm font-mono text-white">{tx.date.split(',')[0]}</span>
                      <span className="text-[10px] font-mono text-obsidian-500">{tx.date.split(',')[1]}</span>
                    </div>

                    {/* Route */}
                    <div className="col-span-5">
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="block text-sm font-mono text-white">{tx.fromAmount}</span>
                          <span className="block text-[10px] font-mono text-obsidian-500">{tx.fromToken}</span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-obsidian-600" />
                        <div>
                          <span className="block text-sm font-mono text-white">{tx.toAmount}</span>
                          <span className="block text-[10px] font-mono text-obsidian-500">{tx.toToken}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                       {tx.status === 'completed' && (
                         <span className="status-success">
                           <Check className="w-3 h-3" /> SUCCESS
                         </span>
                       )}
                       {tx.status === 'pending' && (
                         <span className="status-pending">
                           <Loader2 className="w-3 h-3 animate-spin" /> PENDING
                         </span>
                       )}
                       {tx.status === 'failed' && (
                         <span className="status-error">
                           <X className="w-3 h-3" /> FAILED
                         </span>
                       )}
                    </div>

                    {/* Hash Link */}
                    <div className="col-span-2 flex justify-end">
                      <a 
                        href="#" 
                        className="flex items-center gap-2 text-[10px] font-mono text-obsidian-500 hover:text-white transition-colors group-hover:underline decoration-obsidian-700 underline-offset-4"
                      >
                        {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>

      <Footer />

      {showWalletModal && (
        <WalletConnectModal onClose={() => setShowWalletModal(false)} />
      )}
    </div>
  );
}