// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

contract ETHVault is OwnableUpgradeable {
    IERC20Upgradeable public token;
    IERC20Upgradeable public usdt;
    IERC20Upgradeable public usdc;
    uint256 public tokenBalance;
    address public assist;
    uint256 chainId;
    uint256 public tokenPrice;
    uint256 public priceIncrease;
    uint256 public lastPriceUpdateTimestamp;
    uint256 public PRICE_INCREASE_PERIOD;
    address private ethUSDPriceFeed;

    event GaryTokenPurchase(
        address indexed buyer,
        uint256 amount,
        uint256 value,
        uint256 lastPriceUpdateTimestamp,
        uint256 tokenPrice,
        uint256 priceIncrease
    );

    event GarySaleInfoUpdated(
        uint256 lastPriceUpdateTimestamp,
        uint256 tokenPrice,
        uint256 priceIncrease,
        uint256 tokenBalance
    );
    event GaryTokenPriceUpdated(uint256 tokenPrice, uint256 priceIncrease);
    event GaryTokenBalanceUpdated(uint256 tokenBalance);
    event GaryWithdrawl(
        uint256 ethWithdrawBalance,
        uint256 usdtWithdrawBalance,
        uint256 usdcWithdrawBalance
    );

    modifier onlyAssist() {
        require(assist == msg.sender, "Not assist");
        _;
    }

    enum PaymentMethod {
        NATIVE,
        USDT,
        USDC
    }

    function initialize() public initializer {
        __Ownable_init();
        usdt = IERC20Upgradeable(0xdAC17F958D2ee523a2206206994597C13D831ec7);
        usdc = IERC20Upgradeable(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
        chainId = 1;
        ethUSDPriceFeed = 0x5C00128d4d1c2F4f652C267d7bcdD7aC99C16E16;
        PRICE_INCREASE_PERIOD = 7 * 24 * 60 * 60;
    }

    function updateSaleInfo(
        uint256 _lastPriceUpdateTimestamp,
        uint256 _tokenPrice,
        uint256 _priceIncrease,
        uint256 _tokenBalance
    ) external onlyAssist {
        lastPriceUpdateTimestamp = _lastPriceUpdateTimestamp;
        tokenPrice = _tokenPrice;
        priceIncrease = _priceIncrease;
        tokenBalance = _tokenBalance;
        emit GarySaleInfoUpdated(
            _lastPriceUpdateTimestamp,
            _tokenPrice,
            _priceIncrease,
            _tokenBalance
        );
    }

    function setStableCoin(address _usdt, address _usdc) external onlyAssist {
        usdt = IERC20Upgradeable(_usdt);
        usdc = IERC20Upgradeable(_usdc);
    }

    function setAssist(address _assist) external onlyOwner {
        assist = _assist;
    }

    function getLatestPrice(
        AggregatorV3Interface priceFeed
    ) public view returns (uint256) {
        (
            ,
            /* uint80 roundID */
            int256 price /* uint startedAt */ /* uint timeStamp */ /* uint80 answeredInRound */,
            ,
            ,

        ) = priceFeed.latestRoundData();
        return uint256(price);
    }

    function buyTokenEthPay(
        PaymentMethod paymentMethod,
        uint256 paymentAmount
    ) external payable {
        uint256 buyTokenAmountPay;
        if (
            block.timestamp >= lastPriceUpdateTimestamp + PRICE_INCREASE_PERIOD
        ) {
            tokenPrice = tokenPrice + priceIncrease;
            lastPriceUpdateTimestamp =
                lastPriceUpdateTimestamp +
                PRICE_INCREASE_PERIOD;
        }
        if (paymentMethod == PaymentMethod.NATIVE) {
            require(msg.value > 0, "No ETH sent");

            uint256 ethPrice = getLatestPrice(
                AggregatorV3Interface(ethUSDPriceFeed)
            );
            uint256 adjustedEthPrice = ethPrice * 1e10;

            uint256 usdValue = msg.value * adjustedEthPrice;
            buyTokenAmountPay = usdValue / (tokenPrice * 1e12);
            require(buyTokenAmountPay > 0, "Insufficient payment for tokens");
            emit GaryTokenPurchase(
                msg.sender,
                buyTokenAmountPay,
                msg.value,
                lastPriceUpdateTimestamp,
                tokenPrice,
                priceIncrease
            );
        } else if (paymentMethod == PaymentMethod.USDT) {
            require(paymentAmount > 0, "USDT amount must be greater than 0");

            uint256 usdValue = paymentAmount * 1e18;
            buyTokenAmountPay = (usdValue * 1e12) / (tokenPrice * 1e12);

            require(buyTokenAmountPay > 0, "Insufficient payment for tokens");

            usdt.transferFrom(msg.sender, address(this), paymentAmount);

            emit GaryTokenPurchase(
                msg.sender,
                buyTokenAmountPay,
                paymentAmount,
                lastPriceUpdateTimestamp,
                tokenPrice,
                priceIncrease
            );
        } else if (paymentMethod == PaymentMethod.USDC) {
            require(paymentAmount > 0, "USDC amount must be greater than 0");

            uint256 usdValue = paymentAmount * 1e18;
            buyTokenAmountPay = (usdValue * 1e12) / (tokenPrice * 1e12);

            require(buyTokenAmountPay > 0, "Insufficient payment for tokens");

            usdc.transferFrom(msg.sender, address(this), paymentAmount);

            emit GaryTokenPurchase(
                msg.sender,
                buyTokenAmountPay,
                paymentAmount,
                lastPriceUpdateTimestamp,
                tokenPrice,
                priceIncrease
            );
        } else {
            revert("Invalid Payment Method");
        }
        require(
            tokenBalance >= buyTokenAmountPay,
            "Insufficient tokens available"
        );
    }

    function calculateTokenAmountPay(
        uint256 paymentAmount,
        PaymentMethod paymentMethod
    ) public view returns (uint256 buyTokenAmountPay) {
        uint256 usdValue;
        uint256 adjustedPrice;

        if (paymentMethod == PaymentMethod.NATIVE) {
            uint256 ethPrice = getLatestPrice(
                AggregatorV3Interface(ethUSDPriceFeed)
            );
            adjustedPrice = ethPrice * 1e10;
            usdValue = paymentAmount * adjustedPrice;
        } else if (paymentMethod == PaymentMethod.USDT) {
            usdValue = paymentAmount * 1e18 * 1e12;
        } else if (paymentMethod == PaymentMethod.USDC) {
            usdValue = paymentAmount * 1e18 * 1e12;
        } else {
            revert("Invalid Payment Method");
        }

        // Calculate the number of tokens based on USD value and token price
        if (
            block.timestamp >= lastPriceUpdateTimestamp + PRICE_INCREASE_PERIOD
        ) {
            buyTokenAmountPay =
                usdValue /
                ((tokenPrice + priceIncrease) * 1e12);
        } else {
            buyTokenAmountPay = usdValue / (tokenPrice * 1e12);
        }
        return buyTokenAmountPay;
    }

    function withdraw() external onlyOwner {
        uint256 ethBalance = address(this).balance;
        payable(msg.sender).transfer(ethBalance);
        uint256 usdtBalance = usdt.balanceOf(address(this));
        SafeERC20Upgradeable.safeTransfer(usdt, msg.sender, usdtBalance);
        uint256 usdcBalance = usdc.balanceOf(address(this));
        SafeERC20Upgradeable.safeTransfer(usdc, msg.sender, usdcBalance);
        emit GaryWithdrawl(ethBalance, usdtBalance, usdcBalance);
    }

    function getChainId() external view returns (uint256) {
        return block.chainid;
    }
}
