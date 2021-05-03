// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl {
    // Create new role identifier for owner role
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
    // Create new role identifier for admin role
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    // Create new role identifier for minter role
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    modifier onlyOwner() {
        require(hasRole(OWNER_ROLE, msg.sender), "Caller is not the owner");
        _;
    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        _;
    }

    modifier onlyMinter() {
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        _;
    }

    constructor() ERC721("AltFlip", "ALT") {
        // Set contract owner as DEFAULT_ADMIN_ROLE so for all the roles by default it can run grantRole() and revokeRole()
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // Give contract owner all the roles
        _setupRole(OWNER_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);

        // Setup OWNER_ROLE to be the admin role for ADMIN_ROLE, so accounts with OWNER_ROLE can grant and revoke ADMIN_ROLE accounts
        _setRoleAdmin(ADMIN_ROLE, OWNER_ROLE);
        // Setup ADMIN_ROLE to be the admin role for MINTER_ROLE, so accounts with ADMIN_ROLE can grant and revoke MINTER_ROLE accounts
        _setRoleAdmin(MINTER_ROLE, ADMIN_ROLE);
    }

    /* Events */

    /* Token Transfer Functions */

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /*
     * Automatically increments Token ID, Mints a new Token with that Token ID, and Sets URI of new Token
     */
    function createNewToken() public payable onlyMinter returns (uint256) {
        uint256 newTokenId = totalSupply();
        // safely mint a new token and transfers ownership to msg.sender
        _safeMint(msg.sender, newTokenId);
        // set the token's tokenURI that is added to baseURI
        _setTokenURI(newTokenId, uint2str(newTokenId));
        // _beforeTokenTransfer hook is auto called, which updates Enumeration

        console.log(newTokenId);
        return newTokenId;
    }

    function _burn(uint256 tokenId)
        internal
        virtual
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function _baseURI() internal pure override returns (string memory) {
        // return "https://pacific-hollows-97228.herokuapp.com/";
        return "http:/127.0.0.1:4000/";
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
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /* Helper Functions */
    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + (j % 10)));
            j /= 10;
        }
        return string(bstr);
    }
}
