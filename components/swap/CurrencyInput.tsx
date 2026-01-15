'use client';

import { motion } from 'framer-motion';
import { X, Search, Check } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Currency } from '@/types';

interface CurrencyInputProps {
  currencies: Currency[];
  selected: string;
  excludeId?: string;
  onSelect: (currency: Currency) => void;
  onClose: () => void;
}

export default function CurrencyInput({ 
  currencies, 
  selected, 
  excludeId,
  onSelect, 
  onClose 
}: CurrencyInputProps) {
  const [search, setSearch] = useState('');

  const filteredCurrencies = useMemo(() => {
    return currencies
      .filter(c => {
        // Filter by search
        const matchesSearch = 
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.symbol.toLowerCase().includes(search.toLowerCase());
        
        // Filter excluded currency
        const notExcluded = excludeId ? c.id !== excludeId : true;
        
        return matchesSearch && notExcluded;
      })
      .sort((a, b) => {
        // Sort by native first, then by name
        if (a.isNative && !b.isNative) return -1;
        if (!a.isNative && b.isNative) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [currencies, search, excludeId]);

  // Group currencies by chain type
  const groupedCurrencies = useMemo(() => {
    const groups: Record<string, Currency[]> = {};
    filteredCurrencies.forEach(currency => {
      const chainType = currency.chainType;
      if (!groups[chainType]) {
        groups[chainType] = [];
      }
      groups[chainType].push(currency);
    });
    return groups;
  }, [filteredCurrencies]);

  const getChainLabel = (chainType: string): string => {
    switch (chainType) {
      case 'EVM': return 'Ethereum & EVM Chains';
      case 'SOLANA': return 'Solana';
      case 'XMR': return 'Monero';
      default: return chainType;
    }
  };

  const getChainColor = (chainType: string): string => {
    switch (chainType) {
      case 'EVM': return 'bg-blue-500/20 text-blue-400';
      case 'SOLANA': return 'bg-cyan-500/20 text-cyan-400';
      case 'XMR': return 'bg-monero-orange/20 text-monero-orange';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-sm card p-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Select Currency</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Search */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search currency..."
            className="w-full pl-10 pr-4 py-2 bg-obsidian-800 border border-obsidian-700 rounded-lg
                     text-white placeholder-gray-500 focus:outline-none focus:border-monero-orange"
            autoFocus
          />
        </div>

        {/* Currency List */}
        <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
          {Object.entries(groupedCurrencies).map(([chainType, chainCurrencies]) => (
            <div key={chainType}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getChainColor(chainType)}`}>
                  {getChainLabel(chainType)}
                </span>
                <span className="text-gray-500 text-xs">
                  {chainCurrencies.length} token{chainCurrencies.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="space-y-1">
                {chainCurrencies.map((currency) => (
                  <motion.button
                    key={currency.id}
                    onClick={() => onSelect(currency)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all ${
                      selected === currency.id 
                        ? 'bg-monero-orange/20 border border-monero-orange/30' 
                        : 'bg-obsidian-800/50 border border-transparent hover:bg-obsidian-800'
                    }`}
                  >
                    <span className="text-xl">{currency.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{currency.name}</p>
                        {currency.isNative && (
                          <span className="px-1.5 py-0.5 rounded bg-terminal-green/20 text-terminal-green text-[10px] font-medium">
                            NATIVE
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs">{currency.symbol}</p>
                    </div>
                    {selected === currency.id && (
                      <Check className="w-5 h-5 text-monero-orange" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
          
          {filteredCurrencies.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No currencies found</p>
              <p className="text-gray-600 text-xs mt-1">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-obsidian-800">
          <p className="text-xs text-gray-500 text-center">
            Bridge swaps between different chains supported
          </p>
        </div>
      </motion.div>
    </div>
  );
}
