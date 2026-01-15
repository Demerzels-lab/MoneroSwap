'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/core/Header';
import Footer from '@/components/core/Footer';
import WalletConnectModal from '@/components/wallet/WalletConnectModal';
import { useWalletStore } from '@/store/useSwapStore';
import { 
  Shield, Zap, Globe, Lock, Coins, Code, Wallet, ArrowRight, 
  ChevronDown, ChevronUp, Link2, Eye, EyeOff, Check, Mail,
  Layers, RefreshCcw, Users, Clock
} from 'lucide-react';

// Animation wrapper for scroll reveal
function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Hero Section
function HeroSection({ onLaunchApp }: { onLaunchApp: () => void }) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-monero-orange/15 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-monero-orange/30 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-gradient">Privacy-First</span>
            <br />
            <span className="text-white">Cross-Chain Swaps</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Trustless atomic swaps powered by Monero's ring signature technology. 
            Swap between ETH, SOL, XMR, and 20+ tokens with complete privacy.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Link href="/swap">
              <button onClick={onLaunchApp} className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                Launch App <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/docs">
              <button className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
                Read Documentation
              </button>
            </Link>
          </div>
          
          {/* Stats bar */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {[
              { value: '7+', label: 'Chains Supported' },
              { value: '20+', label: 'Tokens' },
              { value: '0', label: 'KYC Required' },
              { value: '100%', label: 'Privacy' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl font-bold text-monero-orange font-mono">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-gray-500" />
      </motion.div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    { 
      icon: Wallet, 
      title: 'Connect Your Wallet', 
      description: 'Connect MetaMask for EVM chains or Phantom for Solana. Your keys never leave your browser.',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: Coins, 
      title: 'Select Your Tokens', 
      description: 'Choose from 20+ supported tokens across 7 blockchains. Smart routing finds the best rates.',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      icon: Shield, 
      title: 'Privacy Protocol Activates', 
      description: 'Monero\'s ring signatures kick in. Your transaction becomes untraceable and unlinkable.',
      color: 'from-monero-orange to-monero-orangeLight'
    },
    { 
      icon: Zap, 
      title: 'Atomic Swap Executes', 
      description: 'Hash time-locked contracts ensure trustless execution. No middlemen, no custody.',
      color: 'from-terminal-green to-emerald-500'
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How MoneroSwap Works</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Four simple steps to complete privacy-preserving swaps
          </p>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <AnimatedSection key={step.title} delay={i * 0.1}>
              <div className="card p-6 h-full group hover:border-monero-orange/50 transition-all duration-300">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-sm font-mono text-monero-orange mb-2">Step {i + 1}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// Technology Section
function TechnologySection() {
  const techs = [
    { 
      title: 'Ring Signatures',
      icon: Link2,
      description: 'Your signature is grouped with 10+ decoys. Impossible to determine the real sender.',
    },
    { 
      title: 'Stealth Addresses',
      icon: EyeOff,
      description: 'One-time addresses for every transaction. Receiving addresses never appear on blockchain.',
    },
    { 
      title: 'RingCT',
      icon: Eye,
      description: 'Transaction amounts encrypted using Pedersen commitments. Network verifies without seeing values.',
    },
    { 
      title: 'Bulletproofs',
      icon: Zap,
      description: 'Zero-knowledge proofs 80% smaller than predecessors. Fast verification, low fees.',
    },
  ];

  return (
    <section id="technology" className="py-24 relative bg-obsidian-900/50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Problem/Solution */}
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-white mb-4">
              Powered by Monero Privacy Technology
            </h2>
            <p className="text-gray-400 mb-8">
              Understanding the cryptographic innovations that make truly private transactions possible.
            </p>
            
            <div className="space-y-6">
              <div className="card p-6 border-terminal-red/30">
                <h4 className="text-terminal-red font-semibold mb-2">The Problem with Traditional Crypto</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-center gap-2"><span className="text-terminal-red">X</span> Traced: Anyone can follow the flow of funds</li>
                  <li className="flex items-center gap-2"><span className="text-terminal-red">X</span> Linked: Addresses connected to real identities</li>
                  <li className="flex items-center gap-2"><span className="text-terminal-red">X</span> Analyzed: Companies profile your activity</li>
                  <li className="flex items-center gap-2"><span className="text-terminal-red">X</span> Censored: Transactions blocked based on history</li>
                </ul>
              </div>
              
              <div className="card p-6 border-terminal-green/30">
                <h4 className="text-terminal-green font-semibold mb-2">MoneroSwap's Solution</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-terminal-green" /> Encrypted & mixed transactions</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-terminal-green" /> Stealth addresses for recipients</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-terminal-green" /> Hidden amounts via RingCT</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-terminal-green" /> Complete censorship resistance</li>
                </ul>
              </div>
            </div>
          </AnimatedSection>
          
          {/* Right: Tech Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {techs.map((tech, i) => (
              <AnimatedSection key={tech.title} delay={i * 0.1}>
                <div className="card p-5 h-full group hover:border-monero-orange/50 transition-all">
                  <tech.icon className="w-8 h-8 text-monero-orange mb-3" />
                  <h4 className="text-white font-semibold mb-2">{tech.title}</h4>
                  <p className="text-gray-400 text-sm">{tech.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    { icon: Shield, title: 'Privacy First', description: 'Every swap protected by ring signatures, stealth addresses, and encrypted amounts.' },
    { icon: Globe, title: 'Multi-Chain Support', description: 'Swap across Ethereum, Solana, Polygon, BSC, Avalanche, Arbitrum, and Optimism.' },
    { icon: Lock, title: 'No KYC Ever', description: 'No email, no phone, no ID. Just connect your wallet and swap.' },
    { icon: RefreshCcw, title: 'Atomic Swaps', description: 'Trustless HTLCs ensure both parties fulfill obligations. No counterparty risk.' },
    { icon: Coins, title: 'Low Fees', description: 'Optimized smart contracts and efficient routing minimize gas costs.' },
    { icon: Code, title: 'Open Source', description: 'All code is open source and auditable. Trust is verified, not assumed.' },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose MoneroSwap</h2>
          <p className="text-gray-400 text-lg">The most private way to swap crypto assets</p>
        </AnimatedSection>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <AnimatedSection key={feature.title} delay={i * 0.1}>
              <div className="card p-6 h-full group hover:border-monero-orange/50 transition-all">
                <div className="w-12 h-12 rounded-lg bg-monero-orange/10 flex items-center justify-center mb-4 group-hover:bg-monero-orange/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-monero-orange" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// Roadmap Section
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
    <section id="roadmap" className="py-24 bg-obsidian-900/50">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Roadmap 2026</h2>
          <p className="text-gray-400 text-lg">Our journey to becoming the leading privacy-first DEX</p>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quarters.map((q, i) => (
            <AnimatedSection key={q.quarter} delay={i * 0.1}>
              <div className={`card p-6 h-full relative overflow-hidden ${q.status === 'current' ? 'border-monero-orange/50' : ''}`}>
                {q.status === 'current' && (
                  <div className="absolute top-0 right-0 px-2 py-1 bg-monero-orange text-white text-xs font-mono rounded-bl-lg">
                    CURRENT
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-monero-orange" />
                  <span className="font-mono text-monero-orange text-sm">{q.quarter}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{q.title}</h3>
                <ul className="space-y-2">
                  {q.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${q.status === 'current' && j < 3 ? 'bg-terminal-green' : 'bg-gray-600'}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    { q: 'What is MoneroSwap?', a: 'MoneroSwap is a decentralized exchange that enables privacy-preserving atomic swaps between different cryptocurrencies using Monero\'s ring signature technology.' },
    { q: 'How does privacy work?', a: 'We utilize Monero\'s ring signatures to mix your transaction with decoys, making it impossible to trace. Stealth addresses ensure recipient privacy, and RingCT hides amounts.' },
    { q: 'Which wallets are supported?', a: 'Currently MetaMask for all EVM chains (Ethereum, Polygon, BSC, Arbitrum, Optimism, Avalanche) and Phantom for Solana.' },
    { q: 'Is KYC required?', a: 'No. MoneroSwap never requires personal information. No email, no phone, no ID. Just connect your wallet.' },
    { q: 'What tokens can I swap?', a: 'We support 20+ tokens including ETH, SOL, XMR, USDC, USDT, DAI, LINK, UNI, AAVE, WBTC, MATIC, and more.' },
    { q: 'Are swaps instant?', a: 'Most EVM swaps complete in 1-5 minutes. Cross-chain swaps involving Monero may take 10-30 minutes due to confirmations.' },
    { q: 'What are the fees?', a: 'MoneroSwap charges 0.3% swap fee plus standard network gas fees.' },
    { q: 'Is MoneroSwap audited?', a: 'Yes, our smart contracts are audited by leading security firms. Reports are available in documentation.' },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-lg">Everything you need to know about MoneroSwap</p>
        </AnimatedSection>
        
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <div className="card overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-obsidian-800/50 transition-colors"
                >
                  <span className="font-semibold text-white">{faq.q}</span>
                  {openIndex === i ? (
                    <ChevronUp className="w-5 h-5 text-monero-orange flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 text-gray-400">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  const [email, setEmail] = useState('');
  
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-monero-orange/10 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Swap Privately?</h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of users who value their financial privacy
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                placeholder="Enter your email for updates"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-12"
              />
            </div>
            <button className="btn-primary whitespace-nowrap">Subscribe</button>
          </div>
          
          <p className="text-gray-500 text-sm mt-4">
            No spam. Unsubscribe anytime. Your email is never shared.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

// Main Page
export default function HomePage() {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { walletState } = useWalletStore();

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="scanline-overlay" />
      
      <Header 
        onConnectWallet={() => setShowWalletModal(true)} 
        walletConnected={walletState.isConnected}
        walletAddress={walletState.address}
        walletProvider={walletState.provider}
      />

      <main className="flex-1">
        <HeroSection onLaunchApp={() => {}} />
        <HowItWorksSection />
        <TechnologySection />
        <FeaturesSection />
        <RoadmapSection />
        <FAQSection />
        <CTASection />
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
