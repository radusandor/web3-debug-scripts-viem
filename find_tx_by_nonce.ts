import { createPublicClient, http } from 'viem'
import { mainnet, bsc } from 'viem/chains'
import {INFURA_URL} from './config'


const client = createPublicClient({ 
  chain: mainnet, 
  transport: http(INFURA_URL)
  //https://github.com/wevm/viem/blob/main/src/chains/index.ts
}) 



const sender = '0x7943Ee77AcB2F2E0fD7b2c0cD57b75f7ce3DaB35'.toLowerCase();
const nonce = 9; 

const startBlock = 22036975;
const endBlock = 22036999;


async function main () {
    let found = false
//iterate through the block range and get each block's transactions array 
    for (let i = startBlock; i<= endBlock; i ++) {
        try {
            console.log(`Checking block ${i}...`)
            const block =  await client.getBlock({
                    blockNumber: BigInt(i)
    }) 
   // console.log(block.transactions)

   // for each tx in the tx array look for a sender and nonce match
    for (let j=0; j<= block.transactions.length -1; j++ ) {
        try {

        const tx = await client.getTransaction({ 
        hash: block.transactions[j] as `0x${string}`
      })

      if (tx.from.toLowerCase() === sender && tx.nonce === nonce) {
        found = true 
      //console.log(`Found! Sender: ${tx.from}, Nonce: ${tx.nonce}, TxHash: ${tx.hash}`);
      //console.log('Tx Object: ', JSON.stringify(tx, null, 2)) // this will return Error fetching tx  0xe40eca464cad59c5108696f6429ddfe7237f001862e5d934864c183e3e058e7d: Do not know how to serialize a BigInt becuase JSON.stringify doesn't accept bigints which viem returns in the tx object -- see the n at the end of block numbers for example 
         
            console.log('Tx Object: ', JSON.stringify(tx,  (key ,value) =>
                typeof value === "bigint" ? value.toString() : value, 2
          ))

      
        
            const txReceipt = await client.getTransactionReceipt({ 
            hash: tx.hash 
     })
       console.log(`See the tx receipt: `,  JSON.stringify(txReceipt,  (key ,value) =>
                typeof value === "bigint" ? value.toString() : value, 2
          ))    // the function is the replacer which was set to null otherwise, 2 is the spacer for a nice objecyt format
       // console.log(`See the tx receipt: ${JSON.stringify(txReceipt, null, 2)}`)    
            break // break of the j loop
      }

      
        }catch(err) {
            if (err instanceof Error) {
            console.error(`Error fetching tx  ${block.transactions[j]}:`, err.message)
            } else {
            console.error(`Unknown error fetching tx  ${block.transactions[j]}`, err)
            }
            
        }
    }
        if (found) break;// break of the i loop 
    

        } catch(err) {
            if (err instanceof Error ) {
            console.error(`Error fetching tx in block ${i}:`, err.message)
            } else {
                console.error(`Unknown error in block ${i}:`, err);
            }
            
        }

        

    }
   


    if (!found) {
      console.log(`Transaction from ${sender} with nonce ${nonce} not found in blocks ${startBlock}-${endBlock}.`);
    }



}


main()
