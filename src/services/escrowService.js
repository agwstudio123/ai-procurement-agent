import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import dotenv from "dotenv";

dotenv.config();

const contractAddress =
  process.env.BUILDPROCURE_ESCROW_ADDRESS;

const account = privateKeyToAccount(
  process.env.PRIVATE_KEY
);

const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(process.env.BASE_SEPOLIA_RPC_URL),
});

const abi = [
  {
    name: "createOrder",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "_supplier",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
  },
];

export async function createEscrowOrder(
  supplierWallet
) {

  const hash =
    await walletClient.writeContract({
      address: contractAddress,
      abi,
      functionName: "createOrder",
      args: [
        supplierWallet
      ],
    });

  return hash;
}