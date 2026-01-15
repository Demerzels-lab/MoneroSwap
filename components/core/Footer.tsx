'use client';

import Link from 'next/link';
import { Github, Shield, Lock, Eye, Cpu, Terminal } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Swap', href: '/' },
      { label: 'History', href: '/history' },
      { label: 'Documentation', href: '/docs' },
      { label: 'API', href: '/api' },
    ],
    privacy: [
      { label: 'Ring Signatures', href: '/docs#ring-signatures' },
      { label: 'Stealth Addresses', href: '/docs#stealth-addresses' },
      { label: 'RingCT', href: '/docs#ringct' },
      { label: 'Security Audit', href: '/docs#audit' },
    ],
    community: [
      { label: 'GitHub', href: 'https://github.com', icon: <Github className="w-4 h-4" /> },
      { label: 'Twitter', href: 'https://twitter.com', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
      { label: 'Telegram', href: 'https://telegram.org', icon: <Terminal className="w-4 h-4" /> },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  };

  return (
    <footer className="border-t border-obsidian-800 bg-obsidian-950/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-monero-orange to-monero-orangeDark flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-white">MoneroSwap</span>
                <span className="text-xs text-monero-orange font-mono ml-1">XMR</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Privacy-first atomic swaps powered by Monero's cryptographic technology.
            </p>
            <div className="flex items-center gap-4">
              {footerLinks.community.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-monero-orange transition-colors"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-500 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Privacy Tech Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Privacy Tech</h3>
            <ul className="space-y-2">
              {footerLinks.privacy.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-500 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-500 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Security Badges */}
          <div>
            <h3 className="text-white font-semibold mb-4">Security</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Lock className="w-4 h-4 text-terminal-green" />
                <span className="text-gray-500">Client-side encryption</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Eye className="w-4 h-4 text-terminal-green" />
                <span className="text-gray-500">View key never transmitted</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Cpu className="w-4 h-4 text-terminal-green" />
                <span className="text-gray-500">WASM-based cryptography</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-obsidian-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} MoneroSwap. Privacy is not a crime.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
                Network operational
              </span>
              <span>|</span>
              <span>Monero v0.18.x compatible</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
