# MoneroSwap Design Specification

## Brand Identity

### Name: MoneroSwap
**Tagline:** "Privacy-First Cross-Chain Atomic Swaps"

### Logo
- Shield icon with XMR symbol
- Gradient: Monero Orange to Deep Orange

---

## Color Palette

### Primary Colors
- **Monero Orange:** `#FF6600` (Primary accent)
- **Monero Orange Light:** `#FF8533`
- **Monero Orange Dark:** `#CC5200`

### Background Colors (Axora-inspired)
- **Deep Black:** `#0A0A0F` (Main background)
- **Obsidian 950:** `#0D0D14`
- **Obsidian 900:** `#12121A`
- **Obsidian 800:** `#1A1A24`
- **Obsidian 700:** `#24242E`

### Accent Colors
- **Terminal Green:** `#00FF88` (Success, active states)
- **Cyber Blue:** `#00D4FF` (Links, highlights)
- **Purple Glow:** `#8B5CF6` (Secondary accent)
- **Terminal Yellow:** `#FFD700` (Warnings)
- **Terminal Red:** `#FF4444` (Errors)

### Gradient Effects
- **Hero Gradient:** `radial-gradient(ellipse at top, rgba(255,102,0,0.15) 0%, transparent 50%)`
- **Card Glow:** `0 0 40px rgba(255,102,0,0.1)`
- **Cyber Grid:** Subtle grid pattern overlay

---

## Typography

### Font Stack
- **Headlines:** Inter, system-ui, sans-serif (Bold, 700-900)
- **Body:** Inter, system-ui, sans-serif (Regular, 400-500)
- **Monospace:** JetBrains Mono, Fira Code, monospace (Code, addresses)

### Scale
- H1: 4rem (64px) - Hero headlines
- H2: 2.5rem (40px) - Section titles
- H3: 1.5rem (24px) - Card titles
- Body: 1rem (16px) - Paragraphs
- Small: 0.875rem (14px) - Labels, captions
- Tiny: 0.75rem (12px) - Technical details

---

## Layout Structure

### Navigation (Sticky)
- Logo left
- Nav links center: Swap | How it Works | Technology | Roadmap | Docs
- Connect Wallet button right
- Blur backdrop effect

### Landing Page Sections

#### 1. Hero Section
- Large headline with gradient text
- Subtitle with privacy focus
- Dual CTA buttons: "Launch App" + "Read Docs"
- Animated background particles/grid
- Stats bar: Supported Chains | Tokens | Privacy Level

#### 2. How It Works Section
- 4-step process cards with icons
- Step 1: Connect Wallet (MetaMask/Phantom)
- Step 2: Select Tokens (Any supported pair)
- Step 3: Privacy Protocol (Ring signatures activated)
- Step 4: Atomic Swap (Trustless execution)
- Animated connecting lines between steps

#### 3. Swap Interface (Embedded)
- The main swap card component
- Live rate display
- Privacy indicator

#### 4. Technology Section
- Two-column layout
- Left: Monero technology explanation
- Right: Visual diagram of Ring Signatures
- Tech badges: Ring CT, Stealth Addresses, Bulletproofs
- Problem/Solution cards

#### 5. Features Grid
- 6 feature cards in 3x2 grid
- Privacy First, Multi-Chain, No KYC, Atomic Swaps, Low Fees, Open Source

#### 6. Roadmap Section
- Horizontal timeline with 4 phases
- Q1 2026: Launch Beta
- Q2 2026: Mobile Support
- Q3 2026: DEX Integration
- Q4 2026: Governance Token

#### 7. FAQ Section
- Accordion-style expandable items
- 8-10 common questions

#### 8. CTA Section
- Final call to action
- Email newsletter signup
- Social links

#### 9. Footer
- Multi-column links
- Legal links
- Social icons

---

## Component Styles

### Cards
- Background: `rgba(26, 26, 36, 0.5)`
- Border: `1px solid rgba(255, 102, 0, 0.1)`
- Border Radius: 16px
- Hover: Border glow, slight lift

### Buttons
- Primary: Orange gradient background, white text
- Secondary: Transparent, orange border
- Ghost: Text only with hover underline

### Badges/Pills
- Small rounded pills for tech tags
- Colored by category (chain type, feature type)

### Inputs
- Dark background with subtle border
- Focus: Orange border glow
- Placeholder: Gray text

---

## Animations

### Page Load
- Fade in + slide up for sections
- Staggered timing (0.1s between elements)

### Scroll Triggers
- Sections reveal on scroll
- Progress indicators

### Hover Effects
- Cards: Lift + border glow
- Buttons: Scale + brightness
- Links: Underline slide

### Interactive
- Swap direction button rotation
- Loading spinners
- Toast slide in/out

---

## Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## Pages

### 1. Landing Page (/)
All sections listed above

### 2. Swap App (/swap)
Full-screen swap interface with privacy visualizer

### 3. History (/history)
Transaction history table with filters

### 4. Documentation (/docs)
Multi-section technical documentation
- Getting Started
- Wallet Connection
- Supported Tokens
- Privacy Technology
- API Reference
- Security

### 5. Roadmap (/roadmap)
Detailed roadmap with timeline
