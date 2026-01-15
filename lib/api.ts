// Supabase API Service Layer for MoneroSwap

const SUPABASE_URL = 'https://bpbtgkunrdzcoyfdhskh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwYnRna3VucmR6Y295ZmRoc2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MjAzNzUsImV4cCI6MjA3ODQ5NjM3NX0.ZAtjUoDnIWUOs6Os1NUGKIRUQVOuXDlaCJ4HwQqZu50';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'apikey': SUPABASE_ANON_KEY,
};

export interface TransactionPayload {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  status: 'pending' | 'completed' | 'failed';
  txHash: string;
  walletAddress?: string;
}

export interface TransactionResponse {
  id: string;
  date: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  status: 'pending' | 'completed' | 'failed';
  txHash: string;
}

export interface ExchangeRateResponse {
  from: string;
  to: string;
  rate: number;
  timestamp: string;
}

class ApiService {
  private baseUrl = SUPABASE_URL;

  async createTransaction(payload: TransactionPayload): Promise<TransactionResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/functions/v1/swap-transactions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        console.error('API Error:', response.status, await response.text());
        return null;
      }
      
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Failed to create transaction:', error);
      return null;
    }
  }

  async getTransactions(walletAddress?: string): Promise<TransactionResponse[]> {
    try {
      const url = walletAddress 
        ? `${this.baseUrl}/functions/v1/swap-transactions?address=${encodeURIComponent(walletAddress)}`
        : `${this.baseUrl}/functions/v1/swap-transactions`;
        
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        console.error('API Error:', response.status, await response.text());
        return [];
      }
      
      const data = await response.json();
      return data.data || data || [];
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      return [];
    }
  }

  async updateTransactionStatus(
    id: string, 
    status: 'pending' | 'completed' | 'failed', 
    txHash?: string
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/functions/v1/swap-transactions`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ id, status, txHash }),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Failed to update transaction:', error);
      return false;
    }
  }

  async getExchangeRate(from: string, to: string): Promise<ExchangeRateResponse | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/functions/v1/swap-rates?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
        {
          method: 'GET',
          headers,
        }
      );
      
      if (!response.ok) {
        console.error('API Error:', response.status, await response.text());
        return null;
      }
      
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
      return null;
    }
  }
}

export const apiService = new ApiService();
