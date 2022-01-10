const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account: ", deployer.address
  );

  console.log("Account balance: ", (await deployer.getBalance()).toString());

  const Fallout = await ethers.getContractFactory("Fallout");
  const fallout = await Fallout.deploy();
  console.log("Fallout address: ", await fallout.address);
  console.log("Account balance after Fallout deploy: ", (await deployer.getBalance()).toString());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
