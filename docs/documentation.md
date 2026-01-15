# MoneroSwap Documentation

## Table of Contents
1. Introduction
2. Getting Started
3. Wallet Connection
4. Supported Assets
5. Privacy Technology
6. Atomic Swaps
7. Security
8. API Reference
9. Troubleshooting
10. Glossary

---

## 1. Introduction

### What is MoneroSwap?
MoneroSwap is a decentralized exchange protocol that enables privacy-preserving atomic swaps between different cryptocurrencies. By leveraging Monero's proven ring signature technology, we provide a level of transaction privacy unmatched by traditional DEXs.

### Key Features
- **Privacy by Default**: All swaps utilize ring signatures and stealth addresses
- **Multi-Chain**: Support for 7+ blockchains and 20+ tokens
- **Trustless**: Atomic swaps eliminate counterparty risk
- **Non-Custodial**: Your keys never leave your browser
- **No KYC**: We don't collect personal information

### Architecture Overview
```
┌─────────────────────────────────────────────────────────────┐
│                    MoneroSwap Protocol                       │
├──────────────┬──────────────┬──────────────┬───────────────┤
│   Frontend   │  Privacy     │   Swap       │   Multi-Chain │
│   Interface  │  Protocol    │   Engine     │   Bridge      │
├──────────────┼──────────────┼──────────────┼───────────────┤
│   React      │  Ring Sigs   │   HTLC       │   EVM         │
│   Next.js    │  Stealth     │   Atomic     │   Solana      │
│   TailwindCSS│  RingCT      │   Swaps      │   Monero      │
└──────────────┴──────────────┴──────────────┴───────────────┘
```

---

## 2. Getting Started

### Prerequisites
- A compatible web browser (Chrome, Firefox, Brave, Edge)
- MetaMask wallet extension (for EVM chains)
- Phantom wallet extension (for Solana)
- Sufficient funds for gas fees

### Quick Start Guide

#### Step 1: Access MoneroSwap
Navigate to [moneroswap.io](https://moneroswap.io) in your web browser.

#### Step 2: Connect Your Wallet
Click "Connect Wallet" and select your preferred wallet provider:
- **MetaMask**: For Ethereum, Polygon, BSC, Arbitrum, Optimism, Avalanche
- **Phantom**: For Solana

#### Step 3: Select Tokens
1. Choose your source token (what you're swapping from)
2. Choose your destination token (what you're receiving)
3. Enter the amount

#### Step 4: Review & Confirm
1. Review the exchange rate and estimated output
2. Check slippage tolerance settings
3. Click "Initiate Privacy Swap"
4. Confirm the transaction in your wallet

#### Step 5: Wait for Completion
The swap will progress through several stages:
1. **Preparing**: Privacy protocol initialization
2. **Signing**: Ring signature generation
3. **Broadcasting**: Transaction submission
4. **Complete**: Funds received

---

## 3. Wallet Connection

### Supported Wallets

| Wallet | Chains | Features |
|--------|--------|----------|
| MetaMask | Ethereum, Polygon, BSC, Arbitrum, Optimism, Avalanche | Browser extension, Mobile app |
| Phantom | Solana | Browser extension, Mobile app |

### MetaMask Connection

#### Installation
1. Visit [metamask.io](https://metamask.io)
2. Install the browser extension
3. Create or import a wallet
4. Secure your seed phrase

#### Connecting to MoneroSwap
```javascript
// MoneroSwap automatically requests connection
await window.ethereum.request({ 
  method: 'eth_requestAccounts' 
});
```

#### Network Switching
MoneroSwap will prompt you to switch networks if needed:
- Ethereum Mainnet (Chain ID: 1)
- Polygon (Chain ID: 137)
- BSC (Chain ID: 56)
- Arbitrum (Chain ID: 42161)
- Optimism (Chain ID: 10)
- Avalanche (Chain ID: 43114)

### Phantom Connection

#### Installation
1. Visit [phantom.app](https://phantom.app)
2. Install the browser extension
3. Create or import a wallet
4. Secure your seed phrase

#### Connecting to MoneroSwap
```javascript
// MoneroSwap automatically requests connection
const response = await window.solana.connect();
const publicKey = response.publicKey.toString();
```

### Security Best Practices
- Never share your seed phrase
- Verify you're on the official MoneroSwap domain
- Use hardware wallets for large amounts
- Enable transaction signing confirmations

---

## 4. Supported Assets

### Native Assets

| Asset | Symbol | Chain | Decimals |
|-------|--------|-------|----------|
| Ethereum | ETH | Ethereum | 18 |
| Polygon | MATIC | Polygon | 18 |
| BNB | BNB | BSC | 18 |
| Solana | SOL | Solana | 9 |
| Avalanche | AVAX | Avalanche | 18 |
| Monero | XMR | Monero | 12 |

### ERC-20 Tokens (Ethereum)

| Token | Symbol | Contract Address |
|-------|--------|-----------------|
| USD Coin | USDC | 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 |
| Tether | USDT | 0xdAC17F958D2ee523a2206206994597C13D831ec7 |
| Dai | DAI | 0x6B175474E89094C44Da98b954EedeAC495271d0F |
| Chainlink | LINK | 0x514910771AF9Ca656af840dff83E8264EcF986CA |
| Uniswap | UNI | 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984 |
| Wrapped Bitcoin | WBTC | 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599 |
| Aave | AAVE | 0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E63DD9E |

### SPL Tokens (Solana)

| Token | Symbol | Mint Address |
|-------|--------|--------------|
| USD Coin | USDC | EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v |
| Tether | USDT | Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB |

### Swap Pairs & Limits

| From | To | Min Amount | Max Amount |
|------|-----|------------|------------|
| XMR | ETH | 0.01 XMR | 1,000 XMR |
| XMR | USDC | 1 XMR | 50,000 XMR |
| ETH | XMR | 0.001 ETH | 100 ETH |
| SOL | XMR | 0.1 SOL | 5,000 SOL |
| USDC | XMR | 1 USDC | 50,000 USDC |

---

## 5. Privacy Technology

### Ring Signatures

Ring signatures are a type of digital signature that can be performed by any member of a group. When you initiate a swap, your signature is mixed with decoy signatures.

#### How It Works
```
Real Signer: Alice
Ring Members: [Alice, Bob, Carol, Dave, Eve, Frank, Grace, Harry, Ivan, Jack]

Signature Output: One of these 10 people signed, but it's 
cryptographically impossible to determine which one.
```

#### Implementation
```typescript
interface RingSignature {
  type: 'CLSAG' | 'MLSAG';
  version: number;
  inputs: string[];      // Ring member public keys
  keyImage: string;      // Prevents double-spending
  signatures: string[];  // Cryptographic signatures
  pseudoOuts?: string[]; // Commitment outputs
}
```

#### Ring Size
MoneroSwap uses a ring size of 16 by default, meaning each transaction is mixed with 15 decoys.

### Stealth Addresses

Every transaction creates a unique, one-time address for the recipient.

#### Generation Process
```
Sender's View Key (a) + Recipient's Public Key (B) = Stealth Address (P)

P = Hs(aR)G + B

Where:
- Hs = Hash to scalar function
- R = Random value
- G = Base point
- B = Recipient's public key
```

#### Benefits
- Receiving addresses never appear on blockchain
- Multiple payments to same person look unrelated
- Sender cannot track recipient's spending

### RingCT (Ring Confidential Transactions)

Transaction amounts are hidden using Pedersen commitments.

#### Commitment Structure
```
C = aG + bH

Where:
- a = Blinding factor (random)
- b = Amount
- G, H = Generator points
- C = Commitment (published)
```

#### Verification
The network can verify:
- Sum of inputs equals sum of outputs (no inflation)
- All amounts are positive (no negative values)
- Without knowing actual amounts

### Bulletproofs

Zero-knowledge range proofs that verify amounts are valid.

#### Advantages
- Proof size: ~0.7 KB (vs 6+ KB for older proofs)
- Aggregation: Multiple outputs in single proof
- Verification: O(n) complexity

---

## 6. Atomic Swaps

### Hash Time-Locked Contracts (HTLCs)

HTLCs enable trustless exchange between parties who don't trust each other.

#### Mechanism
```
1. Alice generates secret (S) and hash H(S)
2. Alice locks ETH with H(S), timeout T1
3. Bob sees H(S), locks XMR with H(S), timeout T2 < T1
4. Alice reveals S to claim XMR
5. Bob uses revealed S to claim ETH
```

#### Smart Contract Interface
```solidity
interface IHTLC {
    function lock(
        bytes32 secretHash,
        address recipient,
        uint256 timelock
    ) external payable returns (bytes32 swapId);
    
    function claim(
        bytes32 swapId,
        bytes32 secret
    ) external;
    
    function refund(
        bytes32 swapId
    ) external;
}
```

### Swap States

| State | Description |
|-------|-------------|
| IDLE | No active swap |
| NEGOTIATING | Finding counterparty |
| CREATING_HTLC | Generating contracts |
| LOCKING_FROM | Locking source asset |
| LOCKING_TO | Counterparty locking |
| CLAIMING | Revealing secret |
| COMPLETED | Swap successful |
| REFUNDED | Timeout reached |
| FAILED | Error occurred |

### Timelock Configuration

- **Maker Timelock**: 24 hours
- **Taker Timelock**: 12 hours
- **Safety Margin**: 2 hours

This asymmetry ensures the maker can always refund if the taker doesn't complete.

---

## 7. Security

### Smart Contract Security

#### Audits
Our smart contracts are audited by:
- Trail of Bits
- OpenZeppelin
- Quantstamp

#### Security Measures
- Reentrancy guards
- Integer overflow protection
- Access control
- Emergency pause functionality

### Client-Side Security

#### WebAssembly Isolation
All cryptographic operations run in WASM sandboxes:
- Ring signature generation
- Key derivation
- Commitment creation

#### Key Management
- Private keys never leave your browser
- No server-side key storage
- Memory is cleared after operations

### Operational Security

#### Best Practices
1. Verify the URL: `https://moneroswap.io`
2. Check for HTTPS lock
3. Use hardware wallets for large amounts
4. Enable 2FA on your wallet
5. Keep software updated

#### Known Attack Vectors
| Attack | Mitigation |
|--------|------------|
| Phishing | Domain verification |
| Front-running | Time-locked orders |
| Sandwich attacks | Slippage protection |
| Smart contract exploits | Audits, bug bounties |

---

## 8. API Reference

### REST API

#### Get Supported Tokens
```http
GET /api/v1/tokens
```

Response:
```json
{
  "tokens": [
    {
      "id": "eth",
      "name": "Ethereum",
      "symbol": "ETH",
      "chainId": 1,
      "decimals": 18
    }
  ]
}
```

#### Get Exchange Rate
```http
GET /api/v1/rate?from=eth&to=xmr&amount=1
```

Response:
```json
{
  "from": "eth",
  "to": "xmr",
  "inputAmount": "1",
  "outputAmount": "15.234",
  "rate": 15.234,
  "priceImpact": 0.05,
  "fee": 0.003,
  "expiresAt": 1704067200
}
```

#### Create Swap Quote
```http
POST /api/v1/quote
Content-Type: application/json

{
  "from": "eth",
  "to": "xmr",
  "amount": "1.5",
  "slippage": 1
}
```

Response:
```json
{
  "quoteId": "q_abc123",
  "inputAmount": "1.5",
  "outputAmount": "22.851",
  "rate": 15.234,
  "fee": "0.0045",
  "expiresAt": 1704067200
}
```

### WebSocket API

#### Subscribe to Swap Updates
```javascript
const ws = new WebSocket('wss://api.moneroswap.io/ws');

ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'swap',
  swapId: 'swap_xyz789'
}));

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Swap status:', data.status);
};
```

---

## 9. Troubleshooting

### Common Issues

#### Wallet Won't Connect
1. Ensure wallet extension is installed
2. Refresh the page
3. Check if wallet is unlocked
4. Try disconnecting and reconnecting

#### Transaction Stuck
1. Check network congestion
2. Verify gas price is sufficient
3. Wait for confirmation
4. Contact support if >1 hour

#### Swap Failed
1. Check error message
2. Verify sufficient balance
3. Ensure token approval
4. Try with higher slippage

#### Wrong Network
1. Check wallet network
2. Use network switcher
3. Manually add network in wallet

### Error Codes

| Code | Message | Solution |
|------|---------|----------|
| E001 | Insufficient balance | Add more funds |
| E002 | Slippage exceeded | Increase slippage tolerance |
| E003 | Quote expired | Get new quote |
| E004 | Network error | Check connection |
| E005 | Wallet rejected | Approve in wallet |

### Contact Support
- Discord: discord.gg/moneroswap
- Email: support@moneroswap.io
- Twitter: @MoneroSwap

---

## 10. Glossary

| Term | Definition |
|------|------------|
| **Atomic Swap** | Trustless exchange between two parties without intermediaries |
| **Bulletproof** | Zero-knowledge range proof for amount verification |
| **CLSAG** | Compact Linkable Spontaneous Anonymous Group signature |
| **Decoy** | Fake transaction mixed with real one for privacy |
| **HTLC** | Hash Time-Locked Contract for trustless swaps |
| **Key Image** | Unique identifier preventing double-spending |
| **MLSAG** | Multilayered Linkable Spontaneous Anonymous Group signature |
| **Pedersen Commitment** | Cryptographic commitment hiding transaction amounts |
| **Ring Signature** | Signature scheme that hides the true signer |
| **RingCT** | Ring Confidential Transactions for amount privacy |
| **Slippage** | Price difference between expected and executed price |
| **Stealth Address** | One-time address generated for each transaction |
| **WASM** | WebAssembly for client-side cryptographic operations |

---

*Last updated: January 2026*
*Version: 1.0.0*
