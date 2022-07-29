const { network } = require("hardhat");
const hre = require("hardhat");

async function main() {

  const accounts = await hre.ethers.getSigners();
  const deployer = accounts[0];
  const deployerAddress = await deployer.getAddress();

  console.log(deployerAddress, 'deployerAddress');


  // Deploy the contract
  const contractFactory = await hre.ethers.getContractFactory("ForumNFT")
  const contract = await contractFactory.deploy(
    "ForumNFT",
    "FORUM",
    deployerAddress,
    false
  );


  // Print the address of the newly deployed contract.
  console.log(`Contract deployed to: ${contract.address}`);

  //Deployed on Ganache at 0xc39066596b0A47e59a50369742F950440fcC276a

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
