// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

//Contract filename and contract definition must have the same name in order to be compiled
contract DerzhNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(string => uint8) existingURIs; //keep track of existing minted NFT URIs

    constructor() ERC721("DerzhNFT", "DRZ") {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        //only owner
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function isContentOwned(string memory uri) public view returns (bool) {
        //check if the NFT URI already exist
        return existingURIs[uri] == 1;
    }

    function count() public view returns (uint256) {
        //function to know how many token has been minted so far
        return _tokenIdCounter.current();
    }

    function payToMint(
        address recipient,
        string memory metadataURI
    ) public payable returns (uint256) {
        uint minAmount = 0.05 ether;
        //CHECKS: require() validates before execution
        require(existingURIs[metadataURI] != 1, 'NFT already minted'); //if not exists ok otherwise already minted
        require(msg.value >= minAmount, 'Non sufficient funds'); //msg.value returns the amount of wet/eth sent

        uint256 newItemId = _tokenIdCounter.current();
        existingURIs[metadataURI] = 1; //set minted
        _tokenIdCounter.increment(); //increment for next NFT

        _mint(recipient, newItemId); //MINT
        _setTokenURI(newItemId, metadataURI);

        return newItemId;
    }

}