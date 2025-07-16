# viem-debug-scripts

A collection of TypeScript scripts using [Viem](https://viem.sh) for inspecting and debugging EVM-based networks.

### Scripts

- `ERC20_token_balance_check.ts`: 
  Fetches current and historical ERC-20 balance using Viem
  • 📦 USDC/any token • 🌐 Ethereum mainnet or any EVM chain

- `ERC20_transfer_token.ts`: 
  Transfers ERC-20 tokens between EOAs using Viem
   • 📦 USDC/any token • 🌐 Ethereum mainnet or any EVM chain

- `send_native_token.ts`:  
  Sends native tokens (e.g. ETH, BNB) between EOAs using Viem.  
  Includes gas estimation, transaction request building, manual signing, and raw tx broadcasting.  
  •🌐 Ethereum mainnet or any EVM chain

- `find_tx_by_nonce.ts`: 
  Searches for a transaction from a given sender with a specific nonce across a block range.
  Useful when troubleshooting user-submitted transactions that appear “missing” due to nonce mismanagement or replacement.
  🛠️ Real-world example: Used to prove that a customer’s transaction with nonce X was already mined under a different hash.
  Scans block-by-block using getBlock → getTransaction to locate sender+nonce match.
  Includes safe JSON.stringify() for BigInt objects returned by Viem.
  Great for identifying replaced or dropped txs in chains with high-frequency sender activity.
  //Usage:
  const sender = '0xAddress';
  const nonce = 12;
  const startBlock = 22036975;
  const endBlock = 22036999;


### Usage

1. Clone the repo
2. Add your RPC URL in `config.ts`
3. Import privateKeyToAccount in `config.ts`: import { privateKeyToAccount } from 'viem/accounts'
4. Export account as const in `config.ts`: export const account = privateKeyToAccount('your_private_key')
5. Run using ts-node or compile via TypeScript

