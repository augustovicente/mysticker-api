// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Mysticker is ERC1155, Ownable
{
    constructor() ERC1155("") {}

    modifier onlyManager
    {
        require(msg.sender == manager, "Only the manager can do this");
        _;
    }

    string public baseURI;
    string public notRevealedUri;
    string public baseExtension = ".json";

    bool public paused = false;
    bool public revealed = true;

    address private manager;

    uint MAX_GOLD = 1;
    uint MAX_SILVER = 10;
    uint MAX_BRONZE = 100;

    uint[] private gold_stickers = [1];
    uint[] private silver_stickers = [2];
    uint[] private bronze_stickers = [3];

    mapping(uint256 => uint256) private amounts;

    mapping(address => uint256) private esmerald_package;
    mapping(address => uint256) private obsidian_package;
    mapping(address => uint256) private diamond_package;
    
    function withdraw() payable onlyOwner public {
        payable(msg.sender).transfer(address(this).balance);
    }

    function getUserPackage(address _user) public view returns(uint256, uint256, uint256)
    {
        return (esmerald_package[_user], obsidian_package[_user], diamond_package[_user]);
    }

    function buyPackage(uint256 _package, uint256 amount) public payable
    {
        require(!paused, "Sale paused");
        require(revealed, "Sale not revealed");
        require(_package == 1 || _package == 2 || _package == 3, "Invalid package");
        require(msg.value == (getPrice(_package) * amount), "Invalid price");

        if(_package == 1)
        {
            esmerald_package[msg.sender] += amount;
        }
        else if(_package == 2)
        {
            obsidian_package[msg.sender] += amount;
        }
        else if(_package == 3)
        {
            diamond_package[msg.sender] += amount;
        }
    }

    function ownerGivePackage(uint256 _package, uint256 amount, address user_wallet) public onlyOwner
    {
        require(_package == 1 || _package == 2 || _package == 3, "Invalid package");

        if(_package == 1)
        {
            esmerald_package[user_wallet] += amount;
        }
        else if(_package == 2)
        {
            obsidian_package[user_wallet] += amount;
        }
        else if(_package == 3)
        {
            diamond_package[user_wallet] += amount;
        }
    }

    function getPrice(uint256 _package) public view returns (uint256 price)
    {
        if(_package == 1)
        {
            return 0.001 ether;
        }
        else if(_package == 2)
        {
            return 0.005 ether;
        }
        else if(_package == 3)
        {
            return 0.01 ether;
        }
    }

    // return Initial baseURI
    function _baseURI() internal view virtual returns (string memory) {
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

    function mint_stycker_pack(uint[] memory stickers, address sticker_owner, uint256 package_type, uint256 package_amount) public onlyManager
    {
        require(package_type == 1 || package_type == 2 || package_type == 3, "Invalid package");
        require(package_amount > 0, "Invalid package amount");

        if(package_type == 1)
        {
            require(esmerald_package[sticker_owner] >= package_amount, "Not enough packages");
            esmerald_package[sticker_owner] -= package_amount;
        }
        else if(package_type == 2)
        {
            require(obsidian_package[sticker_owner] >= package_amount, "Not enough packages");
            obsidian_package[sticker_owner] -= package_amount;
        }
        else if(package_type == 3)
        {
            require(diamond_package[sticker_owner] >= package_amount, "Not enough packages");
            diamond_package[sticker_owner] -= package_amount;
        }

        uint[] memory amount = new uint[](stickers.length);
        uint[] memory _stickers = new uint[](stickers.length);
        for(uint i = 0; i < stickers.length; i++)
        {
            amount[i] = 1;
            _stickers[i] = stickers[i];
            amounts[stickers[i]] = amounts[stickers[i]] + 1;
        }
        _mintBatch(sticker_owner, _stickers, amount, "");
    }

    function mint_stycker_pack_owner(uint[] memory stickers, address sticker_owner, uint256 package_type, uint256 package_amount) public onlyOwner
    {
        require(package_type == 1 || package_type == 2 || package_type == 3, "Invalid package");
        require(package_amount > 0, "Invalid package amount");

        if(package_type == 1)
        {
            require(esmerald_package[sticker_owner] >= package_amount, "Not enough packages");
            esmerald_package[sticker_owner] -= package_amount;
        }
        else if(package_type == 2)
        {
            require(obsidian_package[sticker_owner] >= package_amount, "Not enough packages");
            obsidian_package[sticker_owner] -= package_amount;
        }
        else if(package_type == 3)
        {
            require(diamond_package[sticker_owner] >= package_amount, "Not enough packages");
            diamond_package[sticker_owner] -= package_amount;
        }

        uint[] memory amount = new uint[](stickers.length);
        uint[] memory _stickers = new uint[](stickers.length);
        for(uint i = 0; i < stickers.length; i++)
        {
            amount[i] = 1;
            _stickers[i] = stickers[i];
            amounts[stickers[i]] = amounts[stickers[i]] + 1;
        }
        _mintBatch(sticker_owner, _stickers, amount, "");
    }

    function burnForMint(
        address _from,
        uint256[] memory _burnIds,
        uint256[] memory _burnAmounts,
        uint256[] memory _mintIds,
        uint256[] memory _mintAmounts
    ) external onlyOwner {
        _burnBatch(_from, _burnIds, _burnAmounts);
        _mintBatch(_from, _mintIds, _mintAmounts, "");
    }
    
    function burnForMint(
        address _from,
        uint256[] memory _burnIds,
        uint256[] memory _burnAmounts,
        uint256[] memory _mintIds,
        uint256[] memory _mintAmounts
    ) external onlyManager {
        _burnBatch(_from, _burnIds, _burnAmounts);
        _mintBatch(_from, _mintIds, _mintAmounts, "");
    }
}