'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Header from '@/components/core/Header';
import SwapCard from '@/components/swap/SwapCard';
import RingSignatureVisualizer from '@/components/privacy/RingSignatureVisualizer';
import PrivacyInfoPanel from '@/components/privacy/PrivacyInfoPanel';
import Footer from '@/components/core/Footer';
import WalletConnectModal from '@/components/wallet/WalletConnectModal';
import { useMoneroWASM } from '../providers';
import { useWalletStore } from '@/store/useSwapStore';
import { SUPPORTED_CURRENCIES, SUPPORTED_CHAINS } from '@/lib/constants';
import { ShieldCheck, Activity } from 'lucide-react';

// Scroll Reveal Wrapper
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Roadmap: Quarterly Milestones
function RoadmapSection() {
  const quarters = [
    {
      quarter: 'Q1 2026',
      title: 'Foundation',
      status: 'current',
      items: ['Multi-chain swap interface', 'MetaMask & Phantom integration', 'Ring signature visualization', 'Public beta launch', 'Security audit completion'],
    },
    {
      quarter: 'Q2 2026',
      title: 'Expansion',
      status: 'upcoming',
      items: ['Mobile-responsive PWA', 'Hardware wallet support', 'Additional EVM chains', 'Limit order functionality', 'Price alerts'],
    },
    {
      quarter: 'Q3 2026',
      title: 'Integration',
      status: 'upcoming',
      items: ['DEX aggregator integration', 'Cross-chain liquidity pools', 'API for developers', 'Institutional features', 'Advanced privacy options'],
    },
    {
      quarter: 'Q4 2026',
      title: 'Decentralization',
      status: 'upcoming',
      items: ['Governance token launch', 'DAO formation', 'Community voting', 'Revenue sharing', 'Grants program'],
    },
  ];

  return (
    <section className="py-32 border-t border-obsidian-900 bg-background">
      <div className="container mx-auto px-6 max-w-6xl">
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl font-serif text-white mb-4">Development Roadmap</h2>
          <p className="text-obsidian-400 max-w-2xl mx-auto">Our journey toward decentralized, privacy-preserving finance</p>
        </FadeIn>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {quarters.map((q, i) => (
            <FadeIn key={q.quarter} delay={i * 0.1}>
              <div className={`p-6 rounded-none border ${q.status === 'current' ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-obsidian-800 bg-obsidian-950/50'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-2 h-2 rounded-full ${q.status === 'current' ? 'bg-emerald-500' : 'bg-obsidian-600'}`} />
                  <span className="font-mono text-sm text-obsidian-400 uppercase tracking-wider">{q.quarter}</span>
                </div>
                <h3 className="text-xl font-serif text-white mb-4">{q.title}</h3>
                <ul className="space-y-2">
                  {q.items.map((item, j) => (
                    <li key={j} className="text-sm text-obsidian-400 flex items-start gap-2">
                      <div className="w-1 h-1 bg-obsidian-600 rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

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

  // Listen for wallet modal open events from SwapCard
  useEffect(() => {
    const handleOpenWalletModal = () => setShowWalletModal(true);
    window.addEventListener('openWalletModal', handleOpenWalletModal);
    return () => window.removeEventListener('openWalletModal', handleOpenWalletModal);
  }, []);

  const totalCurrencies = SUPPORTED_CURRENCIES.length;
  const totalChains = SUPPORTED_CHAINS.filter(c => c.type !== 'XMR').length;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden text-white selection:bg-white selection:text-black">
      
      {/* Background Texture - Replaces Scanline */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <Header 
        onConnectWallet={() => setShowWalletModal(true)} 
        walletConnected={walletState.isConnected}
        walletAddress={walletState.address}
        walletProvider={walletState.provider}
      />

      {/* Main Container - Added pt-32 for Header clearance and better vertical rhythm */}
      <main className="flex-1 flex flex-col items-center justify-start pt-32 pb-20 px-6 relative z-10">
        
        {/* Editorial Headline Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-mono text-obsidian-500 uppercase tracking-widest">System Operational</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6 tracking-tight">
            Zero-Knowledge <br />
            <span className="text-obsidian-500">Liquidity Layer</span>
          </h1>
          
          <p className="text-obsidian-400 text-lg max-w-xl mx-auto font-light leading-relaxed">
            Cross-chain atomic swaps with mathematical privacy.
            <span className="block mt-2 text-xs font-mono text-obsidian-600 uppercase tracking-wider">
              Ring Signatures • Stealth Addresses • Bulletproofs
            </span>
          </p>
          
          {/* Stats Row - Updated to Bento/Swiss Grid style */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mt-10 border-t border-obsidian-800/50 pt-8">
            <div className="text-center">
              <div className="text-2xl font-serif text-white">{totalCurrencies}+</div>
              <div className="text-[10px] font-mono text-obsidian-500 uppercase tracking-widest mt-1">Assets</div>
            </div>
            <div className="w-px h-8 bg-obsidian-800 hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl font-serif text-white">{totalChains}</div>
              <div className="text-[10px] font-mono text-obsidian-500 uppercase tracking-widest mt-1">Chains</div>
            </div>
            <div className="w-px h-8 bg-obsidian-800 hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl font-serif text-white">0</div>
              <div className="text-[10px] font-mono text-obsidian-500 uppercase tracking-widest mt-1">KYC</div>
            </div>
          </div>
        </motion.div>

        {/* Layout Container: Card + Visualizer */}
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-start justify-center">
          
          {/* Swap Card Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 w-full max-w-lg mx-auto lg:max-w-none"
          >
            {/* FIX: Pass the state setter so the card can trigger the visualizer */}
            <SwapCard onVisualizing={setIsVisualizing} />
          </motion.div>

          {/* Privacy Visualizer Panel - Aligned to side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full lg:w-80 flex-shrink-0"
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

        <RoadmapSection />

        {/* Status Footer - Converted to Bento Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 w-full max-w-4xl"
        >
          <div className="bento-card p-4 bg-obsidian-950/50 backdrop-blur-md border-obsidian-800">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${wasmState.isLoaded ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                  <span className="text-obsidian-400 uppercase tracking-wider">
                    WASM: {wasmState.isLoading ? 'INIT...' : 'READY'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${walletState.isConnected ? 'bg-emerald-500' : 'bg-obsidian-600'}`} />
                  <span className="text-obsidian-400 uppercase tracking-wider">
                    {walletState.isConnected ? 'LINKED' : 'OFFLINE'}
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-4 text-obsidian-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3" />
                  <span>SECURE</span>
                </div>
                <div className="w-px h-3 bg-obsidian-800" />
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3 h-3" />
                  <span>v1.0.4</span>
                </div>
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