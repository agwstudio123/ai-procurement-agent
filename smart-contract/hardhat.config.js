require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",

  networks: {

    arcTestnet: {
      url: "https://rpc.testnet.arc.network",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 5042002,
    },

    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },

  },

  etherscan: {
    apiKey: {
      arcTestnet: "YOUR_ARCSCAN_API_KEY"
    },

    customChains: [
      {
        network: "arcTestnet",
        chainId: 5042002,
        urls: {
          apiURL:
          "https://testnet.arcscan.app/api",
          browserURL:
          "https://testnet.arcscan.app"
        }
      }
    ]
  }
};