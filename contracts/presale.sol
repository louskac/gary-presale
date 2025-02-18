// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PresaleContract {
    IERC20 public token;
    address public owner;
    address public assist;
    uint256 public tokenPrice;
    uint256 public tokenBalance;
    uint256 public priceIncrease;
    uint256 public lastPriceUpdateTimestamp;

    event PresaleInfoUpdated(
        uint256 lastPriceUpdateTimestamp,
        uint256 tokenPrice,
        uint256 priceIncrease,
        uint256 balance
    );
    event TokenInfoUpdated(uint256 lastPriceUpdateTimestamp, uint256 tokenPrice, uint256 priceIncrease, uint256 newBalance);

    modifier onlyAssist() {
        require(assist == msg.sender, "Not owner");
        _;
    }
    modifier onlyOwner() {
        require(owner == msg.sender, "Not owner");
        _;
    }

    constructor(
        address _tokenAddress,
        uint256 _lastPriceUpdateTimestamp
    ) {
        token = IERC20(_tokenAddress);
        lastPriceUpdateTimestamp = _lastPriceUpdateTimestamp;
        tokenPrice = 12 * 1e16;
        priceIncrease = 1 * 1e16;
        owner = msg.sender;
    }

    function handleTokenPurchase(
        address buyer,
        uint256 amount,
        uint256 _lastPriceUpdateTimestamp,
        uint256 _tokenPrice,
        uint256 _priceIncrease
    ) external onlyAssist {
        require(amount > 0, "Amount must be greater than 0");
        token.transfer(buyer, amount);
        lastPriceUpdateTimestamp = _lastPriceUpdateTimestamp;
        tokenPrice = _tokenPrice;
        priceIncrease = _priceIncrease;
        uint256 balance = token.balanceOf(address(this));
        emit TokenInfoUpdated(_lastPriceUpdateTimestamp, _tokenPrice, _priceIncrease, balance);
    }

    function updatePresaleInfo(
        uint256 _lastPriceUpdateTimestamp,
        uint256 _tokenPrice,
        uint256 _priceIncrease
    ) external onlyAssist {
        lastPriceUpdateTimestamp = _lastPriceUpdateTimestamp;
        tokenPrice = _tokenPrice;
        priceIncrease = _priceIncrease;
        uint256 balance = token.balanceOf(address(this));
        emit PresaleInfoUpdated(
            _lastPriceUpdateTimestamp,
            _tokenPrice,
            _priceIncrease,
            balance
        );
    }

    function withdrawToken(IERC20 _token, address to) external onlyOwner {
        uint256 balance = _token.balanceOf(address(this));
        _token.transfer(to, balance);
    }

    function setToken(address _token) external onlyOwner {
        token = IERC20(_token);
    }

    function setOwner(address _newOwner) external onlyOwner {
        owner = _newOwner;
    }
    
    function setAssist(address _assist) external onlyOwner {
        assist = _assist;
    }

    function getTokenBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }
}
