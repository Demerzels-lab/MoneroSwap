'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/core/Header';
import Footer from '@/components/core/Footer';
import WalletConnectModal from '@/components/wallet/WalletConnectModal';
import { useWalletStore } from '@/store/useSwapStore';
import { 
  Book, Wallet, Coins, Shield, RefreshCcw, Lock, Code, AlertTriangle,
  ChevronRight, Copy, Check, ExternalLink, Menu, X, Terminal
} from 'lucide-react';

// === DATA & TYPES ===

const sections = [
  { id: 'introduction', title: '00. INTRODUCTION', icon: Book },
  { id: 'getting-started', title: '01. GETTING STARTED', icon: Wallet },
  { id: 'supported-assets', title: '02. ASSET SUPPORT', icon: Coins },
  { id: 'privacy-technology', title: '03. PRIVACY MECHANISM', icon: Shield },
  { id: 'atomic-swaps', title: '04. ATOMIC SWAPS', icon: RefreshCcw },
  { id: 'security', title: '05. SECURITY AUDIT', icon: Lock },
  { id: 'api-reference', title: '06. API REFERENCE', icon: Code },
  { id: 'troubleshooting', title: '07. DIAGNOSTICS', icon: AlertTriangle },
];

// === SUB-COMPONENTS ===

function CodeBlock({ code, language = 'typescript' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative rounded-none border border-obsidian-800 bg-[#050505] my-6 font-mono text-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-obsidian-800 bg-obsidian-950/50">
        <div className="flex items-center gap-2">
           <Terminal className="w-3 h-3 text-obsidian-500" />
           <span className="text-xs text-obsidian-500 uppercase">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-obsidian-500 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <code className="text-obsidian-300 whitespace-pre font-mono text-xs leading-relaxed">
          {code}
        </code>
      </div>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-6 border border-obsidian-800 rounded-none">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-obsidian-800 bg-obsidian-950/30">
            {headers.map((h, i) => (
              <th key={i} className="p-3 font-mono text-xs text-obsidian-500 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-obsidian-800/50 last:border-none hover:bg-white/[0.02] transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="p-3 font-mono text-xs text-obsidian-300">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="text-2xl font-serif text-white mt-16 mb-6 pb-4 border-b border-obsidian-800 flex items-center gap-3">
      {title}
    </h2>
  );
}

function SubHeading({ title }: { title: string }) {
  return (
    <h3 className="text-sm font-mono text-white font-bold uppercase tracking-wide mt-8 mb-4">
      {title}
    </h3>
  );
}

// === MAIN PAGE ===

export default function DocsPage() {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [activeSection, setActiveSection] = useState('introduction');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { walletState } = useWalletStore();

  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => document.getElementById(s.id));
      const scrollPos = window.scrollY + 150;
      
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // Offset for fixed header
      const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setSidebarOpen(false);
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

      <div className="flex-1 flex pt-20">
        
        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-white text-black rounded-full shadow-2xl border border-obsidian-200"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* SIDEBAR NAVIGATION (Sticky) */}
        <aside className={`
          fixed lg:sticky top-20 left-0 h-[calc(100vh-5rem)] w-72 
          bg-background/95 backdrop-blur-xl lg:bg-transparent border-r border-obsidian-800 
          overflow-y-auto z-40 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-8">
            <div className="text-[10px] font-mono text-obsidian-500 uppercase tracking-widest mb-6">Contents</div>
            <ul className="space-y-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center justify-between text-left px-3 py-2 text-xs font-mono tracking-wide transition-all ${
                      activeSection === section.id
                        ? 'text-white border-l-2 border-white pl-4 bg-white/5'
                        : 'text-obsidian-500 hover:text-white border-l-2 border-transparent hover:pl-4'
                    }`}
                  >
                    <span>{section.title}</span>
                    {activeSection === section.id && <ChevronRight className="w-3 h-3" />}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 px-6 lg:px-16 py-12 max-w-5xl">
          
          {/* 00. INTRODUCTION */}
          <section id="introduction">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-[10px] font-mono text-obsidian-500 uppercase tracking-widest mb-2">Protocol Documentation</div>
              <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">MoneroSwap Whitepaper</h1>
              <p className="text-xl text-obsidian-300 font-light leading-relaxed mb-8">
                A technical overview of the decentralized exchange protocol enabling privacy-preserving atomic swaps via Ring Signatures.
              </p>
              
              <div className="bento-card p-6 mb-8 bg-obsidian-950/30">
                <SubHeading title="Abstract" />
                <p className="text-sm text-obsidian-400 mb-6 leading-relaxed">
                  MoneroSwap leverages Monero's proven ring signature technology to provide transaction privacy 
                  unmatched by transparent DEXs. It facilitates trustless exchange between different blockchains 
                  without requiring a centralized intermediary or identity verification.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-obsidian-800 bg-black/50">
                    <Shield className="w-4 h-4 text-white mb-2" />
                    <h4 className="text-xs font-mono text-white mb-1 uppercase">Privacy By Default</h4>
                    <p className="text-[10px] text-obsidian-500 leading-relaxed">
                      Ring signatures, stealth addresses, and confidential transactions obscure origin, destination, and amount.
                    </p>
                  </div>
                  <div className="p-4 border border-obsidian-800 bg-black/50">
                    <Coins className="w-4 h-4 text-white mb-2" />
                    <h4 className="text-xs font-mono text-white mb-1 uppercase">Cross-Chain Execution</h4>
                    <p className="text-[10px] text-obsidian-500 leading-relaxed">
                      Atomic swaps via HTLCs ensure settlement occurs on both chains simultaneously or not at all.
                    </p>
                  </div>
                </div>
              </div>

              <CodeBlock 
                language="ASCII Architecture"
                code={`+-----------------------------------------------------------+
|                   MONEROSWAP PROTOCOL                      |
+--------------+--------------+--------------+---------------+
|   Frontend   |   Privacy    |    Swap      |  Multi-Chain  |
|   Interface  |   Layer      |    Engine    |    Bridge     |
+--------------+--------------+--------------+---------------+
|   React      |  Ring Sigs   |    HTLC      |     EVM       |
|   Next.js    |  Stealth     |    Atomic    |    Solana     |
|   Tailwind   |  RingCT      |    Swaps     |    Monero     |
+--------------+--------------+--------------+---------------+`}
              />
            </motion.div>
          </section>

          {/* 01. GETTING STARTED */}
          <section id="getting-started">
            <SectionHeading title="Getting Started" />
            
            <div className="space-y-6">
              <div className="bento-card p-6">
                <SubHeading title="Prerequisites" />
                <ul className="space-y-3 text-sm text-obsidian-400 font-mono">
                  <li className="flex items-center gap-3">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full" /> 
                    Modern Browser (Chrome, Brave, Firefox)
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full" /> 
                    Wallet Extension (MetaMask for EVM, Phantom for SOL)
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full" /> 
                    Gas Tokens for Network Fees
                  </li>
                </ul>
              </div>

              <div className="bento-card p-6">
                <SubHeading title="Execution Flow" />
                <div className="space-y-4">
                  {[
                    { step: '01', title: 'Connect', desc: 'Authenticate via Web3 Wallet (Zero-Knowledge Auth)' },
                    { step: '02', title: 'Route', desc: 'Select asset pair. The engine calculates the optimal privacy path.' },
                    { step: '03', title: 'Initiate', desc: 'Sign the initial HTLC creation transaction.' },
                    { step: '04', title: 'Settlement', desc: 'Wait for the atomic swap to finalize on both chains.' },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 border-b border-obsidian-800/50 pb-4 last:border-0 last:pb-0">
                      <span className="text-xs font-mono text-white opacity-50">{item.step}</span>
                      <div>
                        <h4 className="text-sm font-serif text-white mb-1">{item.title}</h4>
                        <p className="text-xs text-obsidian-500 font-light">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <CodeBlock 
                language="javascript"
                code={`// Example: Connecting to the Protocol
await window.ethereum.request({ 
  method: 'eth_requestAccounts' 
});

// Initializing the Swap Intent
const swapIntent = await protocol.createIntent({
  from: 'ETH',
  to: 'XMR',
  amount: '1.5'
});`}
              />
            </div>
          </section>

          {/* 02. SUPPORTED ASSETS */}
          <section id="supported-assets">
            <SectionHeading title="Asset Support" />
            
            <SubHeading title="Native Layer 1s" />
            <Table 
              headers={['Asset', 'Symbol', 'Chain ID', 'Precision']}
              rows={[
                ['Ethereum', 'ETH', '1', '18'],
                ['Monero', 'XMR', 'N/A', '12'],
                ['Solana', 'SOL', 'N/A', '9'],
                ['Polygon', 'MATIC', '137', '18'],
                ['Avalanche', 'AVAX', '43114', '18'],
              ]}
            />

            <SubHeading title="ERC-20 Standards" />
            <Table 
              headers={['Token', 'Symbol', 'Contract Hash']}
              rows={[
                ['USD Coin', 'USDC', '0xA0b8...eB48'],
                ['Tether', 'USDT', '0xdAC1...1ec7'],
                ['Dai Stablecoin', 'DAI', '0x6B17...1d0F'],
                ['Wrapped BTC', 'WBTC', '0x2260...bc2C'],
              ]}
            />

            <SubHeading title="Guardrails & Limits" />
            <Table 
              headers={['Route', 'Min Amount', 'Max Amount']}
              rows={[
                ['XMR → ETH', '0.01 XMR', '1,000 XMR'],
                ['XMR → USDC', '1 XMR', '50,000 XMR'],
                ['ETH → XMR', '0.001 ETH', '100 ETH'],
                ['SOL → XMR', '0.1 SOL', '5,000 SOL'],
              ]}
            />
          </section>

          {/* 03. PRIVACY TECHNOLOGY */}
          <section id="privacy-technology">
            <SectionHeading title="Privacy Mechanism" />
            
            <div className="grid gap-6">
              <div className="bento-card p-6">
                <SubHeading title="Ring Signatures" />
                <p className="text-sm text-obsidian-400 mb-4 leading-relaxed">
                  Ring signatures allow any member of a group to sign a transaction. 
                  When a user initiates a swap, their digital signature is cryptographically 
                  mixed with 10+ past transaction outputs (decoys). It becomes computationally 
                  infeasible to determine which key actually signed the transaction.
                </p>
                <CodeBlock 
                  language="typescript"
                  code={`interface RingSignature {
  type: 'CLSAG' | 'MLSAG';
  version: number;
  inputs: string[];      // Decoy Public Keys
  keyImage: string;      // Double-spend prevention
  signatures: string[];  // The mathematical proof
}`}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bento-card p-6">
                   <SubHeading title="Stealth Addresses" />
                   <p className="text-xs text-obsidian-400 leading-relaxed">
                     Every transaction generates a unique one-time destination address. 
                     Even if a user publishes their "Public Address", the blockchain 
                     only records these random stealth addresses, breaking the link between 
                     user identity and transaction history.
                   </p>
                </div>
                <div className="bento-card p-6">
                   <SubHeading title="RingCT (Confidential Transactions)" />
                   <p className="text-xs text-obsidian-400 leading-relaxed">
                     Transaction amounts are hidden using Pedersen Commitments. 
                     Validators can verify that Input Amount equals Output Amount 
                     without ever knowing the actual value being transferred.
                   </p>
                </div>
              </div>
            </div>
          </section>

          {/* 04. ATOMIC SWAPS */}
          <section id="atomic-swaps">
            <SectionHeading title="Atomic Swaps" />
            
            <div className="mb-6">
              <p className="text-sm text-obsidian-400 mb-6 leading-relaxed">
                Hash Time-Locked Contracts (HTLCs) enable trustless exchange. 
                Funds are locked cryptographically and can only be released if the 
                recipient reveals a secret preimage within a specific timeframe.
              </p>
              <CodeBlock 
                language="solidity"
                code={`interface IHTLC {
    // Locks funds with a hash of the secret
    function lock(bytes32 secretHash, address recipient, uint256 timelock) 
        external payable returns (bytes32 swapId);
    
    // Releases funds if secret is provided
    function claim(bytes32 swapId, bytes32 secret) external;
    
    // Returns funds if time expires
    function refund(bytes32 swapId) external;
}`}
              />
            </div>

            <SubHeading title="State Machine" />
            <Table 
              headers={['State', 'Description']}
              rows={[
                ['IDLE', 'System waiting for intent'],
                ['NEGOTIATING', 'Matching with market maker'],
                ['CREATING_HTLC', 'Deploying contract to chain'],
                ['LOCKING_FUNDS', 'Assets deposited in escrow'],
                ['CLAIMING', 'Secret revealed, funds released'],
                ['COMPLETED', 'Settlement finalized'],
                ['REFUNDED', 'Timelock expired, funds returned'],
              ]}
            />
          </section>

          {/* 05. SECURITY */}
          <section id="security">
            <SectionHeading title="Security Audit" />
            
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="bento-card p-6 border-l-2 border-l-emerald-500">
                <Lock className="w-5 h-5 text-white mb-3" />
                <h3 className="text-sm font-serif text-white mb-2">Smart Contract Integrity</h3>
                <p className="text-xs text-obsidian-400 leading-relaxed">
                  Contracts audited by Trail of Bits and OpenZeppelin. 
                  Implementation includes Reentrancy Guards, Overflow Protection, 
                  and Emergency Pause functionality managed by a multi-sig.
                </p>
              </div>
              <div className="bento-card p-6 border-l-2 border-l-emerald-500">
                <Shield className="w-5 h-5 text-white mb-3" />
                <h3 className="text-sm font-serif text-white mb-2">Client-Side Isolation</h3>
                <p className="text-xs text-obsidian-400 leading-relaxed">
                  Cryptographic operations (signing, key generation) run in 
                  ephemeral WASM sandboxes. Private keys exist only in browser memory 
                  and are zeroed out immediately after use.
                </p>
              </div>
            </div>

            <SubHeading title="Verification Protocols" />
            <ul className="space-y-3 mt-4 text-xs font-mono text-obsidian-400">
               <li className="flex items-center gap-2">
                 <Check className="w-3 h-3 text-emerald-500" />
                 <span>Verify SSL Certificate (moneroswap.io)</span>
               </li>
               <li className="flex items-center gap-2">
                 <Check className="w-3 h-3 text-emerald-500" />
                 <span>Use Hardware Wallets for amounts {'>'} $1,000</span>
               </li>
               <li className="flex items-center gap-2">
                 <Check className="w-3 h-3 text-emerald-500" />
                 <span>Verify Contract Addresses against Documentation</span>
               </li>
            </ul>
          </section>

          {/* 06. API REFERENCE */}
          <section id="api-reference">
            <SectionHeading title="API Reference" />
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-mono border border-emerald-500/20">GET</span>
                   <span className="text-sm font-mono text-white">/api/v1/rate</span>
                </div>
                <p className="text-xs text-obsidian-500 mb-2">Fetch real-time atomic swap rates.</p>
                <CodeBlock 
                  language="json"
                  code={`{
  "pair": "ETH-XMR",
  "rate": 15.234,
  "fee": 0.003,
  "slippage": 0.01,
  "expiresAt": 1704067200
}`}
                />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                   <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-mono border border-blue-500/20">POST</span>
                   <span className="text-sm font-mono text-white">/api/v1/quote</span>
                </div>
                <p className="text-xs text-obsidian-500 mb-2">Request a firm quote for execution.</p>
                <CodeBlock 
                  language="json"
                  code={`// Request Payload
{
  "from": "eth",
  "to": "xmr",
  "amount": "1.5",
  "slippage": 1
}`}
                />
              </div>
            </div>
          </section>

          {/* 07. TROUBLESHOOTING */}
          <section id="troubleshooting">
            <SectionHeading title="Diagnostics" />
            
            <div className="space-y-4 mb-8">
              {[
                { issue: 'Connection Failure', fix: 'Verify wallet extension is active and unlocked. Check network allowlist.' },
                { issue: 'Stuck in "LOCKING"', fix: 'Chain congestion detected. Wait for block confirmations (usually 2-10 mins).' },
                { issue: 'High Slippage', fix: 'Liquidity pools may be volatile. Increase slippage tolerance in settings.' },
              ].map((item, i) => (
                <div key={i} className="bento-card p-4 flex gap-4">
                  <span className="text-xs font-mono text-obsidian-600">E{i+1}0</span>
                  <div>
                    <h4 className="text-sm font-serif text-white mb-1">{item.issue}</h4>
                    <p className="text-xs text-obsidian-400">{item.fix}</p>
                  </div>
                </div>
              ))}
            </div>

            <SubHeading title="Support Channels" />
            <div className="flex gap-4 text-xs font-mono mt-4">
               <a href="#" className="flex items-center gap-2 text-obsidian-400 hover:text-white transition-colors">
                 <ExternalLink className="w-3 h-3" /> DISCORD
               </a>
               <a href="#" className="flex items-center gap-2 text-obsidian-400 hover:text-white transition-colors">
                 <ExternalLink className="w-3 h-3" /> TELEGRAM
               </a>
               <a href="mailto:dev@moneroswap.io" className="flex items-center gap-2 text-obsidian-400 hover:text-white transition-colors">
                 <ExternalLink className="w-3 h-3" /> EMAIL
               </a>
            </div>
          </section>

          <div className="mt-20 pt-8 border-t border-obsidian-800 text-center">
            <p className="text-[10px] font-mono text-obsidian-600 uppercase">
              Last Updated: JAN 2026 | Protocol Version 1.0.4
            </p>
          </div>

        </main>
      </div>

      <Footer />

      <AnimatePresence>
        {showWalletModal && (
          <WalletConnectModal onClose={() => setShowWalletModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}