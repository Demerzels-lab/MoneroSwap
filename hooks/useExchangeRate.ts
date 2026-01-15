import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/lib/api';

// Fallback rates when API is unavailable
const FALLBACK_RATES: Record<string, number> = {
  'xmr-eth': 0.0035,
  'eth-xmr': 285.7,
  'xmr-usdc': 150,
  'usdc-xmr': 0.0067,
  'xmr-usdt': 150,
  'usdt-xmr': 0.0067,
  'xmr-dai': 150,
  'dai-xmr': 0.0067,
  'xmr-sol': 4.5,
  'sol-xmr': 0.222,
  'eth-usdc': 1800,
  'usdc-eth': 0.00056,
  'eth-usdt': 1800,
  'usdt-eth': 0.00056,
  'sol-usdc': 100,
  'usdc-sol': 0.01,
  'sol-usdt': 100,
  'usdt-sol': 0.01,
  'bnb-xmr': 200,
  'xmr-bnb': 0.005,
  'matic-xmr': 0.3,
  'xmr-matic': 3.33,
  'link-xmr': 4000,
  'xmr-link': 0.00025,
  'uni-xmr': 2000,
  'xmr-uni': 0.0005,
  'avax-xmr': 180,
  'xmr-avax': 0.0056,
};

interface UseExchangeRateResult {
  rate: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useExchangeRate(from: string, to: string): UseExchangeRateResult {
  const [rate, setRate] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFallbackRate = useCallback((fromId: string, toId: string): number => {
    const key = `${fromId}-${toId}`;
    return FALLBACK_RATES[key] || 1;
  }, []);

  const fetchRate = useCallback(async () => {
    if (!from || !to || from === to) {
      setRate(1);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getExchangeRate(from.toUpperCase(), to.toUpperCase());
      
      if (response && response.rate) {
        setRate(response.rate);
      } else {
        // Use fallback rate
        setRate(getFallbackRate(from, to));
      }
    } catch (err) {
      console.error('Failed to fetch exchange rate:', err);
      setError('Failed to fetch rate, using fallback');
      setRate(getFallbackRate(from, to));
    } finally {
      setIsLoading(false);
    }
  }, [from, to, getFallbackRate]);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  return {
    rate,
    isLoading,
    error,
    refetch: fetchRate,
  };
}
