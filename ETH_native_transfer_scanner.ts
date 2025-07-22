import { createPublicClient, http, formatEther} from 'viem'
import { mainnet, bsc } from 'viem/chains'
import {INFURA_URL} from './config'
import { transactionBuilder } from 'web3/lib/commonjs/eth.exports';


const client = createPublicClient({ 
  chain: mainnet, 
  transport: http(INFURA_URL)
  //https://github.com/wevm/viem/blob/main/src/chains/index.ts
}) 



const sender = '0x7943Ee77AcB2F2E0fD7b2c0cD57b75f7ce3DaB35'.toLowerCase();


const startBlock = 22037297;
const endBlock = 22038083;


async function getEthTransfers () {

    for (let i = startBlock; i<= endBlock; i++ ) {
        try {
        console.log(`Checking block ${i}...`)
            const block = await client.getBlock({blockNumber: BigInt(i)})
           // console.log(block.transactions)

        for (let j=0; j< block.transactions.length; j ++) {
                try {
                  const transaction = await client.getTransaction({
                    hash: block.transactions[j]
                                  })
                    if (transaction.from === sender) {
                        console.log(`${sender} sent ${formatEther(transaction.value)}ETH to ${transaction.to}, TX hash: ${transaction.hash}, in block ${transaction.blockNumber}`)
                    } 
                    
                    
                }catch (err) {
            if (err instanceof Error) {
                 console.error(`Error fetching tx ${j}:`, err.message)
             } else {
                console.error(`Unknown error fetching tx ${j}:`, err)
                    }
                    }
        }

        }catch (err) {
            if (err instanceof Error) {
                 console.error(`Error fetching block ${i}:`, err.message)
             } else {
                console.error(`Unknown error fetching block ${i}:`, err)
                    }
                    }
  
    }
    

}


getEthTransfers()