import { createPublicClient, http, Log, formatUnits, getContract, Address} from 'viem'
import { mainnet, bsc } from 'viem/chains'
import { uniswapV2Factory } from './uniswaps_abis/uniswapV2Factory';
import { uniswapV2Router } from './uniswaps_abis/uniswapV2Router';
import { pairContractABI } from './uniswaps_abis/uniswapV2Pair'
import { INFURA_URL } from './config'
import { USDC_ethereum } from './abi/USDC_ethereum';


//router contract - interface users interact with to swap, add/remove liquidity
    // 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D Uniswap V2 router on Ethereum
//uniswap factory contract - exposes pair contract addresses via the getPair() function
    //0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f
//pair contract - contract deployed for each trading pair
    //0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc for usdc -> weth
    //0x004375Dff511095CC5A197A54140a24eFEF3A416 for usdc -> wBTC
    //pair contract uses the UniswapV2Pair ABI which includes the swap, mint events, getReserves() to check current liquidity


//https://github.com/wevm/viem/blob/main/src/chains/index.ts
const client = createPublicClient({ 
  chain: mainnet, 
  transport: http(INFURA_URL), 

}) 

const uniFactoryContract = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
const uniRouterContract = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"

const usdcContract = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" //USDC
const wethContract = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
const wBTCContract = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"


// Create contract Uniswap contract instances
const contractV2Factory = getContract({
  address: uniFactoryContract,
  abi: uniswapV2Factory,
  client: client,
 })


const contractV2Router = getContract({
  address: uniRouterContract,
  abi: uniswapV2Router,
  client: client,
 })

// Define the expected structure of the 'Swap' event arguments.
// Although Viem infers types from the ABI, when accessing `logs.args` directly in TypeScript,
// we need to explicitly define the shape to get proper autocomplete, type safety, and avoid TS errors.
// This type tells TS that we expect a `from`, `to`, and `value` field from the event, otherwise TS won't know what shape to expect for args
type SwapArgs = {
  sender: `0x${string}`
  amount0In: bigint
  amount1In: bigint,
  amount0Out: bigint,
  amount1Out: bigint
  to: `0x${string}`
  
}

let swapsArray:(Log & {args: SwapArgs})[] = []


async function getSwaps () {
    try {
//get pair contract address for two tokens
 const pairContract = await contractV2Factory.read.getPair([usdcContract, wethContract])
     if (pairContract === '0x0000000000000000000000000000000000000000') {
      throw new Error('Pair does not exist.');
    }
 console.log (`Pair contract: ${pairContract}`)

const uniPairContract = getContract({
  address: pairContract as Address,
  abi: pairContractABI,
  client: client,
 })

    
    //Uniswap V2 Pair contract has two public functions:token0() and token1(), which tell you which is token0 and which token1 if to interpret swap direction
    const token0 = await uniPairContract.read.token0()
    const token1 = await uniPairContract.read.token1()
    let fromToken = ''
    let toToken = ''
    if (token0 === usdcContract) {
           console.log (`Token0 is USDC, and Token1 is WETH`)
    } else {
        fromToken = 'WETH'
        toToken = 'USDC'
        console.log (`Token0 is WETH, and Token1 is USDC`)
    }

    console.log(`Token0: ${token0} Token1: ${token1}` )


const swaps = await client.getContractEvents({ 
  address: pairContract as Address,
  abi: pairContractABI,
  eventName: 'Swap',
  args: {
    // sender:'address', //v2 router
    // amount0In: uint256,
    // amount1In:uint256,
    // amount0Out:uint256,
    // amount1Out:uint256,
    to: '0xd749d46a909f0ac5E9D73259590Ad2b13217ea82' // wallet receiving the swap, check the pair contract ABI's swap event, in almost most cases the initiator as well
  },
  fromBlock: 23044953n,
  toBlock: 23046294n
})

//console.log(swaps)

//below code is just for nicely formatting output, in order to get a more readable format of swap amounts, swap direction, formatted values, symbols, tx hashes and receiving wallet
//instead of going through the swaps logs array
//otherwise just log the whole swaps array => console.log(swaps)
swapsArray = swaps.map((log) => ({
  ...log,
  args: log.args as SwapArgs,
}))
 
//defining these 2 contract instances in order to get the decimals ans symbols for better formatting
const token0Contract = getContract({
  address: token0 as Address,
  abi: USDC_ethereum,
  client: client,
 })

 const token1Contract = getContract({
  address: token1 as Address,
  abi: USDC_ethereum,
  client: client,
 })

 
 const token0Symbol = await token0Contract.read.symbol()
 const token1Symbol = await token1Contract.read.symbol()
 const token0Decimals = await token0Contract.read.decimals() as number
 const token1Decimals = await token1Contract.read.decimals() as number

 //if amount0In>0 then from token is token0
 //if amount1In>0 then from token is token1

swapsArray.forEach((item) => {
        if (item.args.amount0In>0){
            console.log(`Swap from token0: ${formatUnits(item.args.amount0In, token0Decimals)} ${token0Symbol} to token1: ${formatUnits(item.args.amount1Out,token1Decimals)} ${token1Symbol}, in tx: ${item.transactionHash}, receiving wallet: ${item.args.to}`)
        } else if (item.args.amount1In>0){
            console.log(`Swap from token1: ${formatUnits(item.args.amount1In,token1Decimals)} ${token1Symbol} to token0:${formatUnits(item.args.amount0Out,token0Decimals)} ${token0Symbol}, in tx: ${item.transactionHash}, receiving wallet: ${item.args.to}`)
        }


    } )
    } catch (err) {
    if (err instanceof Error) {
      console.error('An error occurred during swap scan:', err.message);
    } else {
      console.error('Unknown error:', err);
    }
  }


}


getSwaps()

