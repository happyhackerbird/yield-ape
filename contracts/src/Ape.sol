// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "lib/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import "src/interfaces/IERC20.sol";

contract Ape is AxelarExecutable {
    // address constant AXELAR_MANTLE_GATEWAY =
    //     0xe432150cce91c13a887f7D836923d5597adD8E31; //mainnet

    address constant axlUSDC = 0xEB466342C4d449BC9f53A865D5Cb90586f405215;

    constructor(address gateway_) AxelarExecutable(gateway_) {}

    function ape(
        bytes memory payload,
        uint amount,
        address yieldToken
    ) external {
        IERC20(axlUSDC).approve(address(gateway), amount);
        gateway.callContractWithToken(
            "base", //destination chain
            "0xA233441c94b2e13eaA9147849c1ed7e774C03047", // destination contract - yield contract on base
            payload,
            "uusdc",
            amount
        );
    }
}
