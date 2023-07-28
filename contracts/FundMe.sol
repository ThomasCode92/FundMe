// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

// What this Contract should do:
//  - Get funds from users
//  - Withdraw funds
//  - Set a minimum funding value in USD

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract FundMe {
    uint256 public minimumUsd = 50;

    function fund() public payable {
        // Want to be able to set a minimum fund amount in USD
        //  1. How do we send ETH to this contract?
        require(
            getConversionRate(msg.value) >= minimumUsd * 1e18,
            "Didn't send enough!"
        );

        // What is reverting?
        // undo any action before, and send remaining gas back
    }

    function withdraw() public {}

    function getPrice() public view returns (uint256) {
        // ABI      use an interface
        // Address  0x694AA1769357215DE4FAC081bf1f309aDC325306
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        (, int256 answer, , , ) = priceFeed.latestRoundData(); // ETH in terms of USD

        return uint256(answer * 1e10);
    }

    function getConversionRate(uint256 ethAmount)
        public
        view
        returns (uint256)
    {
        uint256 ethPrice = getPrice();
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18; // 1e18 == 1 * 10 ** 18 == 1000000000000000000

        return ethAmountInUsd;
    }
}
