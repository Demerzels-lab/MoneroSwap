'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Activity, Wallet } from 'lucide-react';
import { useWalletStore } from '@/store/useSwapStore';

interface HeaderProps {
  onConnectWallet: () => void;
  walletConnected: boolean;
  walletAddress: string | null;
  walletProvider: string | null;
}

export default function Header({ 
  onConnectWallet, 
  walletConnected, 
  walletAddress 
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Detect scroll to add a subtle border
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Swap', path: '/swap' },
    { name: 'History', path: '/history' },
    { name: 'Docs', path: '/docs' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-md border-b border-obsidian-800' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* 1. LOGO - Editorial Style */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image 
            src="/logo.jpeg" 
            alt="MoneroSwap Logo" 
            width={32} 
            height={32} 
            className="rounded-sm group-hover:scale-95 transition-transform" 
          />
          <div className="flex flex-col">
            <span className="font-serif text-lg text-white leading-none tracking-tight">MoneroSwap</span>
            <span className="font-mono text-[9px] text-obsidian-500 tracking-widest uppercase">Protocol v1.0</span>
          </div>
        </Link>

        {/* 2. DESKTOP NAV - Minimalist & Centered */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                pathname === link.path ? 'text-white' : 'text-obsidian-400 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* 3. RIGHT PANEL - Status & Wallet */}
        <div className="hidden md:flex items-center gap-6">
          {/* Network Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-obsidian-800 bg-obsidian-900/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono text-obsidian-400 uppercase tracking-wider">
              Mainnet
            </span>
          </div>

          {/* Wallet Button - The "Data" Look */}
          {walletConnected && walletAddress ? (
            <button 
              onClick={onConnectWallet}
              className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full border border-obsidian-700 bg-black hover:border-obsidian-500 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-obsidian-800 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-obsidian-500 font-mono uppercase">Connected</span>
                <span className="text-xs text-white font-mono tracking-tight">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            </button>
          ) : (
            <button 
              onClick={onConnectWallet}
              className="btn-primary text-xs py-2.5 px-5 h-10"
            >
              Connect Wallet
            </button>
          )}
        </div>

        {/* 4. MOBILE HAMBURGER */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* 5. MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[60] bg-background md:hidden flex flex-col"
          >
            {/* Mobile Header */}
            <div className="h-20 px-6 flex items-center justify-between border-b border-obsidian-800">
              <span className="font-serif text-xl text-white">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-obsidian-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Links */}
            <div className="flex-1 p-6 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-2xl font-light text-white border-b border-obsidian-800 pb-4"
                >
                  {link.name}
                  <ChevronRight className="w-5 h-5 text-obsidian-600" />
                </Link>
              ))}

              <div className="mt-auto">
                 <button 
                  onClick={() => {
                    onConnectWallet();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full btn-primary py-4 text-lg"
                >
                  {walletConnected ? 'Wallet Connected' : 'Connect Wallet'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}