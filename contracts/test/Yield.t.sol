// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "lib/forge-std/src/Test.sol";
import "src/Yield.sol";
import "lib/forge-std/src/console.sol";

contract YieldTest is Test {
    Yield yield;
    address axelarBase = 0xe432150cce91c13a887f7D836923d5597adD8E31;

    function setUp() public {
        yield = new Yield(axelarBase);
    }

    function test_executeWithToken() public {
        yield.executeWithToken(
            bytes32(0),
            "mantle",
            "0xe432150cce91c13a887f7D836923d5597adD8E31",
            "payload",
            "weth-wei",
            100
        );
    }
}
