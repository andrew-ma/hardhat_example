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
    console.log("Deploying contract with account:", await deployer.getAddress());
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const TokenFactory = await ethers.getContractFactory(CONTRACT_NAME);

    console.log(`Deploying contract: '${CONTRACT_NAME}'`);
    const token = await TokenFactory.deploy();
    await token.deployed();

    console.log(`'${CONTRACT_NAME}' deployed to address:`, token.address);

    saveFrontendFiles(token);
}

function saveFrontendFiles(token) {
    /* 
    Save the contract's artifact with ABI and address in the frontend directory, so the frontend's ethereum library (web3 or ethersjs) can initialize a contract object
    that can call and send contract functions
    */
    if (!fs.existsSync(FRONTEND_ARTIFACTS_DIR)) {
        fs.mkdirSync(FRONTEND_ARTIFACTS_DIR);
    }

    // Save address of deployed contract file in "DeployedAddress.json" with key "DeployedAddress"
    fs.writeFileSync(path.join(FRONTEND_ARTIFACTS_DIR, "DeployedAddress.json"), JSON.stringify({ DeployedAddress: token.address }));

    // Save contract's artifact with ABI in "Token.json" to FRONTEND_ARTIFACTS_DIR
    const TokenArtifact = artifacts.readArtifactSync(CONTRACT_NAME);
    fs.writeFileSync(path.join(FRONTEND_ARTIFACTS_DIR, "Token.json"), JSON.stringify(TokenArtifact));

    console.log(`Saved ABI file and DeployedAddress to ${path.resolve(FRONTEND_ARTIFACTS_DIR)}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
