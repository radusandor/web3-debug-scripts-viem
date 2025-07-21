import { createPublicClient, http, getContract, formatUnits } from 'viem'
import { mainnet, bsc } from 'viem/chains'
import { SLP } from './abi/USDT';
import { INFURA_URL } from './config';


//https://github.com/wevm/viem/blob/main/src/chains/index.ts
const client = createPublicClient({ 
  chain: mainnet, 
  transport: http(INFURA_URL), 

}) 


const tokenContract = "0xCC8Fa225D80b9c7D42F96e9570156c65D6cAAa25"
const tokenOwner = "0x28C6c06298d514Db089934071355E5743bf21d60"
const tokenSpender = "0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08" //dapp contract or sc that is allowed to spend tokens on behalf of owner, like Uniswap v2 Router


//1. Create contract instance
const contract = getContract({
  address: tokenContract,
  abi: SLP,
  client: client,
 })


 async function checkAllowance () {

const allowance = await contract.read.allowance([tokenOwner, tokenSpender]) as bigint;
const symbol =  await contract.read.symbol()
const decimals = await contract.read.decimals() as number
const formatted = formatUnits (allowance, decimals)

//readContract() more used for one-off reads, but prefer to use getContract() for reusability of the contract client

//     const allowance = await client.readContract({
//         address: tokenContract,
//         abi: USDT,
//         functionName: 'allowance',
//         args: [tokenOwner, tokenSpender]
// })
    if (parseFloat(formatted) > 0 ) {
        console.log(`Token spending allowance for spender ${tokenSpender} is ${formatted} ${symbol}`)
    }  else {
        console.log(`No active approval for this spender ${tokenSpender}`)
    } 

 }


  checkAllowance ()