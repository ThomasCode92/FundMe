// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

// What this Contract should do:
//  - Get funds from users
//  - Withdraw funds
//  - Set a minimum funding value in USD

import "./PriceConverter.sol";

error FundMe__NotOwner();

/**
 * @title A contract for crowd funding
 * @author ThomasCode92
 * @notice This contract is to demo a sample funding contract
 * @dev This implements price feeds as our library
 */
contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50;
    address public immutable i_owner;

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    AggregatorV3Interface public priceFeed;

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }

        _;
    }

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    /**
     * @notice This function funds this contract
     */
    function fund() public payable {
        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUM_USD * 1e18,
            "Didn't send enough ETH!"
        );

        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        for (uint256 funderIdx = 0; funderIdx < funders.length; funderIdx++) {
            address funder = funders[funderIdx];
            addressToAmountFunded[funder] = 0;
        }

        funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");

        require(callSuccess, "Call failed");
    }
}
