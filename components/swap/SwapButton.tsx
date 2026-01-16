'use client';

import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Zap, 
  ArrowRight,
  Loader2,
  CheckCircle2,
  Wallet,
  ExternalLink
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface SwapButtonProps {
  onClick: () => void;
  disabled: boolean;
  stage: 'idle' | 'preparing' | 'signing' | 'broadcasting' | 'complete';
  needsConnection?: boolean;
  onConnectClick?: () => void;
}

export default function SwapButton({ 
  onClick, 
  disabled, 
  stage, 
  needsConnection = false,
  onConnectClick 
}: SwapButtonProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (stage === 'preparing') {
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [stage]);

  const getButtonContent = () => {
    switch (stage) {
      case 'preparing':
        return (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Preparing Privacy Protocol... {countdown}s</span>
          </div>
        );
      case 'signing':
        return (
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span>Generating Ring Signatures...</span>
          </div>
        );
      case 'broadcasting':
        return (
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <span>Broadcasting Transaction...</span>
          </div>
        );
      case 'complete':
        return (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Swap Complete!</span>
          </div>
        );
      default:
        if (needsConnection) {
          return (
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              <span>Connect Wallet to Swap</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          );
        }
        return (
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span>Initiate Privacy Swap</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        );
    }
  };

  const getButtonClass = () => {
    switch (stage) {
      case 'complete':
        return 'bg-terminal-green hover:bg-terminal-green text-black';
      default:
        return '';
    }
  };

  const handleClick = () => {
    if (needsConnection && onConnectClick) {
      onConnectClick();
    } else {
      onClick();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled && !needsConnection}
      // FIXED: Allow animations when connecting is needed
      whileHover={(stage === 'idle' || needsConnection) ? { scale: 1.02 } : {}}
      whileTap={(stage === 'idle' || needsConnection) ? { scale: 0.98 } : {}}
      className={`w-full py-4 rounded-xl font-semibold font-mono text-sm transition-all flex items-center justify-center gap-2
        ${getButtonClass()}
        ${needsConnection
          // FIXED: Added cursor-pointer to this line
          ? 'bg-gradient-to-r from-monero-orange to-monero-orangeLight text-white hover:shadow-lg hover:shadow-monero-orange/30 cursor-pointer'
          : stage === 'idle' 
            ? 'bg-monero-orange text-white hover:bg-monero-orangeLight shadow-lg shadow-monero-orange/20 cursor-pointer' 
            : 'bg-obsidian-800 text-gray-400 cursor-not-allowed'
        }
        ${disabled && !needsConnection ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {getButtonContent()}
    </motion.button>
  );
}