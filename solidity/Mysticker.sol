// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Mysticker is ERC1155, Ownable
{
    string public baseURI;
    string public notRevealedUri;
    string public baseExtension = ".json";

    bool public paused = true;
    bool public revealed = false;

    address private manager;

    uint MAX_GOLD = 1;
    uint MAX_SILVER = 10;
    uint MAX_BRONZE = 100;

    uint[] private gold_stickers = [1];
    uint[] private silver_stickers = [];
    uint[] private bronze_stickers = [];

    mapping(uint256 => uint256) private amounts;
    
    constructor() ERC1155("") {}

    modifier onlyManager
    {
        require(msg.sender == manager, "Only the manager can do this");
        _;
    }

    // return Initial baseURI
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // set baseURI
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    // set notRevealedURI
    function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
        notRevealedUri = _notRevealedURI;
    }

    function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
        baseExtension = _newBaseExtension;
    }

    function changeStatePaused(bool _state) public onlyOwner {
        paused = _state;
    }

    function changeStateRevealed(bool _state) public onlyOwner {
        revealed = _state;
    }

    // add a new sticker to category
    function addSticker(uint category, uint sticker_id) public onlyOwner
    {
        if (category == 1)
        {
            gold_stickers.push(sticker_id);
        }
        else if (category == 2)
        {
            silver_stickers.push(sticker_id);
        }
        else if (category == 3)
        {
            bronze_stickers.push(sticker_id);
        }
    }

    function setCategoryMax(uint category, uint max) public onlyOwner
    {
        if (category == 1)
        {
            MAX_GOLD = max;
        }
        else if (category == 2)
        {
            MAX_SILVER = max;
        }
        else if (category == 3)
        {
            MAX_BRONZE = max;
        }
    }

    function getBalanceOfToken(uint _id) public view returns (uint balance)
    {
        return amounts[_id];
    }

    // gold - 1, silver - 2, bronze - 3
    function getCategoryOfToken(uint _id) public view returns (uint category)
    {
        // check if the token is bronze
        for (uint i = 0; i < bronze_stickers.length; i++)
        {
            if (bronze_stickers[i] == _id)
            {
                return 3;
            }
        }
        // check if the token is silver
        for (uint i = 0; i < silver_stickers.length; i++)
        {
            if (silver_stickers[i] == _id)
            {
                return 2;
            }
        }
        // check if the token is gold
        for (uint i = 0; i < gold_stickers.length; i++)
        {
            if (gold_stickers[i] == _id)
            {
                return 1;
            }
        }
    }

    function getAvailable(uint _id) public view returns (uint available)
    {
        uint minted_amount = getBalanceOfToken(_id);
        uint category = getCategoryOfToken(_id);
        if (category == 1)
        {
            return MAX_GOLD - minted_amount;
        }
        else if (category == 2)
        {
            return MAX_SILVER - minted_amount;
        }
        else if (category == 3)
        {
            return MAX_BRONZE - minted_amount;
        }
    }

    function setManager(address new_mmanager) public onlyOwner
    {
        manager = new_mmanager;
    }

    function mint_stycker_pack(uint[] memory stickers, address sticker_owner) public onlyManager
    {
        uint[] memory amount = new uint[]();
        uint[] memory _stickers = new uint[]();
        for(uint i = 0; i < stickers.length; i++)
        {
            amount[i] = 1;
            _stickers[i] = stickers[i];
            amounts[stickers[i]] = amounts[stickers[i]] + 1;
        }
        _mintBatch(sticker_owner, _stickers, amount, "");
    }

    function mint_stycker_pack_owner(uint[] memory stickers, address sticker_owner) public onlyOwner
    {
        uint[] memory amount = new uint[]();
        uint[] memory _stickers = new uint[]();
        for(uint i = 0; i < stickers.length; i++)
        {
            amount[i] = 1;
            _stickers[i] = stickers[i];
            amounts[stickers[i]] = amounts[stickers[i]] + 1;
        }
        _mintBatch(sticker_owner, _stickers, amount, "");
    }
}