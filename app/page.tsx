'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/core/Header';
import Footer from '@/components/core/Footer';
import WalletConnectModal from '@/components/wallet/WalletConnectModal';
import { useWalletStore } from '@/store/useSwapStore';
import { 
  ArrowRight, ChevronDown, ChevronUp, 
  Shield, Zap, Lock, Activity, Layers, 
  Cpu, Network, Eye, Key, Terminal,
  Copy, Check, Github, Twitter 
} from 'lucide-react';

// === UI COMPONENTS ===

// 1. Subtle Network Background (The "Connected Nodes" look)
const NetworkBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.15]">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid-net" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" className="fill-white" />
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-net)" />
    </svg>
    {/* Decorative large circles */}
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
    <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-obsidian-800/20 rounded-full blur-3xl" />
  </div>
);

// 2. Scroll Reveal Wrapper
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

// === SECTIONS ===

// Hero: High-End Editorial Style
function HeroSection({ onLaunchApp }: { onLaunchApp: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      <NetworkBackground />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <FadeIn>
          <div className="text-label mb-6">EST. 2026 — DECENTRALIZED PROTOCOL</div>
          <h1 className="text-display max-w-5xl mx-auto mb-8">
            Redefining Liquidity <br />
            <span className="text-obsidian-500">Through Zero-Knowledge</span> <br />
            Atomic Swaps.
          </h1>
          <p className="text-xl text-obsidian-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Combine <span className="text-white font-medium">Monero privacy</span> with 
            <span className="text-white font-medium"> cross-chain execution</span>. 
            Swap between ETH, SOL, and XMR without exposing your identity, wallet, or behavioral fingerprints.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/swap" className="w-full sm:w-auto">
              <button onClick={onLaunchApp} className="btn-primary w-full sm:w-auto">
                Start Swapping <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/docs" className="w-full sm:w-auto">
              <button className="btn-secondary w-full sm:w-auto">
                Read Whitepaper
              </button>
            </Link>
          </div>
        </FadeIn>
        
        {/* Editorial Stats Bar */}
        <FadeIn delay={0.2} className="mt-24 pt-8 border-t border-obsidian-800/50 flex flex-wrap justify-center gap-12 md:gap-24">
          {[
            { label: 'Network Status', value: 'OPERATIONAL' },
            { label: 'Privacy Level', value: 'MAXIMUM' },
            { label: 'Zero Knowledge', value: 'ENABLED' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-label mb-1">{stat.label}</div>
              <div className="font-mono text-sm text-white tracking-widest">{stat.value}</div>
            </div>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}

// Vision: Dark Mode "Manifesto"
function VisionSection() {
  const tenets = [
    { 
      number: '01', 
      title: 'Privacy Precedes Scale', 
      desc: 'Users should not have to trade sovereignty for liquidity. We treat privacy as a fundamental human right, not a feature.' 
    },
    { 
      number: '02', 
      title: 'Execution Must Be Atomic', 
      desc: 'Trust is a vulnerability. Atomic swaps ensure that assets are exchanged simultaneously or not at all.' 
    },
    { 
      number: '03', 
      title: 'Identity is Optional', 
      desc: 'No KYC. No sign-ups. Your wallet address is the only identity you need, and even that is obfuscated.' 
    },
  ];

  return (
    <section className="py-32 bg-background border-y border-obsidian-900">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
        <FadeIn>
          <div className="text-label mb-4">OUR VISION</div>
          <h2 className="text-5xl font-serif text-white leading-tight mb-8">
            The less visible the trader, <br />
            <span className="text-obsidian-500">the stronger the market.</span>
          </h2>
          <p className="text-obsidian-300 text-lg leading-relaxed max-w-md">
            We are building a future where financial intelligence is harvested without 
            compromising the sovereign identity of the originator.
          </p>
        </FadeIn>

        <div className="space-y-12">
          {tenets.map((item, i) => (
            <FadeIn key={item.number} delay={i * 0.1} className="flex gap-6 group">
              <div className="font-mono text-obsidian-600 text-sm mt-1 group-hover:text-white transition-colors">
                {item.number}
              </div>
              <div>
                <h3 className="text-xl text-white mb-2 font-medium group-hover:translate-x-1 transition-transform">
                  {item.title}
                </h3>
                <p className="text-obsidian-400 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// Architecture: The "3 Column" Tech Stack
function ArchitectureSection() {
  return (
    <section className="py-32 bg-obsidian-950">
      <div className="container mx-auto px-6">
        <FadeIn className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Protocol Architecture</h2>
          <p className="text-obsidian-400 max-w-2xl mx-auto">
            A hybrid system combining Monero's ring signatures with high-performance EVM smart contracts.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Layer 0: Privacy */}
          <FadeIn delay={0.1}>
            <div className="bento-card p-8 h-full flex flex-col">
              <div className="w-12 h-12 bg-white text-black rounded-lg flex items-center justify-center mb-8">
                <Eye className="w-6 h-6" />
              </div>
              <div className="text-label mb-2">LAYER 0: OBFUSCATION</div>
              <h3 className="text-2xl font-serif text-white mb-4">Zero-Knowledge Signal Layer</h3>
              <p className="text-obsidian-400 text-sm mb-8 flex-1">
                Cryptographically secure signal extraction from human operators using Ring Signatures.
              </p>
              
              <div className="space-y-3 pt-6 border-t border-obsidian-800">
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian-500 font-mono">Privacy</span>
                  <span className="text-white font-mono">RingCT + Bulletproofs</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian-500 font-mono">Identity</span>
                  <span className="text-white font-mono">Stealth Addresses</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian-500 font-mono">Client</span>
                  <span className="text-white font-mono">WASM / Rust</span>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Layer 1: Settlement */}
          <FadeIn delay={0.2}>
            <div className="bento-card p-8 h-full flex flex-col">
              <div className="w-12 h-12 bg-obsidian-800 text-white rounded-lg flex items-center justify-center mb-8">
                <Network className="w-6 h-6" />
              </div>
              <div className="text-label mb-2">LAYER 1: SETTLEMENT</div>
              <h3 className="text-2xl font-serif text-white mb-4">Atomic Swap Aggregation</h3>
              <p className="text-obsidian-400 text-sm mb-8 flex-1">
                Trustless HTLCs (Hash Time Locked Contracts) ensure assets move only when secrets are revealed.
              </p>
              
              <div className="space-y-3 pt-6 border-t border-obsidian-800">
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian-500 font-mono">Contracts</span>
                  <span className="text-white font-mono">Solidity / Anchor</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian-500 font-mono">Verification</span>
                  <span className="text-white font-mono">On-Chain Proofs</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian-500 font-mono">Liquidity</span>
                  <span className="text-white font-mono">Unified Pools</span>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Layer 2: Execution */}
          <FadeIn delay={0.3}>
            <div className="bento-card p-8 h-full flex flex-col">
              <div className="w-12 h-12 bg-obsidian-800 text-white rounded-lg flex items-center justify-center mb-8">
                <Terminal className="w-6 h-6" />
              </div>
              <div className="text-label mb-2">LAYER 2: EXECUTION</div>
              <h3 className="text-2xl font-serif text-white mb-4">Autonomous Runtime</h3>
              <p className="text-obsidian-400 text-sm mb-8 flex-1">
                High-frequency execution engine with MEV protection and risk guardrails.
              </p>
              
              <div className="space-y-3 pt-6 border-t border-obsidian-800">
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian-500 font-mono">Latency</span>
                  <span className="text-white font-mono">&lt; 50ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian-500 font-mono">Protection</span>
                  <span className="text-white font-mono">Flashbots / Bundlers</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian-500 font-mono">Network</span>
                  <span className="text-white font-mono">Arbitrum / LayerZero</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// Features: "Bento Grid" Style
function FeatureGrid() {
  return (
    <section className="py-32">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <FadeIn delay={0.1} className="lg:col-span-2">
            <div className="bento-card p-8 h-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield className="w-32 h-32" />
              </div>
              <div className="w-10 h-10 rounded-full border border-obsidian-700 flex items-center justify-center mb-6">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-3">Encrypted Intuition</h3>
              <p className="text-obsidian-400 text-sm max-w-sm">
                Humans submit encrypted market intuition without revealing identity. 
                Your alpha remains yours until the moment of execution.
              </p>
            </div>
          </FadeIn>

          {/* Card 2 */}
          <FadeIn delay={0.2}>
            <div className="bento-card p-8 h-full group hover:bg-white hover:text-black transition-colors duration-300">
              <Activity className="w-8 h-8 mb-6 text-obsidian-400 group-hover:text-black" />
              <h3 className="text-xl font-serif mb-2">No KYC</h3>
              <p className="text-sm opacity-70">
                Zero identity verification required. Pure code-based trust.
              </p>
            </div>
          </FadeIn>

          {/* Card 3 */}
          <FadeIn delay={0.3}>
            <div className="bento-card p-8 h-full group hover:bg-white hover:text-black transition-colors duration-300">
              <Cpu className="w-8 h-8 mb-6 text-obsidian-400 group-hover:text-black" />
              <h3 className="text-xl font-serif mb-2">Automated</h3>
              <p className="text-sm opacity-70">
                Smart routing finds the best rates across 7+ chains instantly.
              </p>
            </div>
          </FadeIn>

           {/* Card 4 - Wide */}
           <FadeIn delay={0.4} className="lg:col-span-2">
            <div className="bento-card p-8 h-full flex flex-col justify-center items-start">
              <div className="text-label mb-2">THE MECHANISM</div>
              <h3 className="text-2xl font-serif text-white mb-4">Cryptographically Proven Anonymity</h3>
              <p className="text-obsidian-400 text-sm mb-6 max-w-md">
                Profits flow back through anonymous contribution mechanisms, ensuring that 
                success is rewarded without exposing the winner.
              </p>
              <div className="flex gap-4">
                <div className="px-3 py-1 rounded-full border border-obsidian-800 text-xs font-mono text-obsidian-400">ZK-SNARKS</div>
                <div className="px-3 py-1 rounded-full border border-obsidian-800 text-xs font-mono text-obsidian-400">CIRCOM</div>
                <div className="px-3 py-1 rounded-full border border-obsidian-800 text-xs font-mono text-obsidian-400">SOLIDITY</div>
              </div>
            </div>
          </FadeIn>
           
           {/* Card 5 */}
           <FadeIn delay={0.5} className="lg:col-span-2">
            <div className="bento-card p-8 h-full relative overflow-hidden">
               <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
               <div className="relative z-10 flex items-center justify-between">
                 <div>
                    <h3 className="text-2xl font-serif text-white mb-2">Ready to vanish?</h3>
                    <p className="text-obsidian-400 text-sm">The network is waiting for your signal.</p>
                 </div>
                 <Link href="/swap">
                    <button className="btn-primary rounded-full px-8">Launch App</button>
                 </Link>
               </div>
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
}

// Roadmap: Vertical Layout with Alternating Sides
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
    <section className="py-32 bg-obsidian-950 border-t border-obsidian-900">
      <div className="container mx-auto px-6">
        <FadeIn className="text-center mb-24">
          <div className="text-label mb-4">THE PATH FORWARD</div>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Development Roadmap</h2>
          <p className="text-obsidian-400 max-w-xl mx-auto">
            Our strategic timeline for decentralized privacy and cross-chain dominance.
          </p>
        </FadeIn>

        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-obsidian-800 via-obsidian-500 to-obsidian-800 md:-translate-x-1/2" />

          <div className="space-y-16 md:space-y-24">
            {quarters.map((q, i) => (
              <FadeIn key={q.quarter} delay={i * 0.1} className={`relative flex flex-col md:flex-row gap-8 ${
                i % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}>
                {/* Content Side */}
                <div className="md:w-1/2 flex flex-col pl-12 md:pl-0 md:items-end md:text-right">
                   <div className={`p-8 rounded-2xl border bg-background/50 backdrop-blur-sm w-full max-w-lg ${
                     q.status === 'current' ? 'border-emerald-500/30 shadow-[0_0_30px_-10px_rgba(16,185,129,0.1)]' : 'border-obsidian-800'
                   } ${i % 2 === 0 && 'md:ml-auto'} ${i % 2 !== 0 && 'md:mr-auto'}`}>
                      <div className="flex items-center gap-3 mb-4 md:justify-end">
                        {q.status === 'current' && (
                          <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono tracking-wider border border-emerald-500/20">
                            LIVE
                          </div>
                        )}
                        <span className="text-label text-obsidian-400">{q.quarter}</span>
                      </div>
                      <h3 className="text-2xl font-serif text-white mb-4">{q.title}</h3>
                      <ul className="space-y-3">
                        {q.items.map((item, idx) => (
                          <li key={idx} className={`text-sm flex items-start gap-2 ${
                             i % 2 === 0 ? 'md:flex-row-reverse' : ''
                          }`}>
                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${q.status === 'current' ? 'bg-emerald-500' : 'bg-obsidian-600'}`} />
                            <span className="text-obsidian-300 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                   </div>
                </div>

                {/* Center Node */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-obsidian-950 bg-obsidian-800 flex items-center justify-center z-10">
                   {q.status === 'current' ? (
                     <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                   ) : (
                     <div className="w-2 h-2 rounded-full bg-obsidian-500" />
                   )}
                </div>

                {/* Empty Side for Spacing */}
                <div className="hidden md:block md:w-1/2" />
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Contract Address (CA) Section
function ContractAddressSection() {
  const [copied, setCopied] = useState(false);
  const ca = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // Placeholder CA

  const handleCopy = () => {
    navigator.clipboard.writeText(ca);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 border-t border-obsidian-900 bg-background">
      <div className="container mx-auto px-6 text-center">
        <FadeIn>
          <div className="text-label mb-4">VERIFY INTEGRITY</div>
          <h2 className="text-3xl font-serif text-white mb-8">Official Contract Address</h2>
          
          <div className="max-w-2xl mx-auto p-1 rounded-full bg-gradient-to-r from-obsidian-800 via-obsidian-700 to-obsidian-800">
            <div className="bg-obsidian-950 rounded-full px-4 py-3 flex items-center justify-between gap-4">
              <code className="font-mono text-sm md:text-base text-obsidian-300 truncate pl-4">
                {ca}
              </code>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-obsidian-800 hover:bg-white hover:text-black transition-colors text-xs font-medium"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="mt-4 text-xs text-obsidian-500">
            Always verify the contract address on official channels before interacting.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// Community Section (X & Github)
function CommunitySection() {
  return (
    <section className="py-24 bg-obsidian-950 border-t border-obsidian-900">
      <div className="container mx-auto px-6">
        <FadeIn className="mb-12 text-center">
          <h2 className="text-3xl font-serif text-white mb-4">Join the Network</h2>
          <p className="text-obsidian-400">Contribute to the code or follow the signal.</p>
        </FadeIn>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* GitHub Card */}
          <FadeIn delay={0.1}>
            <a 
              href="https://github.com/Demerzels-lab/MoneroSwap" 
              target="_blank" 
              rel="noreferrer"
              className="group block p-8 rounded-2xl border border-obsidian-800 bg-background hover:bg-white hover:border-white transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-8">
                <Github className="w-8 h-8 text-white group-hover:text-black transition-colors" />
                <ArrowRight className="w-5 h-5 text-obsidian-600 group-hover:text-black -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
              <h3 className="text-xl font-serif text-white group-hover:text-black mb-2 transition-colors">
                Open Source
              </h3>
              <p className="text-obsidian-400 group-hover:text-black/60 text-sm transition-colors">
                Audit our code, contribute to the repo, or fork the protocol. 
                Complete transparency for a private future.
              </p>
            </a>
          </FadeIn>

          {/* X (Twitter) Card */}
          <FadeIn delay={0.2}>
            <a 
              href="#" // Placeholder Link
              target="_blank" 
              rel="noreferrer"
              className="group block p-8 rounded-2xl border border-obsidian-800 bg-background hover:bg-[#1DA1F2] hover:border-[#1DA1F2] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-8">
                <Twitter className="w-8 h-8 text-white transition-colors" />
                <ArrowRight className="w-5 h-5 text-obsidian-600 group-hover:text-white -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2 transition-colors">
                Follow Updates
              </h3>
              <p className="text-obsidian-400 group-hover:text-white/80 text-sm transition-colors">
                Real-time announcements, governance alerts, and community signals.
                Stay ahead of the curve.
              </p>
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// FAQ: Minimal Accordion
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    { q: 'How is this different from Uniswap?', a: 'Uniswap is transparent; everyone sees your trades. MoneroSwap uses Ring Signatures to obfuscate the origin, amount, and destination of every swap.' },
    { q: 'Do I need a Monero wallet?', a: 'No. You can swap directly from your MetaMask (ETH) or Phantom (SOL) wallet. We handle the Monero routing on the backend via atomic swaps.' },
    { q: 'Is there a governance token?', a: 'Not yet. The protocol is currently immutable and governed by code. A DAO structure is planned for Q4 2026.' },
  ];

  return (
    <section className="py-32 border-t border-obsidian-900 bg-background">
      <div className="container mx-auto px-6 max-w-3xl">
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl font-serif text-white mb-4">Common Questions</h2>
        </FadeIn>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="border-b border-obsidian-800 pb-4">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between py-4 text-left hover:text-white transition-colors group"
                >
                  <span className="font-serif text-lg text-obsidian-200 group-hover:text-white">{faq.q}</span>
                  {openIndex === i ? (
                    <ChevronUp className="w-4 h-4 text-white" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-obsidian-600" />
                  )}
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-obsidian-400 text-sm leading-relaxed font-sans max-w-xl">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// === MAIN PAGE ===

export default function HomePage() {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { walletState } = useWalletStore();

  return (
    <div className="min-h-screen flex flex-col bg-background text-white selection:bg-white selection:text-black">
      <Header 
        onConnectWallet={() => setShowWalletModal(true)} 
        walletConnected={walletState.isConnected}
        walletAddress={walletState.address}
        walletProvider={walletState.provider}
      />

      <main className="flex-1">
        <HeroSection onLaunchApp={() => setShowWalletModal(true)} />
        <VisionSection />
        <ArchitectureSection />
        <FeatureGrid />
        
        {/* New Sections Added Here */}
        <RoadmapSection />
        {/* <ContractAddressSection /> */}
        <CommunitySection />
        
        <FAQSection />
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