// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

// What this Contract should do:
//  - Get funds from users
//  - Withdraw funds
//  - Set a minimum funding value in USD

import "./PriceConverter.sol";

contract FundMe {
    using PriceConverter for uint256;

    uint256 public minimumUsd = 50;

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    function fund() public payable {
        require(
            msg.value.getConversionRate() >= minimumUsd * 1e18,
            "Didn't send enough!"
        );

        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public {
        for (uint256 funderIdx = 0; funderIdx < funders.length; funderIdx++) {
            address funder = funders[funderIdx];
            addressToAmountFunded[funder] = 0;
        }

        funders = new address[](0);
    }
}
