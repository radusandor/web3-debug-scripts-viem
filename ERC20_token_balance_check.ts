import { createPublicClient, http } from 'viem'
import { mainnet, bsc } from 'viem/chains'
import { getContract } from 'viem'
import { USDC_ethereum } from './abi/USDC_ethereum';
import { formatUnits } from 'viem';
import { INFURA_URL } from './config';

//https://github.com/wevm/viem/blob/main/src/chains/index.ts
const client = createPublicClient({ 
  chain: mainnet, 
  transport: http(INFURA_URL), 

}) 


const tokenContract = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
const tokenHolder = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"


// 1. Create contract instance
const contract = getContract({
  address: tokenContract,
  abi: USDC_ethereum,
  client: client,
 })

async function getBalance () {
    //TypeScript doesn’t know the return type of the function (like contract.read.balanceOf()), so it assumes unknown, and then complains when you try to pass it to formatUnits() because it is not bigint -> need to cast it as bigint
    
    const balance = await contract.read.balanceOf([tokenHolder, ]) as bigint;
     //console.log(balance)
    //similar to the above it doesn't knnow the return type so it assumes unknown, and then complains when you try to pass it to formatUnits() because it is not number -> need to cast it as number
    
    const decimals = await contract.read.decimals() as number
    const formatted = formatUnits(balance, decimals)
    const symbol = await contract.read.symbol()
    console.log(`Balance: ${formatted} ${symbol}`)

   //add blockNumber to get the balance at a specific block
    const histBlock = 21473049
    const historicalBalance = await contract.read.balanceOf([tokenHolder], {blockNumber: BigInt(histBlock)}) as bigint;
    const formattedHist = formatUnits(historicalBalance, decimals)
    console.log((`Historical Balance at block ${histBlock} : ${formattedHist} ${symbol}`))


}

getBalance()


