require("@nomiclabs/hardhat-waffle");
const path = require("path");
const exec = require("child_process").exec;

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
    .addParam("file", "The solidity file that will be flattened")
    .setAction(async (taskArguments) => {
        const bashScriptFilename = path.join(appRoot, "output_task.sh");

        console.log(`Running \`bash "${bashScriptFilename}" "${taskArguments["file"]}"\``);

        const myShellScript = exec(`bash "${bashScriptFilename}" "${taskArguments["file"]}"`);
        console.log(`Generated file "${path.resolve(path.join(".", "output"))}"`);

        myShellScript.stdout.on("data", (data) => {
            console.log(data);
        });
        myShellScript.stderr.on("data", (data) => {
            console.error(data);
        });
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
