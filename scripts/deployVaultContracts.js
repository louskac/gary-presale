const { ethers, upgrades } = require("hardhat");

async function main() {
  const ethVault = await ethers.getContractFactory("ETHVault");
  const proxy = await upgrades.deployProxy(ethVault, [], { initializer: 'initialize',timeout: 600000, pollingInterval: 50000} );
  await proxy.deployed();

  console.log("This is ethVault contract address: ", proxy.address);
}

main();