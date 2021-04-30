require("dotenv").config();
require("@nomiclabs/hardhat-waffle");

// https://hardhat.org/guides/create-task.html

// Import Tasks
require("./tasks/accounts");
require("./tasks/alchemy_url");
require("./tasks/output");

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: {
        version: "0.8.1",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
    mocha: {
        timeout: 20000,
    },
    networks: {
        // hardhat: {
        //     forking: {
        //         url: process.env.ALCHEMY_MAINNET_RPC_URL,
        //     },
        // },
        // ropsten: {
        //     url: process.env.ALCHEMY_ROPSTEN_RPC_URL,
        //     accounts: {
        //         mnemonic: process.env.ALCHEMY_ROPSTEN_MNEMONIC,
        //     },
        // },
        // rinkeby: {
        //     url: process.env.ALCHEMY_RINKEBY_RPC_URL,
        //     accounts: {
        //         mnemonic: process.env.ALCHEMY_RINKEBY_MNEMONIC,
        //     },
        // },
    },
};
