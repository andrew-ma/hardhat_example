const hre = require("hardhat");

async function main() {
    const SimpleCollectibleFactory = await hre.ethers.getContractFactory("SimpleCollectible");
    const simpleCollectible = await SimpleCollectibleFactory.deploy();

    await simpleCollectible.deployed();
    console.log("Deployed simpleCollectible to", simpleCollectible.address);
    return simpleCollectible.
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
