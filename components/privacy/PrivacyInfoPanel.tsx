'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Cpu, ArrowRight, ExternalLink } from 'lucide-react';

export default function PrivacyInfoPanel() {
  const privacyFeatures = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Ring Signatures',
      description: 'Your sender identity is mixed with 10+ other outputs',
      color: 'monero-orange',
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: 'Stealth Addresses',
      description: 'Recipients receive funds at one-time addresses',
      color: 'terminal-green',
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: 'RingCT',
      description: 'Transaction amounts are cryptographically hidden',
      color: 'blue-400',
    },
  ];

  return (
    <div className="card p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="w-5 h-5 text-monero-orange" />
        <span className="font-semibold text-white">Privacy Tech</span>
      </div>

      {/* Privacy Features List */}
      <div className="flex-1 space-y-3">
        {privacyFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 rounded-lg bg-obsidian-800/50 border border-obsidian-700 hover:border-monero-orange/30 transition-colors group cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-${feature.color}/10 text-${feature.color}`}>
                {feature.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium group-hover:text-monero-orange transition-colors">
                  {feature.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {feature.description}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-monero-orange transition-colors opacity-0 group-hover:opacity-100" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-4 p-3 rounded-lg bg-terminal-green/5 border border-terminal-green/20">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-terminal-green mt-0.5" />
          <div>
            <p className="text-xs text-terminal-green font-medium">Zero-Knowledge Privacy</p>
            <p className="text-xs text-gray-500 mt-1">
              All cryptographic operations happen locally in your browser. No private keys or view keys are transmitted.
            </p>
          </div>
        </div>
      </div>

      {/* Learn More Link */}
      <a
        href="https://www.getmonero.org/resources/developer-guides/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-2 p-2 rounded-lg bg-obsidian-800/50 border border-obsidian-700 hover:border-monero-orange/30 transition-colors text-sm text-gray-400 hover:text-white"
      >
        <span>Learn about Monero Privacy</span>
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}
