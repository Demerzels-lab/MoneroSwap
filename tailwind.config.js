/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // The "Axora" Dark Palette: Strict Monochrome
        background: '#030303', // Almost pure black for depth
        surface: '#0A0A0A',    // Slightly lighter for cards
        
        // Neutral Grays for borders and text (Zinc scale)
        obsidian: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',  // Primary Text (High contrast)
          300: '#d4d4d8',
          400: '#a1a1aa',  // Secondary/Muted Text
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',  // Borders
          900: '#18181b',  // Card Backgrounds
          950: '#09090b',  // Main Background
        },
        
        // We keep a single "Action" color, but desaturated white/glow 
        // instead of neon orange, or a very subtle "Monero Gray"
        action: {
            DEFAULT: '#ffffff',
            hover: '#e5e5e5',
            muted: '#404040'
        }
      },
      fontFamily: {
        // "Editorial" Heading Font (Serif)
        serif: ['Playfair Display', 'Merriweather', ...defaultTheme.fontFamily.serif],
        // Clean Swiss Body Font (Sans)
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        // Technical Data Font (Mono)
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
      backgroundImage: {
        // Subtle noise/grid for that "high-end tech" feel, less aggressive than scanlines
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
        'subtle-grid': 'linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};