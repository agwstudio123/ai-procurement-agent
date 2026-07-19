import { ethers } from "ethers";

const CONTRACT_ADDRESS =
"0x90bd982FaC935EF9D4a8879fC4bFC85D9501659B";


const ABI = [
  {
    "inputs":[
      {
        "internalType":"address",
        "name":"_supplier",
        "type":"address"
      }
    ],
    "name":"createOrder",
    "outputs":[
      {
        "internalType":"uint256",
        "name":"",
        "type":"uint256"
      }
    ],
    "stateMutability":"nonpayable",
    "type":"function"
  }
];


export async function createEscrowOrder(
  supplierAddress
){

const provider =
new ethers.JsonRpcProvider(
"https://rpc.testnet.arc.network"
);


const wallet =
new ethers.Wallet(
process.env.PRIVATE_KEY,
provider
);


const contract =
new ethers.Contract(
CONTRACT_ADDRESS,
ABI,
wallet
);


const tx =
await contract.createOrder(
supplierAddress
);


await tx.wait();


return tx.hash;

}