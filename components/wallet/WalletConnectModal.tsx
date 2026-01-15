'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Copy, Check, Wallet, Shield } from 'lucide-react';
import { useWalletStore } from '@/store/useSwapStore';
import { WalletProviderType } from '@/types';
import { isEvmChain, isSolanaChain, WALLET_LINKS, SUPPORTED_CHAINS } from '@/lib/constants';

interface WalletConnectModalProps {
  onClose: () => void;
}

interface WalletOption {
  id: WalletProviderType;
  name: string;
  icon: React.ReactNode;
  description: string;
  connection: string;
  chainType: 'EVM' | 'SOLANA' | 'BOTH';
}

const walletOptions: WalletOption[] = [
  {
    id: 'METAMASK',
    name: 'MetaMask',
    icon: (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
        MM
      </div>
    ),
    description: 'Connect Ethereum, BSC, Polygon, and other EVM chains',
    connection: 'Browser Extension / Mobile App',
    chainType: 'EVM',
  },
  {
    id: 'PHANTOM',
    name: 'Phantom',
    icon: (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm">
        👻
      </div>
    ),
    description: 'Connect Solana and Solana-based tokens',
    connection: 'Browser Extension / Mobile App',
    chainType: 'SOLANA',
  },
];

export default function WalletConnectModal({ onClose }: WalletConnectModalProps) {
  const { walletState, connectWallet, disconnectWallet } = useWalletStore();
  const [selectedWallet, setSelectedWallet] = useState<WalletProviderType | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (walletId: WalletProviderType) => {
    setSelectedWallet(walletId);
    setIsConnecting(true);
    setError(null);

    try {
      await connectWallet(walletId);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md card p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Wallet className="w-6 h-6 text-monero-orange" />
            <h2 className="text-xl font-bold text-white">
              {walletState.isConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Privacy Notice */}
        <div className="mb-6 p-4 rounded-lg bg-terminal-green/5 border border-terminal-green/20">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-terminal-green mt-0.5" />
            <div>
              <p className="text-terminal-green font-medium text-sm">Secure Connection</p>
              <p className="text-gray-400 text-xs mt-1">
                Your wallet connects directly to the blockchain. We never have access to your private keys or funds.
              </p>
            </div>
          </div>
        </div>

        {/* Connected Wallet Info */}
        {walletState.isConnected ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-obsidian-800/50 border border-obsidian-700">
              <div className="flex items-center gap-3 mb-4">
                {walletState.provider === 'METAMASK' ? (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                    MM
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm">
                    👻
                  </div>
                )}
                <div>
                  <p className="text-white font-medium">{walletState.provider}</p>
                  <p className="text-gray-400 text-xs capitalize">
                    {walletState.chainType?.toLowerCase()} network
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="p-3 rounded-lg bg-obsidian-900 border border-obsidian-700">
                <p className="text-gray-500 text-xs mb-1">Connected Address</p>
                <div className="flex items-center gap-2">
                  <code className="text-white font-mono text-sm flex-1 truncate">
                    {walletState.address?.slice(0, 10)}...{walletState.address?.slice(-8)}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(walletState.address || '')}
                    className="p-1.5 rounded hover:bg-obsidian-700 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Balance */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-gray-500 text-sm">Balance</span>
                <span className="text-white font-mono">
                  {walletState.balance} {walletState.chainType === 'SOLANA' ? 'SOL' : 'ETH'}
                </span>
              </div>
            </div>

            {/* Disconnect Button */}
            <button
              onClick={handleDisconnect}
              className="w-full btn-secondary py-3"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <>
            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Wallet Options Grid */}
            <div className="grid grid-cols-1 gap-3">
              {walletOptions.map((wallet) => {
                const isSelected = selectedWallet === wallet.id;
                const isConnectingWallet = isConnecting && selectedWallet === wallet.id;

                return (
                  <motion.button
                    key={wallet.id}
                    onClick={() => handleConnect(wallet.id)}
                    disabled={isConnecting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-4 p-4 rounded-xl bg-obsidian-800/50 border transition-all group text-left
                      ${isSelected ? 'border-monero-orange/50 bg-monero-orange/5' : 'border-obsidian-700 hover:border-monero-orange/50'}
                      ${isConnectingWallet ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex-shrink-0">
                      {wallet.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{wallet.name}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                          wallet.chainType === 'EVM' 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {wallet.chainType}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm truncate">{wallet.description}</p>
                      <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                        {wallet.connection}
                      </p>
                    </div>
                    {isConnectingWallet ? (
                      <div className="w-5 h-5 border-2 border-monero-orange border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-monero-orange transition-colors" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Supported Chains Info */}
            <div className="mt-6 p-4 rounded-lg bg-obsidian-800/30 border border-obsidian-700">
              <p className="text-gray-400 text-xs mb-3">Supported Networks</p>
              <div className="flex flex-wrap gap-2">
                {SUPPORTED_CHAINS.filter(c => c.type !== 'XMR').map((chain) => (
                  <span
                    key={chain.id}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      chain.type === 'EVM'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-cyan-500/20 text-cyan-400'
                    }`}
                  >
                    {chain.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-obsidian-800">
              <p className="text-center text-gray-500 text-sm">
                Don&apos;t have a wallet?{' '}
                <a
                  href={WALLET_LINKS.METAMASK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-monero-orange hover:underline inline-flex items-center gap-1"
                >
                  Get MetaMask
                  <ExternalLink className="w-3 h-3" />
                </a>
                {' '}or{' '}
                <a
                  href={WALLET_LINKS.PHANTOM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-monero-orange hover:underline inline-flex items-center gap-1"
                >
                  Get Phantom
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
