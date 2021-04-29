// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Token is ERC721, ERC721Enumerable, ERC721URIStorage {
    constructor() ERC721("My hardhat token", "MHT") {}

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function createCollectible(string memory _tokenURI)
        public
        returns (uint256)
    {
        uint256 newItemId = totalSupply();
        // safely mint a new token and transfers ownership to msg.sender
        _safeMint(msg.sender, newItemId);
        // set the token's tokenURI string data
        _setTokenURI(newItemId, _tokenURI);
        // _beforeTokenTransfer hook is auto called, which changes OwnerEnumeration

        console.log("Newly created item", newItemId);
        return newItemId;
    }

    function _burn(uint256 tokenId)
        internal
        virtual
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
