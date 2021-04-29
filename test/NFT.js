const { expect } = require("chai");
const assert = require("assert");

const getTokenId = (receipt) => {
    // ensure that Transfer event was emitted
    const transferEvents = receipt.events.filter((x) => x.event === "Transfer");
    assert(transferEvents.length !== 0);

    const tokenId = transferEvents[0].args.tokenId._hex;

    // convert tokenId hex string to integer
    const tokenIdInteger = parseInt(tokenId, 16);

    // console.log("TOKEN ID from Transfer event", tokenId, tokenIdInteger);
    return tokenIdInteger;
};

describe("NFT contract", () => {
    let NFTFactory, nft, owner, addr1, addr2;

    before(async () => {
        NFTFactory = await ethers.getContractFactory("NFT");
        [owner, addr1, addr2, _] = await ethers.getSigners();
        nft = await NFTFactory.deploy();
    });

    describe("Deployment", () => {
        let DEFAULT_ADMIN_ROLE, OWNER_ROLE, ADMIN_ROLE, MINTER_ROLE;

        before(async () => {
            DEFAULT_ADMIN_ROLE = await nft.DEFAULT_ADMIN_ROLE();
            OWNER_ROLE = await nft.OWNER_ROLE();
            ADMIN_ROLE = await nft.ADMIN_ROLE();
            MINTER_ROLE = await nft.MINTER_ROLE();

            console.log("DEFAULT_ADMIN_ROLE:", DEFAULT_ADMIN_ROLE);
            console.log("OWNER_ROLE:", OWNER_ROLE);
            console.log("ADMIN_ROLE:", ADMIN_ROLE);
            console.log("MINTER_ROLE:", MINTER_ROLE);
        });

        describe("TotalSupply", () => {
            it("Should have 0 for totalSupply", async () => {
                expect(await nft.totalSupply()).to.equal(0);
            });
        });

        describe("Owner Roles", () => {
            it("Should give contract owner the OWNER_ROLE", async () => {
                expect(await nft.hasRole(OWNER_ROLE, owner.address));
            });

            it("Should give contract owner the DEFAULT_ADMIN_ROLE", async () => {
                expect(await nft.hasRole(DEFAULT_ADMIN_ROLE, owner.address));
            });

            it("Should give contract owner the ADMIN_ROLE", async () => {
                expect(await nft.hasRole(ADMIN_ROLE, owner.address));
            });
            it("Should give contract owner the MINTER_ROLE", async () => {
                expect(await nft.hasRole(MINTER_ROLE, owner.address));
            });
        });

        describe("Setting the admin roles for specific ROLES", () => {
            it("Should set the admin role for ADMIN_ROLE as OWNER_ROLE", async () => {
                expect(await nft.getRoleAdmin(ADMIN_ROLE)).to.equal(OWNER_ROLE);
            });
            it("Should set the admin role for MINTER_ROLE as ADMIN_ROLE", async () => {
                expect(await nft.getRoleAdmin(MINTER_ROLE)).to.equal(ADMIN_ROLE);
            });

            // it("Should allow contract owner");
        });

        // describe("");
    });

    describe("Minting", () => {
        beforeEach(async () => {
            // new instance of nft to make it easy to test multiple mint tokens in separate tests
            nft = await NFTFactory.deploy();
        });

        it("Should have one token in totalSupply after creating a collectible", async () => {
            await nft.createCollectible("test1");
            expect(await nft.totalSupply()).to.equal(1);
        });

        it("Should have 3 tokens in totalSupply after creating 3 collectibles", async () => {
            await nft.createCollectible("test1");
            await nft.createCollectible("test2");
            await nft.createCollectible("test3");
            expect(await nft.totalSupply()).to.equal(3);
        });

        it("Should allow creating collectibles with same URI data", async () => {
            await nft.createCollectible("test1");
            await nft.createCollectible("test1");
            await nft.createCollectible("test1");
        });

        it("Should match the tokenURI string retrieved using token ID", async () => {
            const originalURIString1 = "test1";

            const tx1 = await nft.createCollectible(originalURIString1);
            const receipt1 = await tx1.wait();

            const originalURIString2 = "test2";
            const tx2 = await nft.createCollectible(originalURIString2);
            const receipt2 = await tx2.wait();

            const tokenId1 = getTokenId(receipt1);
            const tokenId2 = getTokenId(receipt2);
            expect(tokenId1).to.equal(0);
            expect(tokenId2).to.equal(1);

            // get tokenURI string using token ID
            expect(await nft.tokenURI(tokenId1)).to.equal(originalURIString1);
            expect(await nft.tokenURI(tokenId2)).to.equal(originalURIString2);
        });
    });
});
