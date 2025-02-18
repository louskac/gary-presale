const { ethers } = require("hardhat"); 
async function main() {
    const PresaleContract = await ethers.getContractFactory("PresaleContract");
    const presale = await PresaleContract.deploy("Token_Address", "timestamp");
    
    await presale.deployed();

    console.log("presale contract deployed to:", presale.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
