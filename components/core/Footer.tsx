'use client';

import Link from 'next/link';
import { Twitter, Github, Disc, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    protocol: [
      { name: 'Atomic Swap', href: '/swap' },
      { name: 'Liquidity Pools', href: '/pools' },
      { name: 'Yield Farming', href: '/earn' },
      { name: 'Bridge', href: '/bridge' },
    ],
    governance: [
      { name: 'DAO Dashboard', href: '/governance' },
      { name: 'Proposals', href: '/governance/proposals' },
      { name: 'Delegates', href: '/governance/delegates' },
    ],
    developers: [
      { name: 'Documentation', href: '/docs' },
      { name: 'GitHub', href: 'https://github.com/moneroswap' },
      { name: 'Audits', href: '/docs/security' },
      { name: 'Bug Bounty', href: '/bounty' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Risks', href: '/risks' },
    ],
  };

  return (
    <footer className="border-t border-obsidian-800 bg-background pt-24 pb-12">
      <div className="container mx-auto px-6">
        
        {/* TOP SECTION: Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-24">
          
          {/* Column 1: Brand & Status */}
          <div className="col-span-2 lg:col-span-2 pr-8">
            <Link href="/" className="inline-block mb-6">
              <span className="font-serif text-2xl text-white">MoneroSwap</span>
            </Link>
            <p className="text-obsidian-400 text-sm leading-relaxed mb-8 max-w-sm">
              The zero-identity financial layer. Providing censorship-resistant liquidity 
              through cryptographically secure atomic swaps.
            </p>
            
            {/* Live System Status */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                SYSTEM OPERATIONAL
              </div>
              <span className="text-obsidian-700">|</span>
              <div className="text-obsidian-500">
                BLOCK 2,849,102
              </div>
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h4 className="text-label mb-6">PROTOCOL</h4>
            <ul className="space-y-4">
              {links.protocol.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-obsidian-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-label mb-6">DEVELOPERS</h4>
            <ul className="space-y-4">
              {links.developers.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-obsidian-400 hover:text-white transition-colors flex items-center gap-2 group">
                    {link.name}
                    {link.href.startsWith('http') && <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-label mb-6">LEGAL</h4>
            <ul className="space-y-4">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-obsidian-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM SECTION: Socials & Copyright */}
        <div className="pt-8 border-t border-obsidian-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs text-obsidian-600 font-mono">
            © {currentYear} MONEROSWAP PROTOCOL. ZERO RIGHTS RESERVED.
          </div>
          
          <div className="flex items-center gap-6">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-obsidian-500 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-obsidian-500 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://discord.com" target="_blank" rel="noreferrer" className="text-obsidian-500 hover:text-white transition-colors">
              <Disc className="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}