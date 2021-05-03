// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const ethers = hre.ethers;
const path = require("path");
const fs = require("fs");

const currentScriptDir = path.resolve(__dirname);

const CONTRACT_NAME = "NFT";
const FRONTEND_ARTIFACTS_DIR = path.join(currentScriptDir, "../", "frontend", "src", "contracts");

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');

    if (network.name === "hardhat") {
        console.warn(
            "You are trying to deploy a contract to the Hardhat Network, which gets automatically created and destroyed every time. Use the Localhost Network with `npx hardhat node` and run script with option '--network localhost'"
        );
    }

    // We get the contract to deploy
    const [deployer] = await ethers.getSigners();
    console.log("Using account:", await deployer.getAddress());
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const TokenFactory = await ethers.getContractFactory(CONTRACT_NAME);

    const deployedAddress = JSON.parse(fs.readFileSync(path.join(FRONTEND_ARTIFACTS_DIR, "DeployedAddress.json"))).DeployedAddress;
    console.log(`Attaching to deployed address from DeployedAddress.json: '${deployedAddress}'`);
    const token = await TokenFactory.attach(deployedAddress);

    console.log(`'${CONTRACT_NAME}' attached to address:`, token.address);

    const totalSupply = await token.totalSupply();
    console.log("Total supply:", totalSupply, "\n");

    for (let i = 0; i < 23; ++i) {
        const transaction = await token.createNewToken();
        console.log("Before wait()\n" + `Block Number: ${transaction.blockNumber}\n` + `Block Hash: ${transaction.blockHash}\n`);
        const receipt = await transaction.wait();

        // console.log("After wait()\n" + `Block Number: ${transaction.blockNumber}\n` + `Block Hash: ${transaction.blockHash}\n`);
        console.log(`Receipt Properties
        TO: ${receipt.to}
        FROM: ${receipt.from}
        CONTRACT ADDRESS: ${receipt.contractAddress}
        TRANSACTION INDEX: ${receipt.transactionIndex}
        GAS USED: ${receipt.gasUsed}
        BLOCK HASH: ${receipt.blockHash}
        BLOCK NUMBER: ${receipt.blockNumber}
        `);
        console.log(`Receipt Events: \n${receipt.events.map((event) => `Event Name: ${event.event}\n` + `Token ID: ${event.args.tokenId}\n`)}`);

        console.log(`New total supply ${await token.totalSupply()}`);
        const newlyCreatedTokenId = receipt.events[0].args.tokenId;
        console.log(`The owner of the newly created token }with ID ${newlyCreatedTokenId}:  ${await token.ownerOf(newlyCreatedTokenId)}`);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
