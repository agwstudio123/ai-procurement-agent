const hre = require("hardhat");

async function main() {
  const [account] = await hre.ethers.getSigners();

  const balance = await hre.ethers.provider.getBalance(account.address);

  console.log("Address:", account.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});