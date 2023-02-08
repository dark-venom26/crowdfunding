require("@nomiclabs/hardhat-waffle");
const dotenv = require('dotenv');

dotenv.config({
  path: './.env'
})

task("accounts", "Prints the list of accounts", async(taskArgs, hre)=>{
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts){
    const address = await account.getAddress();
    const balance = await account.getBalance();
    console.log(address+ ":" +hre.ethers.utils.formatEther(balance));
  }
})

const goerliRPC = process.env.NEXT_PUBLIC_RPC_URL;
const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.10",
  defaultNetwork: "goerli",
  networks:{
    hardhat: {
    },
    goerli: {
      url: goerliRPC,
      accounts: [privateKey]
    }
  }
};
