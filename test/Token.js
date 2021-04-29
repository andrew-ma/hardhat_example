const { expect } = require("chai");
const assert = require("assert");

const getTokenId = (receipt) => {
    // ensure that Transfer event was emitted
    const transferEvents = receipt.events.filter((x) => x.event === "Transfer");
    assert(transferEvents.length !== 0);

    const tokenId = transferEvents[0].args.tokenId._hex;

    // convert tokenId hex string to integer
    const tokenIdInteger = parseInt(tokenId, 16);

    console.log("TOKEN ID from Transfer event", tokenId, tokenIdInteger);
    return tokenIdInteger;
};

describe("Token contract", () => {
    let TokenFactory, token, owner, addr1, addr2;

    beforeEach(async () => {
        TokenFactory = await ethers.getContractFactory("Token");
        token = await TokenFactory.deploy();
        [owner, addr1, addr2, _] = await ethers.getSigners();
    });

    describe("Deployment", () => {
        it("Should have 0 for totalSupply", async () => {
            expect(await token.totalSupply()).to.equal(0);
        });
    });

    describe("Minting", () => {
        it("Should have one token in totalSupply after creating a collectible", async () => {
            await token.createCollectible("test1");
            expect(await token.totalSupply()).to.equal(1);
        });

        it("Should have 3 tokens in totalSupply after creating 3 collectibles", async () => {
            await token.createCollectible("test1");
            await token.createCollectible("test2");
            await token.createCollectible("test3");
            expect(await token.totalSupply()).to.equal(3);
        });

        it("Should allow creating collectibles with same URI data", async () => {
            await token.createCollectible("test1");
            await token.createCollectible("test1");
            await token.createCollectible("test1");
        });

        it("Should match the tokenURI string retrieved using token ID", async () => {
            const originalURIString1 = "test1";

            const tx1 = await token.createCollectible(originalURIString1);
            const receipt1 = await tx1.wait();

            const originalURIString2 = "test2";
            const tx2 = await token.createCollectible(originalURIString2);
            const receipt2 = await tx2.wait();

            const tokenId1 = getTokenId(receipt1);
            const tokenId2 = getTokenId(receipt2);
            expect(tokenId1).to.equal(0);
            expect(tokenId2).to.equal(1);

            // get tokenURI string using token ID
            expect(await token.tokenURI(tokenId1)).to.equal(originalURIString1);
            expect(await token.tokenURI(tokenId2)).to.equal(originalURIString2);
        });
    });
});
