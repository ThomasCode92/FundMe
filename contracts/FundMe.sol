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
        require(msg.value >= 1e18, "Didn't send enough!"); // 1e18 == 1 * 10 ** 18 == 1000000000000000000

        // What is reverting?
        // undo any action before, and send remaining gas back
    }

    function withdraw() public {}

    function getPrice() public {
        // ABI      use an interface
        // Address  0x694AA1769357215DE4FAC081bf1f309aDC325306
    }

    function getVersion() public view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );

        return priceFeed.version();
    }

    function getConversionRate() public {}
}
