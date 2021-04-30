require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
const path = require("path");
const execFileSync = require("child_process").execFileSync;

const appRoot = path.resolve(__dirname);

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
    const accounts = await ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

task("alchemy_url", "Prints alchemy url", async () => {
    console.log(process.env.ALCHEMY_MAINNET_RPC_URL);
});

task("output", "Run flatten task with result passed through bash script and saved as file 'output.txt'")
    .addVariadicPositionalParam("files", "Solidity contract files to be flattened")
    .setAction(async (taskArguments) => {
        const bashScriptFilename = path.join(appRoot, "output_task.sh");
        console.log(`Running: \`${bashScriptFilename} ` + taskArguments.files.map((x) => `"${x}"`).join(" ") + "`");

        execFileSync(bashScriptFilename, [...taskArguments.files]);

        console.log(`Finished running command`);
    });

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
