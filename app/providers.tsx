'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, createContext, useContext } from 'react';
import { ToastProvider } from '@/components/core/Toast';

// Create a default query client
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

// Monero WASM Context
interface MoneroWASMState {
  isLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
}

const MoneroWASMContext = createContext<MoneroWASMState>({
  isLoaded: false,
  isLoading: true,
  error: null,
});

export function useMoneroWASM() {
  return useContext(MoneroWASMContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [wasmState] = useState<MoneroWASMState>({
    isLoaded: false,
    isLoading: true,
    error: null,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MoneroWASMContext.Provider value={wasmState}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </MoneroWASMContext.Provider>
    </QueryClientProvider>
  );
}
