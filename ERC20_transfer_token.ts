import { createPublicClient, http, createWalletClient } from 'viem'
import { mainnet, bsc } from 'viem/chains'
import { getContract } from 'viem'
import { USDC_ethereum } from './abi/USDC_ethereum';
import { parseUnits } from 'viem';
import { account } from './config'
import { INFURA_URL } from './config';

//https://github.com/wevm/viem/blob/main/src/chains/index.ts
const client = createPublicClient({ 
  chain: mainnet, 
  transport: http(INFURA_URL), 

}) 


const walletClient = createWalletClient({
    account,
    chain: mainnet,
    transport: http(INFURA_URL)
  })


const tokenContract = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" //USDC
const tokenRecipient = "0x7943Ee77AcB2F2E0fD7b2c0cD57b75f7ce3DaB35"


// 1. Create contract instance
const contract = getContract({
  address: tokenContract,
  abi: USDC_ethereum,
  client: client,
 })



 
async function transferToken () {

 const decimals = await contract.read.decimals() as number
 const parsedAmount = parseUnits('0.5', decimals) //need to parse it using the contract decimals, so that the token decimals are added when calling the transfer function


const hash = await walletClient.writeContract({
  address: tokenContract,
  abi: USDC_ethereum,
  functionName: 'transfer',
  args: [tokenRecipient, parsedAmount], // the parsedAmount will add 6 decimals, for USDC, 18 for DAI etc, so the transferred amount in this case will 500000, which accounts for 0.5 USDC
})    


    console.log("Mining transcation... ")
    console.log(`Tx: https://etherscan.io/tx/${hash}`)
}

transferToken()


