import { createPublicClient, http, Log, formatUnits, getContract} from 'viem'
import { mainnet, bsc } from 'viem/chains'
import { USDC_ethereum } from './abi/USDC_ethereum';
import { INFURA_URL } from './config'




//https://github.com/wevm/viem/blob/main/src/chains/index.ts
const client = createPublicClient({ 
  chain: mainnet, 
  transport: http(INFURA_URL), 

}) 



const tokenContract = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" //USDC
const wallet = "0x326e85F5aC58cBaBf4958D7558Fb22bEcC218505"

// Create contract instance in order to get decimals and symbol from ABI
const contract = getContract({
  address: tokenContract,
  abi: USDC_ethereum,
  client: client,
 })

// Define the expected structure of the 'Transfer' event arguments.
// Although Viem infers types from the ABI, when accessing `logs.args` directly in TypeScript,
// we need to explicitly define the shape to get proper autocomplete, type safety, and avoid TS errors.
// This type tells TS that we expect a `from`, `to`, and `value` field from the event, otherwise TS won't know what shape to expect for args
type TransferArgs = {
  from: `0x${string}`
  to: `0x${string}`
  value: bigint
}

let transfersArray:(Log & {args: TransferArgs})[] = []

async function getTransfers() {
    const decimals = await contract.read.decimals() as number
    const symbol = await contract.read.symbol()



    const logs = await client.getContractEvents({ 
    address: tokenContract,
    abi: USDC_ethereum, 
    eventName: 'Transfer',
    args: {
        from: wallet,
        // to: '0x7943Ee77AcB2F2E0fD7b2c0cD57b75f7ce3DaB35',
        // value: 1000000n
    },
    fromBlock: 22597297n,
    toBlock: 22918139n


})

 //  console.log(logs)

   transfersArray = logs as (Log & {args: TransferArgs})[]
 
   transfersArray.forEach((item) => {
      console.log(`Transfer from wallet ${item.args.from} to ${item.args.to} of value ${formatUnits(item.args.value, decimals)} ${symbol}, tx hash: ${item.transactionHash}`)
    } )
   
}

getTransfers()