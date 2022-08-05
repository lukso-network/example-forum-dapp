require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require('hardhat-deploy');


const { GANACHE_PVT_KEY, LUKSO_PVT_KEY, RINKEBY_PVT_KEY, INFURA_URL } = process.env;
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
    },
    lukso: {
      url: 'https://rpc.l16.lukso.network',
      accounts: [LUKSO_PVT_KEY],
      live: true,
      chainId: 2828,
    },
    rinkeby: {
      url: INFURA_URL,
      accounts: [RINKEBY_PVT_KEY]
    }
  },
  namedAccounts: {
    owner: 0,
  }
};
