'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowDown, 
  RefreshCw, 
  Settings, 
  Shield, 
  Zap, 
  Lock,
  ChevronDown,
  AlertTriangle,
  Wallet,
  ExternalLink
} from 'lucide-react';
import { useSwapStore, useWalletStore } from '@/store/useSwapStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { SUPPORTED_CURRENCIES, SUPPORTED_SWAP_PAIRS, isSwapPairSupported, getSwapLimits } from '@/lib/constants';
import CurrencyInput from './CurrencyInput';
import SwapButton from './SwapButton';
import SwapSettings from './SwapSettings';
import { useExchangeRate } from '@/hooks/useExchangeRate';

interface SwapCardProps {
  onVisualizing: (v: boolean) => void;
}

export default function SwapCard({ onVisualizing }: SwapCardProps) {
  const {
    fromCurrencyId,
    toCurrencyId,
    fromAmount,
    toAmount,
    slippage,
    mixinCount,
    setFromCurrency,
    setToCurrency,
    setFromAmount,
    setToAmount,
    swapDirection,
  } = useSwapStore();

  const { walletState, walletState: { isConnected, address, chainType } } = useWalletStore();
  const { addTransaction, updateTransactionStatus } = useTransactionStore();

  const [showSettings, setShowSettings] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showCurrencySelect, setShowCurrencySelect] = useState<'from' | 'to' | null>(null);
  const [swapStage, setSwapStage] = useState<'idle' | 'preparing' | 'signing' | 'broadcasting' | 'complete'>('idle');

  // Get currency objects
  const fromCurrency = useMemo(() => 
    SUPPORTED_CURRENCIES.find(c => c.id === fromCurrencyId), 
    [fromCurrencyId]
  );
  const toCurrency = useMemo(() => 
    SUPPORTED_CURRENCIES.find(c => c.id === toCurrencyId), 
    [toCurrencyId]
  );

  // Get exchange rate from API with fallback
  const { rate, isLoading: isRateLoading } = useExchangeRate(fromCurrencyId, toCurrencyId);

  // Auto-calculate output amount
  useEffect(() => {
    if (fromAmount && fromCurrencyId !== toCurrencyId && isSwapPairSupported(fromCurrencyId, toCurrencyId)) {
      setIsCalculating(true);
      const timeout = setTimeout(() => {
        const parsedAmount = parseFloat(fromAmount);
        if (!isNaN(parsedAmount)) {
          const calculatedAmount = parsedAmount * rate;
          setToAmount(calculatedAmount < 0.0001 ? calculatedAmount.toExponential(4) : calculatedAmount.toFixed(6));
        } else {
          setToAmount('');
        }
        setIsCalculating(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [fromAmount, fromCurrencyId, toCurrencyId, rate, setToAmount]);

  const handleSwapDirection = () => {
    // Swap currencies in store
    setFromCurrency(toCurrencyId);
    setToCurrency(fromCurrencyId);
  };

  const handleInitiateSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;
    if (!fromCurrency || !toCurrency) return;
    
    // Generate transaction hash
    const txHash = `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`;
    
    // Add pending transaction to history (with wallet address for API sync)
    const txId = await addTransaction({
      fromToken: fromCurrency.symbol,
      toToken: toCurrency.symbol,
      fromAmount: fromAmount,
      toAmount: toAmount || '0',
      status: 'pending',
      txHash,
    }, address || undefined);
    
    setSwapStage('preparing');
    onVisualizing(true);
    
    try {
      // Simulate privacy operations
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSwapStage('signing');
      await new Promise(resolve => setTimeout(resolve, 3000));
      setSwapStage('broadcasting');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSwapStage('complete');
      
      // Update transaction to completed
      updateTransactionStatus(txId, 'completed');
      
      // Reset after showing completion
      setTimeout(() => {
        setSwapStage('idle');
        onVisualizing(false);
        setFromAmount('');
        setToAmount('');
      }, 3000);
    } catch (error) {
      // Update transaction to failed on error
      updateTransactionStatus(txId, 'failed');
      setSwapStage('idle');
      onVisualizing(false);
    }
  };

  // Check if swap is ready
  const isSwapReady = useMemo(() => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return false;
    if (fromCurrencyId === toCurrencyId) return false;
    return isSwapPairSupported(fromCurrencyId, toCurrencyId);
  }, [fromAmount, fromCurrencyId, toCurrencyId]);

  // Get swap limits
  const limits = useMemo(() => 
    getSwapLimits(fromCurrencyId, toCurrencyId), 
    [fromCurrencyId, toCurrencyId]
  );

  // Format currency for display
  const formatCurrencyDisplay = (currencyId: string) => {
    const currency = SUPPORTED_CURRENCIES.find(c => c.id === currencyId);
    if (!currency) return { icon: '?', name: 'Unknown', symbol: currencyId.toUpperCase() };
    return {
      icon: currency.icon,
      name: currency.name,
      symbol: currency.symbol,
      chainType: currency.chainType,
    };
  };

  const fromDisplay = formatCurrencyDisplay(fromCurrencyId);
  const toDisplay = formatCurrencyDisplay(toCurrencyId);

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-monero-orange" />
          <span className="font-semibold text-white">Privacy Swap</span>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-lg hover:bg-obsidian-800 transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Wallet Connection Banner */}
      {!isConnected && (
        <div className="mb-4 p-3 rounded-lg bg-obsidian-800/50 border border-obsidian-700">
          <div className="flex items-center gap-3">
            <Wallet className="w-5 h-5 text-monero-orange" />
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Connect your wallet</p>
              <p className="text-gray-500 text-xs">Connect MetaMask or Phantom to start swapping</p>
            </div>
          </div>
        </div>
      )}

      {/* From Currency */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">You pay</span>
          <span className="text-xs text-gray-500">
            Balance: {walletState.balance || '0.00'} {fromDisplay.symbol}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCurrencySelect('from')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-obsidian-800 border border-obsidian-700 
                     hover:border-monero-orange/50 transition-colors min-w-[120px]"
          >
            <span className="text-xl">{fromDisplay.icon}</span>
            <div className="flex flex-col items-start">
              <span className="font-semibold text-white">{fromDisplay.symbol}</span>
              <span className="text-[10px] text-gray-500">{fromDisplay.name}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
          </button>
          <input
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 bg-transparent text-2xl font-mono text-white placeholder-gray-600 
                     focus:outline-none text-right"
          />
        </div>
      </div>

      {/* Swap Direction Button */}
      <div className="flex justify-center -my-3 relative z-10">
        <button
          onClick={handleSwapDirection}
          className="p-2 rounded-full bg-obsidian-800 border border-obsidian-700 hover:border-monero-orange 
                   transition-all shadow-lg hover:shadow-monero-orange/20 group"
        >
          <ArrowDown className="w-5 h-5 text-gray-400 group-hover:text-monero-orange transition-colors" />
        </button>
      </div>

      {/* To Currency */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">You receive</span>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Rate:</span>
            <span className="terminal-text">1 {fromDisplay.symbol} ≈ {rate.toFixed(6)} {toDisplay.symbol}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCurrencySelect('to')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-obsidian-800 border border-obsidian-700 
                     hover:border-monero-orange/50 transition-colors min-w-[120px]"
          >
            <span className="text-xl">{toDisplay.icon}</span>
            <div className="flex flex-col items-start">
              <span className="font-semibold text-white">{toDisplay.symbol}</span>
              <span className="text-[10px] text-gray-500">{toDisplay.name}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
          </button>
          <div className="flex-1 flex items-center justify-end gap-2">
            <span className="text-2xl font-mono text-white">
              {isCalculating ? (
                <RefreshCw className="w-6 h-6 animate-spin text-gray-500" />
              ) : (
                toAmount || '0.00'
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Limits Warning */}
      {limits && fromAmount && parseFloat(fromAmount) > 0 && (
        (parseFloat(fromAmount) < limits.minAmount || parseFloat(fromAmount) > limits.maxAmount) && (
          <div className="mt-3 p-2 rounded-lg bg-terminal-yellow/10 border border-terminal-yellow/20">
            <p className="text-terminal-yellow text-xs">
              Amount must be between {limits.minAmount} and {limits.maxAmount} {fromDisplay.symbol}
            </p>
          </div>
        )
      )}

      {/* Unsupported Pair Warning */}
      {!isSwapPairSupported(fromCurrencyId, toCurrencyId) && (
        <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-red-400 text-xs">
            This swap pair is not currently supported
          </p>
        </div>
      )}

      {/* Privacy Info Badge */}
      <div className="mt-4 p-3 rounded-lg bg-obsidian-800/50 border border-obsidian-700">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-monero-orange/10">
            <Zap className="w-4 h-4 text-monero-orange" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-white font-medium">Privacy Protection Active</p>
            <p className="text-xs text-gray-500">
              {fromCurrency?.chainType === 'XMR' ? (
                <>Ring Signatures with {mixinCount} mixins + RingCT</>
              ) : toCurrency?.chainType === 'XMR' ? (
                <>Recipient will receive via stealth addresses</>
              ) : (
                <>Cross-chain privacy bridge with zero-knowledge proofs</>
              )}
            </p>
          </div>
          <Lock className="w-4 h-4 text-terminal-green" />
        </div>
      </div>

      {/* Swap Progress Indicator */}
      <AnimatePresence>
        {swapStage !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="p-4 rounded-lg bg-obsidian-800/50 border border-obsidian-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Swap Progress</span>
                <span className="text-xs terminal-text">
                  {swapStage === 'preparing' && 'Preparing privacy protocol...'}
                  {swapStage === 'signing' && 'Generating ring signatures...'}
                  {swapStage === 'broadcasting' && 'Broadcasting transaction...'}
                  {swapStage === 'complete' && 'Swap complete!'}
                </span>
              </div>
              <div className="flex gap-1">
                {['preparing', 'signing', 'broadcasting', 'complete'].map((stage, i) => {
                  const stages = ['idle', 'preparing', 'signing', 'broadcasting', 'complete'];
                  const currentIndex = stages.indexOf(swapStage);
                  const isComplete = i < currentIndex;
                  const isCurrent = stage === swapStage;
                  
                  return (
                    <div
                      key={stage}
                      className={`flex-1 h-1 rounded-full transition-all ${
                        isComplete ? 'bg-terminal-green' : isCurrent ? 'bg-monero-orange animate-pulse' : 'bg-obsidian-700'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swap Button */}
      <div className="mt-6">
        <SwapButton
          onClick={handleInitiateSwap}
          disabled={!isSwapReady || swapStage !== 'idle'}
          stage={swapStage}
          needsConnection={!isConnected}
          onConnectClick={() => {
            // Dispatch custom event to open wallet modal
            window.dispatchEvent(new CustomEvent('openWalletModal'));
          }}
        />
      </div>

      {/* Warnings */}
      {fromCurrencyId === 'btc' && (
        <div className="mt-4 p-3 rounded-lg bg-terminal-yellow/10 border border-terminal-yellow/20">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-terminal-yellow mt-0.5" />
            <p className="text-xs text-gray-400">
              BTC will be sent to a stealth address. The counterparty will lock XMR before you can claim BTC.
            </p>
          </div>
        </div>
      )}

      {/* Currency Select Modal */}
      <AnimatePresence>
        {showCurrencySelect && (
          <CurrencyInput
            currencies={SUPPORTED_CURRENCIES}
            selected={showCurrencySelect === 'from' ? fromCurrencyId : toCurrencyId}
            excludeId={showCurrencySelect === 'from' ? toCurrencyId : fromCurrencyId}
            onSelect={(currency) => {
              if (showCurrencySelect === 'from') {
                setFromCurrency(currency.id);
              } else {
                setToCurrency(currency.id);
              }
              setShowCurrencySelect(null);
            }}
            onClose={() => setShowCurrencySelect(null)}
          />
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <SwapSettings
            slippage={slippage}
            mixinCount={mixinCount}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
