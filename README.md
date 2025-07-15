# viem-debug-scripts

A collection of TypeScript scripts using [Viem](https://viem.sh) for inspecting and debugging EVM-based networks.

### Scripts

- `ERC20_token_balance_check.ts`: Fetches current and historical ERC-20 balance using Viem
  - Contract: USDC/any
  - Chain: Ethereum mainnet/ any EVM

- `ERC20_transfer_token.ts`: Transfers ERC-20 tokens between EOAs using Viem
  - Contract: USDC/any
  - Chain: Ethereum mainnet/ any EVM


### Usage

1. Clone the repo
2. Add your RPC URL in `config.ts`
3. Import privateKeyToAccount in `config.ts`: import { privateKeyToAccount } from 'viem/accounts'
4. Export account as const in `config.ts`: export const account = privateKeyToAccount('your_private_key')
5. Run using ts-node or compile via TypeScript

