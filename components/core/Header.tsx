'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Settings, 
  Wallet, 
  Menu, 
  X, 
  Activity,
  ExternalLink
} from 'lucide-react';

interface HeaderProps {
  onConnectWallet: () => void;
  walletConnected?: boolean;
  walletAddress?: string | null;
  walletProvider?: string | null;
}

export default function Header({ 
  onConnectWallet, 
  walletConnected = false, 
  walletAddress,
  walletProvider 
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formatAddress = (address: string | null | undefined): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-obsidian-800 bg-obsidian-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-monero-orange to-monero-orangeDark flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg text-white">MoneroSwap</span>
                <span className="text-xs text-monero-orange font-mono ml-2">DEX</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/swap" className="nav-link">
              Swap
            </Link>
            <Link href="/history" className="nav-link">
              History
            </Link>
            <Link href="/docs" className="nav-link">
              Docs
            </Link>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="nav-link flex items-center gap-1"
            >
              GitHub
              <ExternalLink className="w-3 h-3" />
            </a>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Network Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-obsidian-800">
              <Activity className="w-4 h-4 text-terminal-green" />
              <span className="text-xs terminal-text">Multi-Chain</span>
            </div>

            {/* Settings Button */}
            <button className="p-2 rounded-lg hover:bg-obsidian-800 transition-colors">
              <Settings className="w-5 h-5 text-gray-400" />
            </button>

            {/* Connect Wallet Button */}
            <button
              onClick={onConnectWallet}
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                walletConnected 
                  ? 'bg-terminal-green/10 border border-terminal-green/30 text-terminal-green'
                  : 'bg-monero-orange/10 border border-monero-orange/30 text-monero-orange hover:bg-monero-orange/20'
              }`}
            >
              <Wallet className="w-4 h-4" />
              {walletConnected && walletProvider ? (
                <span>{walletProvider} • {formatAddress(walletAddress)}</span>
              ) : (
                'Connect Wallet'
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-obsidian-800 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-400" />
              ) : (
                <Menu className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-obsidian-800"
            >
              <nav className="flex flex-col gap-2">
                <Link 
                  href="/swap" 
                  className="px-4 py-2 rounded-lg hover:bg-obsidian-800 text-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Swap
                </Link>
                <Link 
                  href="/history" 
                  className="px-4 py-2 rounded-lg hover:bg-obsidian-800 text-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  History
                </Link>
                <Link 
                  href="/docs" 
                  className="px-4 py-2 rounded-lg hover:bg-obsidian-800 text-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Docs
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onConnectWallet();
                  }}
                  className={`flex items-center gap-2 px-4 py-2 mt-2 rounded-lg font-mono text-sm ${
                    walletConnected 
                      ? 'bg-terminal-green/10 border border-terminal-green/30 text-terminal-green'
                      : 'bg-monero-orange/10 border border-monero-orange/30 text-monero-orange'
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  {walletConnected && walletProvider ? (
                    <span>{walletProvider} • {formatAddress(walletAddress)}</span>
                  ) : (
                    'Connect Wallet'
                  )}
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
