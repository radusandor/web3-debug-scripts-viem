import { createPublicClient, http, createWalletClient, parseGwei, parseEther } from 'viem'
import { mainnet } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { account, INFURA_URL } from './config'


//create public and wallet client
const httpClient = createPublicClient({ 
    chain: mainnet, 
    transport: http(INFURA_URL), 
  }) 

const client = createWalletClient({
    chain: mainnet,
    transport: http(INFURA_URL)
  })


   

   async function sendTx () {


    //estimate gas - optional
    const limit = await httpClient.estimateGas({ 
      account,
      to: '0xc2CB3fb3924b8DE3A63C1da570a8dBaf2a533eA7',
      value: parseEther('0.00001')
    })

  console.log(limit)

    //prepare transcation request
    const request = await client.prepareTransactionRequest({
        chainId: 1,
        account,
        to: '0xc2CB3fb3924b8DE3A63C1da570a8dBaf2a533eA7',
        value: parseEther('0.00001'),
        //maxFeePerGas: parseGwei('20'),
        //maxPriorityFeePerGas: parseGwei ('2'),
        gas: limit,
        gasPrice: parseGwei('4'),
        nonce: await httpClient.getTransactionCount({ address: '0x7943Ee77AcB2F2E0fD7b2c0cD57b75f7ce3DaB35'}) ,
  
      }) 

//manual sign and send raw tx
//should you want to sign the tx beforehand, but works with signing as well as sendTransaction handles signing & sending automatically.
const signedTx = await client.signTransaction(request)
console.log("Raw Transaction:", signedTx)
const hash = await client.sendRawTransaction({ serializedTransaction: signedTx })


   //use this instead of manual signing, for quick tests sendTransaction() can be used directly
   // const hash = await client.sendTransaction(request)


 console.log("Mining transcation... ")
 console.log(`Tx mined https://etherscan.io/tx/${hash}`)
  }

sendTx()


