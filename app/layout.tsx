import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import InteractiveBackground from '@/components/core/InteractiveBackground';

// === METADATA ===
// Updated to match the "Axora" Editorial/High-Tech vibe
export const metadata: Metadata = {
  title: 'MoneroSwap | Zero-Identity Financial Layer',
  description: 'Autonomous cross-chain liquidity protocol using Monero ring signatures. No KYC. No Trace. Pure Alpha.',
  keywords: ['monero', 'atomic swap', 'privacy', 'zero-knowledge', 'mev-protection', 'defi'],
  authors: [{ name: 'MoneroSwap Protocol' }],
  icons: '/logo.jpeg',
  openGraph: {
    title: 'MoneroSwap | The Invisible Market',
    description: 'Cryptographically secure signal extraction and atomic settlement.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoneroSwap | Zero-Identity',
    description: 'The less visible the contributor, the stronger the network.',
  },
};

// Force the browser chrome to match our dark theme
export const viewport: Viewport = {
  themeColor: '#030303',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      {/* BODY SETTINGS:
        - We rely on globals.css for the base 'bg-background' (#030303).
        - We DO NOT add an explicit background color class here to ensure your 
          'InteractiveBackground' component (which has bg-background) is visible.
      */}
      <body className="min-h-screen flex flex-col overflow-x-hidden antialiased selection:bg-white selection:text-black bg-background text-white">
        
        {/* === BACKGROUND LAYER (Z-0) === 
            This sits permanently behind all content.
        */}
        <InteractiveBackground />

        <Providers>
          {/* CONTENT WRAPPER:
            This div creates a stacking context (z-10). 
            It ensures all page content sits ON TOP of the canvas mesh.
          */}
          <div className="relative z-10 flex-grow flex flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}