import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);
  console.log("Network:", (await ethers.provider.getNetwork()).name);

  // Deploy Linking.sol
  const Linking = await ethers.getContractFactory("Linking");
  const linking = await Linking.deploy();
  await linking.waitForDeployment();
  const linkingAddress = await linking.getAddress();
  console.log("Linking deployed to:", linkingAddress);

  // Deploy DealToken (MockToken.sol)
  const DealToken = await ethers.getContractFactory("DealToken");
  const dealToken = await DealToken.deploy();
  await dealToken.waitForDeployment();
  const dealAddress = await dealToken.getAddress();
  console.log("DealToken (DEAL) deployed to:", dealAddress);

  // Deploy ALTToken (MockToken2.sol)
  const ALTToken = await ethers.getContractFactory("ALTToken");
  const altToken = await ALTToken.deploy();
  await altToken.waitForDeployment();
  const altAddress = await altToken.getAddress();
  console.log("ALTToken (ALT) deployed to:", altAddress);

  console.log("\n--- Update these in your .env files ---");
  console.log(`LINKING_CONTRACT_ADDRESS=${linkingAddress}`);
  console.log(`DEAL_TOKEN_ADDRESS=${dealAddress}`);
  console.log(`ALT_TOKEN_ADDRESS=${altAddress}`);
  console.log(`\n# Frontend — update op-frontend/app/abi.ts:`);
  console.log(`export const contractAddress = "${linkingAddress}";`);
  console.log("\n--- Verify contracts ---");
  console.log(`npx hardhat verify ${linkingAddress} --network 0g-testnet`);
  console.log(`npx hardhat verify ${dealAddress} --network 0g-testnet`);
  console.log(`npx hardhat verify ${altAddress} --network 0g-testnet`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
