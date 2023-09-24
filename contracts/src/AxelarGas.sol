// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "src/interfaces/IAxelarGasService.sol";

contract AxelarGas {
    // Yield yield;
    // Ape ape;
    address axelarBaseGateway = 0xe432150cce91c13a887f7D836923d5597adD8E31;
    address axelarGas = 0x2d5d7d31F671F86C782533cc367F14109a082712;
    address sender = 0x57e13D4A517CAe90F4680b3c4E8637495D3858A6;

    function payGas() public payable {
        IAxelarGasService(axelarGas).payNativeGasForContractCallWithToken(
            sender,
            "base",
            "0xA233441c94b2e13eaA9147849c1ed7e774C03047",
            "0x12aa3caf00000000000000000000000026271dfddbd250014f87f0f302c099d5a798bab1000000000000000000000000eb466342c4d449bc9f53a865d5cb90586f405215000000000000000000000000d9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca00000000000000000000000026271dfddbd250014f87f0f302c099d5a798bab1000000000000000000000000a233441c94b2e13eaa9147849c1ed7e774c03047000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016e0000000000000000000000000000000000000000000000000000000001505126e11b93b61f6291d35c5a2bea0a9ff169080160cfeb466342c4d449bc9f53a865d5cb90586f4052150004f41766d80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000001111111254eeb25477b68fb85ed929f73a9605820000000000000000000000000000000000000000000000000000000065165f3c0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000eb466342c4d449bc9f53a865d5cb90586f405215000000000000000000000000d9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000008b1ccac8",
            "uusdc",
            100,
            0xcA85486e554c15f0721C815520b10d0874669572
        );
    }
}
