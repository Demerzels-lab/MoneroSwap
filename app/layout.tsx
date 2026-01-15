import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'MoneroSwap | Privacy-First Cross-Chain DEX',
  description: 'Trustless atomic swaps powered by Monero ring signature technology. Swap between ETH, SOL, XMR, and 20+ tokens with complete privacy.',
  keywords: ['monero', 'xmr', 'atomic swap', 'privacy', 'crypto', 'DEX', 'cross-chain'],
  authors: [{ name: 'MoneroSwap Team' }],
  openGraph: {
    title: 'MoneroSwap | Privacy-First Cross-Chain DEX',
    description: 'Trustless atomic swaps powered by Monero privacy technology.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
