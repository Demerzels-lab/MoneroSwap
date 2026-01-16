'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Copy, ShieldCheck, Wallet, Key, Zap, AlertCircle } from 'lucide-react';
import { useWalletStore } from '@/store/useSwapStore';
import { WalletProviderType } from '@/types';
import { WALLET_LINKS, SUPPORTED_CHAINS } from '@/lib/constants';

interface WalletConnectModalProps {
  onClose: () => void;
}

interface WalletOption {
  id: WalletProviderType;
  name: string;
  type: string;
  chainType: 'EVM' | 'SOLANA';
}

const walletOptions: WalletOption[] = [
  {
    id: 'METAMASK',
    name: 'MetaMask',
    type: 'EVM STANDARD',
    chainType: 'EVM',
  },
  {
    id: 'PHANTOM',
    name: 'Phantom',
    type: 'SOLANA SVM',
    chainType: 'SOLANA',
  },
];

export default function WalletConnectModal({ onClose }: WalletConnectModalProps) {
  const { walletState, connectWallet, disconnectWallet } = useWalletStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (walletId: WalletProviderType) => {
    setIsConnecting(true);
    setError(null);
    try {
      await connectWallet(walletId);
      // Optional: Don't close immediately to show "Success" state if you want
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Heavy Blur Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* The "Auth Key" Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-sm bento-card bg-[#050505] shadow-2xl overflow-hidden"
      >
        {/* Header - Security Style */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-obsidian-800">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${walletState.isConnected ? 'bg-emerald-500' : 'bg-white'} animate-pulse`} />
            <h2 className="text-sm font-serif text-white tracking-widest">
              {walletState.isConnected ? 'SESSION ACTIVE' : 'AUTHENTICATE'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-obsidian-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Privacy Disclaimer */}
          {!walletState.isConnected && (
            <div className="mb-6 flex gap-3 p-3 rounded bg-obsidian-900/30 border border-obsidian-800/50">
              <ShieldCheck className="w-4 h-4 text-obsidian-400 mt-0.5 shrink-0" />
              <div className="text-[10px] text-obsidian-400 font-mono leading-relaxed">
                <span className="text-white">NO IDENTITY REQUIRED.</span> Connection is used solely for signing transactions locally. 
                Keys never leave your hardware.
              </div>
            </div>
          )}

          {walletState.isConnected ? (
            /* CONNECTED STATE */
            <div className="space-y-6">
              {/* Identity Card */}
              <div className="relative p-5 rounded-xl border border-obsidian-700 bg-obsidian-900/20 overflow-hidden group">
                {/* Decorative scanning line */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.03] to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000" />
                
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-mono text-obsidian-500 uppercase tracking-widest">Connected via {walletState.provider}</span>
                  <div className="px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-400 font-mono">
                    SECURE
                  </div>
                </div>

                <div className="font-mono text-xl text-white tracking-tight mb-1">
                  {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                   <button 
                    onClick={() => navigator.clipboard.writeText(walletState.address || '')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-obsidian-800 hover:bg-obsidian-700 text-xs font-mono text-white transition-colors"
                   >
                     <Copy className="w-3 h-3" /> COPY ID
                   </button>
                   <a 
                    href="#"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-obsidian-800 hover:border-obsidian-600 text-xs font-mono text-obsidian-400 hover:text-white transition-colors"
                   >
                     <ExternalLink className="w-3 h-3" /> EXPLORER
                   </a>
                </div>
              </div>

              {/* Balance Row */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-obsidian-800 bg-black">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                      <Zap className="w-4 h-4 fill-current" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-obsidian-500 uppercase">Available Balance</span>
                      <span className="text-sm font-mono text-white">
                        {walletState.balance || '0.00'} {walletState.chainType === 'SOLANA' ? 'SOL' : 'ETH'}
                      </span>
                   </div>
                </div>
              </div>

              <button
                onClick={() => {
                  disconnectWallet();
                  onClose();
                }}
                className="w-full btn-secondary py-4 text-xs tracking-widest hover:bg-red-950/30 hover:border-red-900 hover:text-red-400"
              >
                TERMINATE SESSION
              </button>
            </div>
          ) : (
            /* DISCONNECTED STATE */
            <div className="space-y-3">
              {error && (
                <div className="mb-4 p-3 rounded bg-red-900/10 border border-red-900/30 flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-400 font-mono">{error}</span>
                </div>
              )}

              {walletOptions.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleConnect(wallet.id)}
                  disabled={isConnecting}
                  className="w-full group relative flex items-center justify-between p-4 rounded-lg border border-obsidian-800 bg-obsidian-900/20 hover:bg-obsidian-800 hover:border-obsidian-600 transition-all disabled:opacity-50 disabled:cursor-wait"
                >
                  <div className="flex items-center gap-4">
                    {/* Minimalist Icon Placeholder */}
                    <div className={`w-10 h-10 rounded border border-obsidian-700 flex items-center justify-center bg-black group-hover:border-white transition-colors`}>
                      {wallet.id === 'METAMASK' ? (
                        <div className="w-3 h-3 bg-[#F6851B] rotate-45" /> 
                      ) : (
                         <div className="w-3 h-3 bg-[#AB9FF2] rounded-full" />
                      )}
                    </div>
                    
                    <div className="text-left">
                      <div className="font-serif text-white text-lg leading-none group-hover:translate-x-1 transition-transform">
                        {wallet.name}
                      </div>
                      <div className="text-[10px] font-mono text-obsidian-500 mt-1 uppercase tracking-wider">
                        {wallet.type}
                      </div>
                    </div>
                  </div>

                  <Key className="w-4 h-4 text-obsidian-600 group-hover:text-white transition-colors" />
                </button>
              ))}

              {/* Supported Networks Strip */}
              <div className="pt-6 mt-2 border-t border-obsidian-800/50">
                <div className="text-[9px] font-mono text-obsidian-600 uppercase mb-2 text-center">
                  Encrypted Channels
                </div>
                <div className="flex justify-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                  {SUPPORTED_CHAINS.filter(c => c.type !== 'XMR').map(chain => (
                    <div key={chain.id} className="w-6 h-6 rounded-full bg-obsidian-800 border border-obsidian-700 flex items-center justify-center text-[8px] text-white">
                      {chain.name[0]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer Text */}
        <div className="px-6 py-3 bg-obsidian-950 border-t border-obsidian-800 flex justify-between items-center text-[9px] font-mono text-obsidian-600">
          <span>v2.4.0-secure</span>
          <span>E2EE ENABLED</span>
        </div>
      </motion.div>
    </div>
  );
}