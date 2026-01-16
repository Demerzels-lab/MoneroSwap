'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1; // Device Pixel Ratio for Retina screens

    // Configuration for "High-Precision Financial Mesh"
    const config = {
      particleCount: 60,       // Sparse and clean
      connectionDist: 160,     // Distance to form a line
      mouseDist: 200,          // Mouse interaction radius
      baseSpeed: 0.15,         // Very slow drift
      color: '255, 255, 255',  // Base RGB
    };
    
    // Mouse state
    const mouse = { x: -1000, y: -1000 };

    const resize = () => {
      // Handle High-DPI / Retina displays for sharp lines
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.scale(dpr, dpr); // Normalize coordinate system
      
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Adjust particle count based on screen area
      const count = Math.min(config.particleCount, Math.floor((width * height) / 15000));
      
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          // Constant drift rather than random chaos
          vx: (Math.random() - 0.5) * config.baseSpeed,
          vy: (Math.random() - 0.5) * config.baseSpeed,
          size: Math.random() * 1.2 + 0.5,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach((p, i) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // INFINITE WRAP (Teleport to other side) instead of bouncing
        // This creates a sense of a continuous, boundless network
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw Node (Tiny, crisp dot)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${config.color}, 0.3)`;
        ctx.fill();

        // 1. Mouse Connections (User is a node)
        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < config.mouseDist) {
          ctx.beginPath();
          // Brighter, stronger connection to user
          const alpha = 0.2 * (1 - distMouse / config.mouseDist);
          ctx.strokeStyle = `rgba(${config.color}, ${alpha})`;
          ctx.lineWidth = 0.8; 
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          
          // Slight attraction to mouse (Interactive feel)
          if (distMouse > 50) {
             p.x -= dxMouse * 0.005;
             p.y -= dyMouse * 0.005;
          }
        }

        // 2. Peer Connections (Mesh)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < config.connectionDist) {
            ctx.beginPath();
            // Very subtle, thin lines for the background mesh
            const alpha = 0.08 * (1 - dist / config.connectionDist);
            ctx.strokeStyle = `rgba(${config.color}, ${alpha})`;
            ctx.lineWidth = 0.5; // Hairline width
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0 pointer-events-none bg-background"
    >
      {/* 1. The High-Precision Mesh */}
      <canvas ref={canvasRef} className="absolute inset-0 block" />
      
      {/* 2. Vignette for depth (Focuses eye on center content) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030303_130%)] opacity-90" />
      
      {/* 3. Static Noise (Film Grain) for texture */}
      <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
    </div>
  );
}