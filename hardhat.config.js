require("@nomiclabs/hardhat-waffle");

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

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: "0.8.1",
    // networks: {
    //     hardhat: {
    //         forking: {
    //             url: process.env.ALCHEMY_MAINNET_RPC_URL,
    //         },
    //     },
    // },
};
