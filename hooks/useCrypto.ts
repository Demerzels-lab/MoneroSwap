'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { calculateOutputAmount } from '@/lib/swap/atomic-swap';
import { isValidAddress, formatNumber } from '@/lib/utils';

/**
 * Hook to fetch and cache cryptocurrency prices
 */
export function useCryptoPrice(
  baseCurrency: string,
  quoteCurrency: string
) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['price', baseCurrency, quoteCurrency],
    queryFn: async () => {
      // In production: Fetch from real API (CoinGecko, Binance, etc.)
      const rates: Record<string, Record<string, number>> = {
        XMR: { BTC: 0.0042, ETH: 0.089, USDT: 168.50 },
        BTC: { XMR: 238.1, ETH: 16.8, USDT: 43250.00 },
        ETH: { XMR: 11.24, BTC: 0.0595, USDT: 2280.00 },
      };
      
      return rates[baseCurrency]?.[quoteCurrency] || 1;
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refresh every minute
  });

  return {
    rate: data,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to validate wallet address
 */
export function useAddressValidation(currency: string) {
  const [address, setAddress] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validate = useCallback((addr: string) => {
    setAddress(addr);
    if (!addr) {
      setIsValid(null);
      return;
    }
    const valid = isValidAddress(addr, currency);
    setIsValid(valid);
  }, [currency]);

  return {
    address,
    setAddress: validate,
    isValid,
    clear: () => {
      setAddress('');
      setIsValid(null);
    },
  };
}

/**
 * Hook to calculate swap output amount
 */
export function useSwapCalculation(
  inputAmount: string,
  fromCurrency: string,
  toCurrency: string
) {
  const { rate } = useCryptoPrice(fromCurrency, toCurrency);
  const [outputAmount, setOutputAmount] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (!inputAmount || !rate) {
      setOutputAmount('');
      return;
    }

    setIsCalculating(true);
    const timer = setTimeout(() => {
      const amount = parseFloat(inputAmount);
      if (isNaN(amount)) {
        setOutputAmount('');
      } else {
        const output = amount * rate;
        setOutputAmount(formatNumber(output, 8));
      }
      setIsCalculating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputAmount, rate]);

  return {
    outputAmount,
    rate,
    isCalculating,
  };
}

/**
 * Hook to manage swap state
 */
export function useSwapState() {
  const [swapState, setSwapState] = useState<'idle' | 'preparing' | 'signing' | 'broadcasting' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);

  const startSwap = useCallback(() => {
    setSwapState('preparing');
    setProgress(25);
  }, []);

  const setSigning = useCallback(() => {
    setSwapState('signing');
    setProgress(50);
  }, []);

  const setBroadcasting = useCallback(() => {
    setSwapState('broadcasting');
    setProgress(75);
  }, []);

  const completeSwap = useCallback(() => {
    setSwapState('complete');
    setProgress(100);
  }, []);

  const resetSwap = useCallback(() => {
    setSwapState('idle');
    setProgress(0);
  }, []);

  return {
    swapState,
    progress,
    startSwap,
    setSigning,
    setBroadcasting,
    completeSwap,
    resetSwap,
  };
}
