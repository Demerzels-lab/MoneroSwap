'use client';

import { motion } from 'framer-motion';
import { X, ChevronRight, Info } from 'lucide-react';
import { useSwapStore } from '@/store/useSwapStore';
import { useState } from 'react';

interface SwapSettingsProps {
  slippage: number;
  mixinCount: number;
  onClose: () => void;
}

const slippageOptions = [0.5, 1, 2, 5];
const mixinOptions = [5, 10, 15, 20, 25];

export default function SwapSettings({ 
  slippage: currentSlippage, 
  mixinCount: currentMixin,
  onClose 
}: SwapSettingsProps) {
  const { setSlippage, setMixinCount } = useSwapStore();
  const [slippage, setLocalSlippage] = useState(currentSlippage);
  const [mixin, setLocalMixin] = useState(currentMixin);

  const handleSave = () => {
    setSlippage(slippage);
    setMixinCount(mixin);
    onClose();
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
        className="relative w-full max-w-md card p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Swap Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Slippage Tolerance */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-white">Slippage Tolerance</label>
            <span className="text-sm terminal-text">{slippage}%</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {slippageOptions.map((option) => (
              <button
                key={option}
                onClick={() => setLocalSlippage(option)}
                className={`py-2 px-3 rounded-lg font-mono text-sm transition-all ${
                  slippage === option
                    ? 'bg-monero-orange text-white'
                    : 'bg-obsidian-800 text-gray-400 hover:bg-obsidian-700'
                }`}
              >
                {option}%
              </button>
            ))}
          </div>
          <div className="mt-2">
            <input
              type="number"
              value={slippage}
              onChange={(e) => setLocalSlippage(parseFloat(e.target.value) || 1)}
              step={0.1}
              min={0.1}
              max={50}
              className="w-full px-3 py-2 bg-obsidian-800 border border-obsidian-700 rounded-lg
                       text-white font-mono text-sm focus:outline-none focus:border-monero-orange"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Your transaction will revert if the price changes unfavorably by more than this percentage.
          </p>
        </div>

        {/* Privacy Settings - Only for Monero */}
        <div className="mb-6 p-4 rounded-lg bg-obsidian-800/50 border border-obsidian-700">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded bg-monero-orange/10">
              <svg className="w-4 h-4 text-monero-orange" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <span className="text-sm font-medium text-white">Monero Privacy Settings</span>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-gray-400">Ring Size (Mixin Count)</label>
              <span className="text-sm terminal-text">{mixin} mixins</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {mixinOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setLocalMixin(option)}
                  className={`py-1.5 rounded font-mono text-xs transition-all ${
                    mixin === option
                      ? 'bg-monero-orange text-white'
                      : 'bg-obsidian-900 text-gray-400 hover:bg-obsidian-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Higher mixin count = stronger privacy = larger transaction size
            </p>
          </div>
        </div>

        {/* Advanced Settings Toggle */}
        <div className="mb-6">
          <button className="flex items-center justify-between w-full p-3 rounded-lg bg-obsidian-800/50 border border-obsidian-700 hover:border-obsidian-600 transition-colors">
            <span className="text-sm text-white">Advanced Settings</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Info Box */}
        <div className="mb-6 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 mt-0.5" />
            <p className="text-xs text-gray-400">
              These settings apply to all swaps. Privacy settings only affect Monero transactions.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full btn-primary"
        >
          Save Settings
        </button>
      </motion.div>
    </div>
  );
}
