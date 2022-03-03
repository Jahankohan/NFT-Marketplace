/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle");
const fs = require("fs")
const privateKey = fs.readFileSync(".secret").toString()
const dev_projectId = "o0rrxpvDMX_QHMQ5KCYz567NGEYxI-sy"
const dep_projectId = "KpiLsg77lh07w-kgP1pDySBKJMnvQ4YR"

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${dev_projectId}`,
      accounts: [privateKey]
    },
    mainnet: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${dep_projectId}`,
      accounts: [privateKey]
    }
  },
  solidity: "0.8.4"
};