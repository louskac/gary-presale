// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

contract BNBVault is OwnableUpgradeable {
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
    address private bnbUSDPriceFeed;

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
        uint256 bnbWithdrawBalance,
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
        usdt = IERC20Upgradeable(0x55d398326f99059fF775485246999027B3197955);
        usdc = IERC20Upgradeable(0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d);
        chainId = 56;
        bnbUSDPriceFeed = 0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE;
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

    function buyTokenBnbPay(
        PaymentMethod paymentMethod,
        uint256 paymentAmount
    ) external payable {
        uint256 buyTokenAmountPay;

        // update token price if new epoch already started
        if (
            block.timestamp >= lastPriceUpdateTimestamp + PRICE_INCREASE_PERIOD
        ) {
            uint256 increaseSteps = (block.timestamp - lastPriceUpdateTimestamp) / PRICE_INCREASE_PERIOD + 1;

            tokenPrice = tokenPrice + (priceIncrease * increaseSteps);
            lastPriceUpdateTimestamp = lastPriceUpdateTimestamp + (PRICE_INCREASE_PERIOD * increaseSteps);
        }
        if (paymentMethod == PaymentMethod.NATIVE) {
            require(msg.value > 0, "No BNB sent");

            uint256 bnbPrice = getLatestPrice(
                AggregatorV3Interface(bnbUSDPriceFeed)
            );
            uint256 adjustedBnbPrice = bnbPrice * 1e10;

            uint256 usdValue = msg.value * adjustedBnbPrice;
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
            buyTokenAmountPay = usdValue / (tokenPrice * 1e12);

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
            buyTokenAmountPay = usdValue / (tokenPrice * 1e12);

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

    function tokenPricePrecise() public view returns (uint256) {
        if (block.timestamp < lastPriceUpdateTimestamp + PRICE_INCREASE_PERIOD) {
            return tokenPrice;
        }

        uint256 increaseSteps = (block.timestamp - lastPriceUpdateTimestamp) / PRICE_INCREASE_PERIOD + 1;
        uint256 tokenPriceFinal = tokenPrice + (priceIncrease * increaseSteps);

        return tokenPriceFinal
    }

    function calculateTokenAmountPay(
        uint256 paymentAmount,
        PaymentMethod paymentMethod
    ) public view returns (uint256 buyTokenAmountPay) {
        uint256 usdValue;
        uint256 adjustedPrice;

        if (paymentMethod == PaymentMethod.NATIVE) {
            uint256 bnbPrice = getLatestPrice(
                AggregatorV3Interface(bnbUSDPriceFeed)
            );
            adjustedPrice = bnbPrice * 1e10;
            usdValue = paymentAmount * adjustedPrice;
        } else if (paymentMethod == PaymentMethod.USDT) {
            usdValue = paymentAmount * 1e18;
        } else if (paymentMethod == PaymentMethod.USDC) {
            usdValue = paymentAmount * 1e18;
        } else {
            revert("Invalid Payment Method");
        }

        // Calculate the number of tokens based on USD value and token price
        if (
            block.timestamp >= lastPriceUpdateTimestamp + PRICE_INCREASE_PERIOD
        ) {
            uint256 increaseSteps = (block.timestamp - lastPriceUpdateTimestamp) / PRICE_INCREASE_PERIOD + 1;
            uint256 tokenPriceFinal = tokenPrice + (priceIncrease * increaseSteps);

            buyTokenAmountPay =
                usdValue /
                ((tokenPriceFinal + priceIncrease) * 1e12);
        } else {
            buyTokenAmountPay = usdValue / (tokenPrice * 1e12);
        }
        return buyTokenAmountPay;
    }

    function withdraw() external onlyOwner {
        uint256 bnbBalance = address(this).balance;
        payable(msg.sender).transfer(bnbBalance);
        uint256 usdtBalance = usdt.balanceOf(address(this));
        SafeERC20Upgradeable.safeTransfer(usdt, msg.sender, usdtBalance);
        uint256 usdcBalance = usdc.balanceOf(address(this));
        SafeERC20Upgradeable.safeTransfer(usdc, msg.sender, usdcBalance);
        emit GaryWithdrawl(bnbBalance, usdtBalance, usdcBalance);
    }

    function getChainId() external view returns (uint256) {
        return block.chainid;
    }
}
