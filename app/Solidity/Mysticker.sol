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

    uint MAX_GOLD = 2000;
    uint MAX_SILVER = 4000;
    uint MAX_BRONZE = 10000;

    uint[] private gold_stickers = [6,7,12,16,18,24,30,31,36,41,43,48,54,55,60,61,66,72,73,79,84,89,90,96,100,101,108,112,115,120,125,126,132,133,138,144,149,151,156,160,161,168,169,177,180,184,186,192,193,197,204,205,210,216,224,225,228,232,233,240,241,249,252,257,258,264,269,273,276,281,283,288,298,299,300,303,306,312,319,321,324,329,332,336,340,342,348,351,352,360,367,368,372,378,380,384];
    uint[] private silver_stickers = [4,5,8,13,19,20,33,34,35,39,42,45,51,56,59,64,68,71,76,77,82,85,91,95,102,103,106,109,114,116,127,128,131,135,139,140,145,150,152,162,163,167,170,174,176,183,185,187,196,199,203,208,209,212,217,221,226,231,235,236,245,246,248,255,259,260,265,266,270,280,282,284,289,293,295,304,307,308,315,316,318,327,328,330,339,341,343,353,354,357,363,364,365,375,376,379];
    uint[] private bronze_stickers = [1,2,3,9,10,11,14,15,17,21,22,23,25,26,27,28,29,32,37,38,40,44,46,47,49,50,52,53,57,58,62,63,65,67,69,70,74,75,78,80,81,83,86,87,88,92,93,94,97,98,99,104,105,107,110,111,113,117,118,119,121,122,123,124,129,130,136,137,141,142,143,146,147,148,153,154,155,157,158,159,164,165,166,171,172,173,175,178,179,181,182,188,189,190,191,194,195,198,200,201,202,206,207,211,213,214,215,218,219,220,222,223,227,229,230,234,237,238,239,242,243,244,247,250,251,253,254,256,261,262,263,267,268,271,272,274,275,277,278,279,285,286,287,290,291,292,294,296,297,301,302,305,309,310,311,313,314,317,320,322,323,325,326,331,333,334,335,337,338,344,345,346,347,349,350,355,356,358,359,361,362,366,369,370,371,373,374,377,381,382,383];

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

    function managerGivePackage(uint256 _package, uint256 amount, address user_wallet) public onlyManager
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

    function getPrice(uint256 _package) public pure returns (uint256 price)
    {
        if(_package == 1)
        {
            return 1 ether;
        }
        else if(_package == 2)
        {
            return 5 ether;
        }
        else if(_package == 3)
        {
            return 10 ether;
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

    function uri(uint256 _tokenid) override public view returns (string memory)
    {
        return string(
            abi.encodePacked(
                baseURI,
                Strings.toString(_tokenid),
                baseExtension
            )
        );
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
    
    function getAvailableBatch(uint[] memory _id) public view returns (uint[] memory available)
    {
        uint[] memory available_stickers = new uint[](_id.length);
        for (uint i = 0; i < _id.length; i++)
        {
            available_stickers[i] = getAvailable(_id[i]);
        }
        return available_stickers;
    }

    function setManager(address new_manager) public onlyOwner
    {
        manager = new_manager;
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

    function burnBatch(address sticker_owner, uint256[] memory _ids, uint256[] memory _amounts) external onlyOwner
    {
        _burnBatch(sticker_owner, _ids, _amounts);
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
    
    function manager_burnForMint(
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