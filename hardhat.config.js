/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle");
privateKey = process.env.TEST_PRIVATE_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.TEST_ALCHEMY_API_KEY}`,
      accounts: [privateKey],
      gas: 2100000,
      gasPrice: 8000000000,
      saveDeployments: true,
    },
    mainnet: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.MAIN_ALCHEMY_API_KEY}`,
      accounts: [privateKey],
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
