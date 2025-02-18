// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract USDT is ERC20, Ownable {
    uint256 private constant _maxSupply = 3_000_000_000 * 10**6; // 3,000,000,000 units with 6 decimals

    constructor() ERC20("Tether USD", "USDT") Ownable() {
        _mint(msg.sender, _maxSupply);
    }

    function decimals() public pure override returns (uint8) {
        return 6; // Setting token to 6 decimal places
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= _maxSupply, "PEPFToken: Total supply exceeds the maximum supply");
        _mint(to, amount);
    }
}
