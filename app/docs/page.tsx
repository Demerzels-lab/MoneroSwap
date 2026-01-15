'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/core/Header';
import Footer from '@/components/core/Footer';
import WalletConnectModal from '@/components/wallet/WalletConnectModal';
import { useWalletStore } from '@/store/useSwapStore';
import { 
  Book, Wallet, Coins, Shield, RefreshCcw, Lock, Code, AlertTriangle,
  ChevronRight, Copy, Check, ExternalLink, Menu, X
} from 'lucide-react';

const sections = [
  { id: 'introduction', title: 'Introduction', icon: Book },
  { id: 'getting-started', title: 'Getting Started', icon: Wallet },
  { id: 'supported-assets', title: 'Supported Assets', icon: Coins },
  { id: 'privacy-technology', title: 'Privacy Technology', icon: Shield },
  { id: 'atomic-swaps', title: 'Atomic Swaps', icon: RefreshCcw },
  { id: 'security', title: 'Security', icon: Lock },
  { id: 'api-reference', title: 'API Reference', icon: Code },
  { id: 'troubleshooting', title: 'Troubleshooting', icon: AlertTriangle },
];

function CodeBlock({ code, language = 'typescript' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden bg-obsidian-950 border border-obsidian-800 my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-obsidian-900 border-b border-obsidian-800">
        <span className="text-xs text-gray-500 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="text-gray-500 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-terminal-green" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="text-gray-300 font-mono">{code}</code>
      </pre>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-obsidian-700">
            {headers.map((h, i) => (
              <th key={i} className="text-left p-3 text-gray-400 font-mono text-sm">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-obsidian-800 hover:bg-obsidian-900/50">
              {row.map((cell, j) => (
                <td key={j} className="p-3 text-gray-300 text-sm font-mono">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DocsPage() {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [activeSection, setActiveSection] = useState('introduction');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { walletState } = useWalletStore();

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
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setSidebarOpen(false);
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

      <div className="flex-1 flex">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-50 p-4 bg-monero-orange rounded-full shadow-lg"
        >
          {sidebarOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>

        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-obsidian-950 border-r border-obsidian-800 overflow-y-auto z-40 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <nav className="p-6">
            <h2 className="text-lg font-bold text-white mb-4">Documentation</h2>
            <ul className="space-y-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-monero-orange/10 text-monero-orange'
                        : 'text-gray-400 hover:text-white hover:bg-obsidian-800'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    {section.title}
                    {activeSection === section.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Introduction */}
            <section id="introduction" className="mb-16">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-bold text-white mb-4">MoneroSwap Documentation</h1>
                <p className="text-gray-400 text-lg mb-6">
                  Complete guide to using MoneroSwap - the privacy-first decentralized exchange.
                </p>
                
                <div className="card p-6 mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">What is MoneroSwap?</h3>
                  <p className="text-gray-400 mb-4">
                    MoneroSwap is a decentralized exchange protocol that enables privacy-preserving atomic swaps 
                    between different cryptocurrencies. By leveraging Monero's proven ring signature technology, 
                    we provide transaction privacy unmatched by traditional DEXs.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-obsidian-800/50 rounded-lg">
                      <Shield className="w-6 h-6 text-monero-orange mb-2" />
                      <h4 className="text-white font-semibold mb-1">Privacy by Default</h4>
                      <p className="text-gray-400 text-sm">Ring signatures and stealth addresses</p>
                    </div>
                    <div className="p-4 bg-obsidian-800/50 rounded-lg">
                      <Coins className="w-6 h-6 text-monero-orange mb-2" />
                      <h4 className="text-white font-semibold mb-1">Multi-Chain</h4>
                      <p className="text-gray-400 text-sm">7+ blockchains and 20+ tokens</p>
                    </div>
                  </div>
                </div>

                <CodeBlock 
                  language="text"
                  code={`Architecture Overview:
+-----------------------------------------------------------+
|                   MoneroSwap Protocol                      |
+--------------+--------------+--------------+---------------+
|   Frontend   |   Privacy    |    Swap      |  Multi-Chain  |
|   Interface  |   Protocol   |    Engine    |    Bridge     |
+--------------+--------------+--------------+---------------+
|   React      |  Ring Sigs   |    HTLC      |     EVM       |
|   Next.js    |  Stealth     |    Atomic    |    Solana     |
|   TailwindCSS|  RingCT      |    Swaps     |    Monero     |
+--------------+--------------+--------------+---------------+`}
                />
              </motion.div>
            </section>

            {/* Getting Started */}
            <section id="getting-started" className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-6">Getting Started</h2>
              
              <div className="space-y-6">
                <div className="card p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Prerequisites</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-terminal-green" /> Chrome, Firefox, Brave, or Edge browser</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-terminal-green" /> MetaMask extension (for EVM chains)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-terminal-green" /> Phantom extension (for Solana)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-terminal-green" /> Sufficient funds for gas fees</li>
                  </ul>
                </div>

                <div className="card p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Quick Start Guide</h3>
                  <ol className="space-y-4">
                    {[
                      { step: '1', title: 'Access MoneroSwap', desc: 'Navigate to moneroswap.io in your browser' },
                      { step: '2', title: 'Connect Wallet', desc: 'Click "Connect Wallet" and select MetaMask or Phantom' },
                      { step: '3', title: 'Select Tokens', desc: 'Choose source and destination tokens, enter amount' },
                      { step: '4', title: 'Review & Confirm', desc: 'Check rate, slippage, and click "Initiate Privacy Swap"' },
                      { step: '5', title: 'Wait for Completion', desc: 'Transaction progresses through privacy protocol stages' },
                    ].map((item) => (
                      <li key={item.step} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-monero-orange/10 text-monero-orange flex items-center justify-center font-mono">{item.step}</span>
                        <div>
                          <h4 className="text-white font-semibold">{item.title}</h4>
                          <p className="text-gray-400 text-sm">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <CodeBlock 
                  language="javascript"
                  code={`// MetaMask connection example
await window.ethereum.request({ 
  method: 'eth_requestAccounts' 
});

// Phantom connection example  
const response = await window.solana.connect();
const publicKey = response.publicKey.toString();`}
                />
              </div>
            </section>

            {/* Supported Assets */}
            <section id="supported-assets" className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-6">Supported Assets</h2>
              
              <h3 className="text-xl font-semibold text-white mb-4">Native Assets</h3>
              <Table 
                headers={['Asset', 'Symbol', 'Chain', 'Decimals']}
                rows={[
                  ['Ethereum', 'ETH', 'Ethereum', '18'],
                  ['Polygon', 'MATIC', 'Polygon', '18'],
                  ['BNB', 'BNB', 'BSC', '18'],
                  ['Solana', 'SOL', 'Solana', '9'],
                  ['Avalanche', 'AVAX', 'Avalanche', '18'],
                  ['Monero', 'XMR', 'Monero', '12'],
                ]}
              />

              <h3 className="text-xl font-semibold text-white mb-4 mt-8">ERC-20 Tokens (Ethereum)</h3>
              <Table 
                headers={['Token', 'Symbol', 'Contract Address']}
                rows={[
                  ['USD Coin', 'USDC', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
                  ['Tether', 'USDT', '0xdAC17F958D2ee523a2206206994597C13D831ec7'],
                  ['Dai', 'DAI', '0x6B175474E89094C44Da98b954EedeAC495271d0F'],
                  ['Chainlink', 'LINK', '0x514910771AF9Ca656af840dff83E8264EcF986CA'],
                  ['Uniswap', 'UNI', '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'],
                  ['Wrapped Bitcoin', 'WBTC', '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'],
                ]}
              />

              <h3 className="text-xl font-semibold text-white mb-4 mt-8">Swap Limits</h3>
              <Table 
                headers={['From', 'To', 'Min Amount', 'Max Amount']}
                rows={[
                  ['XMR', 'ETH', '0.01 XMR', '1,000 XMR'],
                  ['XMR', 'USDC', '1 XMR', '50,000 XMR'],
                  ['ETH', 'XMR', '0.001 ETH', '100 ETH'],
                  ['SOL', 'XMR', '0.1 SOL', '5,000 SOL'],
                ]}
              />
            </section>

            {/* Privacy Technology */}
            <section id="privacy-technology" className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-6">Privacy Technology</h2>
              
              <div className="space-y-6">
                <div className="card p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Ring Signatures</h3>
                  <p className="text-gray-400 mb-4">
                    Ring signatures allow any member of a group to sign. When you swap, your signature 
                    is mixed with 10+ decoys - impossible to determine the real signer.
                  </p>
                  <CodeBlock 
                    language="typescript"
                    code={`interface RingSignature {
  type: 'CLSAG' | 'MLSAG';
  version: number;
  inputs: string[];      // Ring member public keys
  keyImage: string;      // Prevents double-spending
  signatures: string[];  // Cryptographic signatures
  pseudoOuts?: string[]; // Commitment outputs
}`}
                  />
                </div>

                <div className="card p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Stealth Addresses</h3>
                  <p className="text-gray-400 mb-4">
                    Every transaction creates a unique one-time address. Even if you publish your address, 
                    incoming transactions cannot be linked to it.
                  </p>
                  <CodeBlock 
                    language="text"
                    code={`Stealth Address Generation:
P = Hs(aR)G + B

Where:
- Hs = Hash to scalar function
- R = Random value  
- G = Base point
- B = Recipient's public key
- P = Stealth address (published)`}
                  />
                </div>

                <div className="card p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">RingCT</h3>
                  <p className="text-gray-400 mb-4">
                    Transaction amounts are hidden using Pedersen commitments. The network verifies 
                    transactions are valid without knowing actual values.
                  </p>
                  <CodeBlock 
                    language="text"
                    code={`Commitment Structure:
C = aG + bH

Where:
- a = Blinding factor (random)
- b = Amount
- G, H = Generator points
- C = Commitment (published)`}
                  />
                </div>
              </div>
            </section>

            {/* Atomic Swaps */}
            <section id="atomic-swaps" className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-6">Atomic Swaps</h2>
              
              <div className="card p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Hash Time-Locked Contracts</h3>
                <p className="text-gray-400 mb-4">
                  HTLCs enable trustless exchange between parties who don't trust each other.
                </p>
                <CodeBlock 
                  language="solidity"
                  code={`interface IHTLC {
    function lock(
        bytes32 secretHash,
        address recipient,
        uint256 timelock
    ) external payable returns (bytes32 swapId);
    
    function claim(
        bytes32 swapId,
        bytes32 secret
    ) external;
    
    function refund(
        bytes32 swapId
    ) external;
}`}
                />
              </div>

              <h3 className="text-xl font-semibold text-white mb-4">Swap States</h3>
              <Table 
                headers={['State', 'Description']}
                rows={[
                  ['IDLE', 'No active swap'],
                  ['NEGOTIATING', 'Finding counterparty'],
                  ['CREATING_HTLC', 'Generating contracts'],
                  ['LOCKING_FROM', 'Locking source asset'],
                  ['LOCKING_TO', 'Counterparty locking'],
                  ['CLAIMING', 'Revealing secret'],
                  ['COMPLETED', 'Swap successful'],
                  ['REFUNDED', 'Timeout reached'],
                ]}
              />
            </section>

            {/* Security */}
            <section id="security" className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-6">Security</h2>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="card p-6">
                  <Lock className="w-8 h-8 text-terminal-green mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Smart Contract Audits</h3>
                  <p className="text-gray-400 text-sm">
                    Audited by Trail of Bits, OpenZeppelin, and Quantstamp. Reentrancy guards, 
                    overflow protection, and emergency pause functionality.
                  </p>
                </div>
                <div className="card p-6">
                  <Shield className="w-8 h-8 text-terminal-green mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Client-Side Security</h3>
                  <p className="text-gray-400 text-sm">
                    All cryptographic operations run in WASM sandboxes. Private keys never 
                    leave your browser. Memory cleared after operations.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-4 mt-8">Best Practices</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-terminal-green" /> Verify URL: https://moneroswap.io</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-terminal-green" /> Check for HTTPS lock</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-terminal-green" /> Use hardware wallets for large amounts</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-terminal-green" /> Keep software updated</li>
              </ul>
            </section>

            {/* API Reference */}
            <section id="api-reference" className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-6">API Reference</h2>
              
              <div className="space-y-6">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">GET /api/v1/tokens</h3>
                  <p className="text-gray-400 text-sm mb-4">Returns list of supported tokens</p>
                  <CodeBlock 
                    language="json"
                    code={`{
  "tokens": [
    {
      "id": "eth",
      "name": "Ethereum",
      "symbol": "ETH",
      "chainId": 1,
      "decimals": 18
    }
  ]
}`}
                  />
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">GET /api/v1/rate</h3>
                  <p className="text-gray-400 text-sm mb-4">Get exchange rate for a pair</p>
                  <CodeBlock 
                    language="json"
                    code={`// GET /api/v1/rate?from=eth&to=xmr&amount=1

{
  "from": "eth",
  "to": "xmr",
  "inputAmount": "1",
  "outputAmount": "15.234",
  "rate": 15.234,
  "priceImpact": 0.05,
  "fee": 0.003,
  "expiresAt": 1704067200
}`}
                  />
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">POST /api/v1/quote</h3>
                  <p className="text-gray-400 text-sm mb-4">Create a swap quote</p>
                  <CodeBlock 
                    language="json"
                    code={`// Request
{
  "from": "eth",
  "to": "xmr",
  "amount": "1.5",
  "slippage": 1
}

// Response
{
  "quoteId": "q_abc123",
  "inputAmount": "1.5",
  "outputAmount": "22.851",
  "rate": 15.234,
  "fee": "0.0045",
  "expiresAt": 1704067200
}`}
                  />
                </div>
              </div>
            </section>

            {/* Troubleshooting */}
            <section id="troubleshooting" className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-6">Troubleshooting</h2>
              
              <div className="space-y-4">
                {[
                  { issue: 'Wallet Won\'t Connect', solutions: ['Ensure extension is installed', 'Refresh page', 'Check wallet is unlocked', 'Try disconnect/reconnect'] },
                  { issue: 'Transaction Stuck', solutions: ['Check network congestion', 'Verify gas price', 'Wait for confirmation', 'Contact support if >1 hour'] },
                  { issue: 'Swap Failed', solutions: ['Check error message', 'Verify balance', 'Ensure token approval', 'Try higher slippage'] },
                ].map((item) => (
                  <div key={item.issue} className="card p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">{item.issue}</h3>
                    <ol className="space-y-1">
                      {item.solutions.map((s, i) => (
                        <li key={i} className="text-gray-400 text-sm flex items-center gap-2">
                          <span className="text-monero-orange font-mono text-xs">{i + 1}.</span> {s}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-semibold text-white mb-4 mt-8">Error Codes</h3>
              <Table 
                headers={['Code', 'Message', 'Solution']}
                rows={[
                  ['E001', 'Insufficient balance', 'Add more funds'],
                  ['E002', 'Slippage exceeded', 'Increase tolerance'],
                  ['E003', 'Quote expired', 'Get new quote'],
                  ['E004', 'Network error', 'Check connection'],
                  ['E005', 'Wallet rejected', 'Approve in wallet'],
                ]}
              />

              <div className="card p-6 mt-6 border-monero-orange/30">
                <h3 className="text-lg font-semibold text-white mb-2">Need Help?</h3>
                <p className="text-gray-400 text-sm mb-4">Contact our support team:</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <a href="#" className="text-monero-orange hover:underline flex items-center gap-1">Discord <ExternalLink className="w-3 h-3" /></a>
                  <a href="#" className="text-monero-orange hover:underline flex items-center gap-1">Twitter <ExternalLink className="w-3 h-3" /></a>
                  <a href="#" className="text-monero-orange hover:underline">support@moneroswap.io</a>
                </div>
              </div>
            </section>

            <div className="text-center text-gray-500 text-sm">
              <p>Last updated: January 2026 | Version 1.0.0</p>
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {showWalletModal && (
        <WalletConnectModal onClose={() => setShowWalletModal(false)} />
      )}
    </div>
  );
}
