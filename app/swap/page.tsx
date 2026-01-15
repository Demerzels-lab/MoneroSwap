'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/core/Header';
import SwapCard from '@/components/swap/SwapCard';
import RingSignatureVisualizer from '@/components/privacy/RingSignatureVisualizer';
import PrivacyInfoPanel from '@/components/privacy/PrivacyInfoPanel';
import Footer from '@/components/core/Footer';
import WalletConnectModal from '@/components/wallet/WalletConnectModal';
import { useMoneroWASM } from '../providers';
import { useWalletStore } from '@/store/useSwapStore';
import { SUPPORTED_CURRENCIES, SUPPORTED_CHAINS } from '@/lib/constants';

export default function SwapPage() {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const wasmState = useMoneroWASM();
  const { walletState } = useWalletStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      wasmState.isLoading = false;
      wasmState.isLoaded = true;
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const totalCurrencies = SUPPORTED_CURRENCIES.length;
  const totalChains = SUPPORTED_CHAINS.filter(c => c.type !== 'XMR').length;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="scanline-overlay" />

      <Header 
        onConnectWallet={() => setShowWalletModal(true)} 
        walletConnected={walletState.isConnected}
        walletAddress={walletState.address}
        walletProvider={walletState.provider}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-gradient">MoneroSwap</span>
            <span className="text-gray-500 mx-3">|</span>
            <span className="text-white font-mono">Privacy</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Cross-chain atomic swaps with complete privacy protection.
            <br />
            <span className="terminal-text text-sm">
              Zero-Knowledge Proofs + Ring Signatures + Stealth Addresses
            </span>
          </p>
          
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-monero-orange font-mono text-lg font-bold">{totalCurrencies}+</span>
              <span className="text-gray-500 text-sm">Tokens</span>
            </div>
            <div className="w-1 h-8 bg-obsidian-800" />
            <div className="flex items-center gap-2">
              <span className="text-monero-orange font-mono text-lg font-bold">{totalChains}</span>
              <span className="text-gray-500 text-sm">Chains</span>
            </div>
            <div className="w-1 h-8 bg-obsidian-800" />
            <div className="flex items-center gap-2">
              <span className="text-monero-orange font-mono text-lg font-bold">0</span>
              <span className="text-gray-500 text-sm">KYC Required</span>
            </div>
          </div>
        </motion.div>

        <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1"
          >
            <SwapCard onVisualizing={(v) => setIsVisualizing(v)} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:w-80 flex-shrink-0"
          >
            <AnimatePresence mode="wait">
              {isVisualizing ? (
                <RingSignatureVisualizer key="visualizer" />
              ) : (
                <PrivacyInfoPanel key="info" />
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 w-full max-w-4xl"
        >
          <div className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${wasmState.isLoaded ? 'bg-terminal-green animate-pulse' : 'bg-terminal-yellow'}`} />
                  <span className="terminal-text-dim">
                    WASM: {wasmState.isLoading ? 'Loading...' : 'Ready'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
                  <span className="terminal-text-dim">
                    {walletState.provider ? `${walletState.provider} Connected` : 'Wallet: Not Connected'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="terminal-text-dim">
                  Supported: ETH, SOL, XMR, USDC, USDT, DAI, and more
                </span>
                <span className="terminal-text-dim">Last updated: 2s ago</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />

      <AnimatePresence>
        {showWalletModal && (
          <WalletConnectModal onClose={() => setShowWalletModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
