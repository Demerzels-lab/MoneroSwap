'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, RefreshCw } from 'lucide-react';

interface RingSignatureVisualizerProps {
  key?: string;
}

export default function RingSignatureVisualizer({ }: RingSignatureVisualizerProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const [phase, setPhase] = useState<'mixing' | 'signing' | 'complete'>('mixing');
  const [decoys, setDecoys] = useState<{ id: number; x: number; y: number; opacity: number }[]>([]);

  // Generate decoy positions in a circle
  useEffect(() => {
    const generateDecoys = () => {
      const newDecoys = [];
      const numDecoys = 10;
      for (let i = 0; i < numDecoys; i++) {
        const angle = (i / numDecoys) * Math.PI * 2;
        const radius = 80 + Math.random() * 20;
        newDecoys.push({
          id: i,
          x: 100 + Math.cos(angle) * radius,
          y: 100 + Math.sin(angle) * radius,
          opacity: 0.3 + Math.random() * 0.3,
        });
      }
      setDecoys(newDecoys);
    };

    generateDecoys();
    
    // Phase progression
    const timer1 = setTimeout(() => {
      setPhase('signing');
    }, 2000);
    
    const timer2 = setTimeout(() => {
      setPhase('complete');
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const getStatusText = () => {
    switch (phase) {
      case 'mixing':
        return 'Selecting decoy outputs...';
      case 'signing':
        return 'Constructing ring signature...';
      case 'complete':
        return 'Signature generated!';
      default:
        return 'Initializing...';
    }
  };

  return (
    <div className="card p-4 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-monero-orange" />
        <span className="font-semibold text-white">Ring Signature</span>
        <div className="ml-auto">
          {isAnimating && (
            <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
          )}
        </div>
      </div>

      {/* Visualization */}
      <div className="relative w-full aspect-square flex items-center justify-center bg-obsidian-950 rounded-xl overflow-hidden">
        {/* Background grid */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Decoy outputs */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
          {decoys.map((decoy, i) => (
            <motion.circle
              key={decoy.id}
              cx={decoy.x}
              cy={decoy.y}
              r={phase === 'signing' ? 6 : 4}
              fill={phase === 'complete' ? '#00FF41' : '#4B5563'}
              opacity={decoy.opacity}
              animate={{
                r: phase === 'signing' ? [6, 8, 6] : 4,
                opacity: phase === 'signing' ? [decoy.opacity, 0.6, decoy.opacity] : decoy.opacity,
              }}
              transition={{
                duration: phase === 'signing' ? 1 : 0.5,
                repeat: phase === 'signing' ? Infinity : 0,
              }}
            />
          ))}

          {/* Center - Actual output */}
          <motion.circle
            cx="100"
            cy="100"
            r={phase === 'complete' ? 10 : 8}
            fill={phase === 'complete' ? '#F26822' : '#6B7280'}
            animate={{
              r: phase === 'signing' ? [8, 12, 8] : 8,
              fill: phase === 'complete' ? '#F26822' : '#6B7280',
            }}
            transition={{
              duration: phase === 'signing' ? 1 : 0.5,
              repeat: phase === 'signing' ? Infinity : 0,
            }}
          />

          {/* Connecting lines during signing */}
          {phase === 'signing' && decoys.map((decoy, i) => (
            <motion.line
              key={`line-${decoy.id}`}
              x1="100"
              y1="100"
              x2={decoy.x}
              y2={decoy.y}
              stroke="#F26822"
              strokeWidth="1"
              strokeOpacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
              }}
            />
          ))}
        </svg>

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {phase === 'complete' ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 rounded-full bg-monero-orange flex items-center justify-center shadow-lg shadow-monero-orange/50"
            >
              <ShieldCheck className="w-8 h-8 text-white" />
            </motion.div>
          ) : (
            <motion.div
              className="w-12 h-12 rounded-full bg-obsidian-800 flex items-center justify-center border border-obsidian-700"
            >
              <span className="text-xs font-mono text-gray-400">?</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="mt-4 p-3 rounded-lg bg-obsidian-800/50 border border-obsidian-700">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${
            phase === 'complete' ? 'bg-terminal-green animate-pulse' : 
            phase === 'signing' ? 'bg-monero-orange animate-pulse' : 'bg-terminal-yellow'
          }`} />
          <span className="text-sm text-white">{getStatusText()}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Decoys: 10</span>
          <span>Privacy: {phase === 'complete' ? '100%' : phase === 'signing' ? '60%' : '20%'}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-monero-orange" />
          <span className="text-gray-500">Actual Output</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-500" />
          <span className="text-gray-500">Decoys</span>
        </div>
      </div>
    </div>
  );
}
