# viem-debug-scripts

A collection of TypeScript scripts using [Viem](https://viem.sh) for inspecting and debugging EVM-based networks.

### Scripts

- `ERC20_token_balance_check.ts`: Fetches current and historical ERC-20 balance using Viem
📦 USDC/any token • 🌐 Ethereum mainnet or any EVM chain

- `ERC20_transfer_token.ts`: Transfers ERC-20 tokens between EOAs using Viem
📦 USDC/any token • 🌐 Ethereum mainnet or any EVM chain

- `send_native_token.ts`:  
  Sends native tokens (e.g. ETH, BNB) between EOAs using Viem.  
  Includes gas estimation, transaction request building, manual signing, and raw tx broadcasting.  
  🌐 Ethereum mainnet or any EVM chain

### Usage

1. Clone the repo
2. Add your RPC URL in `config.ts`
3. Import privateKeyToAccount in `config.ts`: import { privateKeyToAccount } from 'viem/accounts'
4. Export account as const in `config.ts`: export const account = privateKeyToAccount('your_private_key')
5. Run using ts-node or compile via TypeScript

