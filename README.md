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
  Scans a specified block range to find a transaction with a given `nonce` from a specific sender.  
  Useful for debugging issues where a transaction appears to be “missing” due to nonce mismanagement or replacement.  
  Includes handling for Viem `BigInt` responses in logs, and safely prints both transaction and receipt data.  
  🌐 Ethereum mainnet • 📍 Real-world support use case: helped prove a user's nonce `X` was mined under a different hash

- `ERC20_allowance_checker.ts`:
  Checks the allowance set by an ERC-20 token holder to a spender (e.g. a DApp or smart contract).
  Helps determine if a spender (like a DeFi protocol) is authorized to transfer tokens on behalf of a wallet, and how much they can currently spend.
  Returns the token's symbol and allowance formatted using its decimals.
  🌐 Ethereum mainnet or any EVM chain • 📦 Any ERC-20 contract 

### Usage

1. Clone the repo
2. Add your RPC URL in `config.ts`
3. Import privateKeyToAccount in `config.ts`: import { privateKeyToAccount } from 'viem/accounts'
4. Export account as const in `config.ts`: export const account = privateKeyToAccount('your_private_key')
5. Run using ts-node or compile via TypeScript

