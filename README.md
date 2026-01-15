# CipherSwap XMR - Privacy-First Atomic Swap Interface

A privacy-focused decentralized exchange interface for trustless atomic swaps between Monero (XMR) and Bitcoin/Ethereum, featuring complete Monero privacy technologies.

![CipherSwap XMR Banner](https://via.placeholder.com/1200x400/050505/F26822?text=CipherSwap+XMR)

## Features

### 🔐 Privacy-First Design
- **Ring Signatures**: Sender identity is mixed with 10+ decoy outputs
- **Stealth Addresses**: Recipients receive funds at one-time addresses
- **RingCT**: Transaction amounts are cryptographically hidden
- **Client-Side Encryption**: Private keys never leave your browser

### ⚡ Trustless Atomic Swaps
- Cross-chain swaps without intermediaries
- HTLC-based protocol for guaranteed execution
- Automatic refund on protocol failure
- No custody of funds

### 🛡️ Security Features
- WebAssembly-based cryptography
- View key protection (never transmitted)
- Local transaction signing
- Tor/I2P support ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Monero daemon (optional, for local node connection)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cipherswap-xmr.git
cd cipherswap-xmr

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

```env
# Monero Node Connection (optional)
NEXT_PUBLIC_MONERO_NODE=127.0.0.1:18081
NEXT_PUBLIC_MONERO_NODE_SSL=false

# API Endpoints
NEXT_PUBLIC_RATES_API=https://api.coingecko.com/api/v3
NEXT_PUBLIC_NODES_API=https://raw.githubusercontent.com

# Feature Flags
NEXT_PUBLIC_ENABLE_TESTNET=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Architecture

```
cipherswap-xmr/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main swap interface
│   └── globals.css        # Global styles + Tailwind
├── components/            # React components
│   ├── core/              # Generic UI components
│   ├── swap/              # Swap-specific components
│   ├── wallet/            # Wallet connection components
│   └── privacy/           # Privacy visualization
├── lib/                   # Core logic & utilities
│   ├── monero/            # Monero cryptography
│   ├── swap/              # Atomic swap protocol
│   └── utils.ts           # Helper functions
├── hooks/                 # Custom React hooks
├── store/                 # Zustand state management
├── types/                 # TypeScript definitions
└── public/                # Static assets
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS |
| State | Zustand |
| Data Fetching | TanStack Query |
| Animations | Framer Motion |
| Icons | Lucide React |
| Validation | Zod |

## Monero Privacy Technologies

### Ring Signatures
Monero uses ring signatures to hide the sender's identity. When creating a transaction, the sender's output is mixed with multiple decoy outputs from the blockchain, making it impossible to determine which output was actually spent.

```typescript
// Example: Creating a ring signature
import { createRingSignature } from '@/lib/monero/crypto';

const signature = createRingSignature(
  realInput,    // The actual output being spent
  decoyInputs,  // Array of decoy outputs
  keyImage,     // Key image for the input
  privateKey    // Sender's private spend key
);
```

### Stealth Addresses
Each transaction generates a unique one-time address for the recipient, ensuring that multiple payments cannot be linked to the same wallet address.

```typescript
// Example: Generating a stealth address
import { generateStealthAddress } from '@/lib/monero/crypto';

const stealthAddress = generateStealthAddress(
  recipientViewKey,   // Recipient's public view key
  recipientSpendKey,  // Recipient's public spend key
  outputIndex         // Random output index
);
```

### RingCT (Ring Confidential Transactions)
RingCT hides the transaction amount using Pedersen Commitments and Bulletproofs, ensuring that only the transacting parties know the amount transferred.

```typescript
// Example: Creating a Pedersen commitment
import { createPedersenCommitment, generateRangeProof } from '@/lib/monero/crypto';

const commitment = createPedersenCommitment(amount);
const rangeProof = generateRangeProof(commitment, 0, 2^64);
```

## Atomic Swap Protocol

The atomic swap protocol ensures trustless exchange between different blockchains:

1. **Negotiation**: Maker creates a swap offer with rate and amount
2. **HTLC Creation**: Taker locks funds in a Hash Time Locked Contract
3. **Counterparty Lock**: Maker locks funds on the other chain
4. **Redemption**: Either party reveals the secret to claim funds
5. **Completion**: Both parties complete the swap or refund occurs

## Development

### Running Tests
```bash
npm run test
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Building for Production
```bash
npm run build
npm run start
```

## Security Considerations

⚠️ **Important Security Notes**:

1. **Private Keys**: Never share your private keys or seed phrases
2. **View Keys**: View keys only expose incoming transactions, never spending ability
3. **Node Connection**: Use local node (127.0.0.1:18081) for maximum privacy
4. **Browser Security**: Use a dedicated browser profile for crypto activities
5. **Network**: Consider using Tor/VPN for IP address protection

## Roadmap

- [ ] Mainnet launch
- [ ] Additional currency pairs (ETH, ERC-20)
- [ ] Mobile wallet integration
- [ ] Hardware wallet support
- [ ] Tor onion service
- [ ] Lightning Network integration

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Monero Project](https://www.getmonero.org/) for privacy technology research
- [Comit Network](https://comit.network/) for atomic swap reference
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities

---

**Built with 🔶 by the CipherSwap Team**
