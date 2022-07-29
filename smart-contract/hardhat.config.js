require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

const { GANACHE_PVT_KEY } = process.env;
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.15",
  networks: {
    local: {
      url: 'HTTP://127.0.0.1:7545',
      accounts: [GANACHE_PVT_KEY]
    }
  }
};
