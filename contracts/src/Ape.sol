// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "src/interfaces/IAxelarGateway.sol";

contract Ape {
    address constant AXELAR_MANTLE_GATEWAY =
        0xe432150cce91c13a887f7D836923d5597adD8E31; //TESTNET

    function ape() external {
        IAxelarGateway(AXELAR_MANTLE_GATEWAY).callContractWithToken(
            "base",
            "0xA233441c94b2e13eaA9147849c1ed7e774C03047", // destination - yield contract on base
            abi.encodePacked(
                address(0xcA85486e554c15f0721C815520b10d0874669572)
            ), //payload
            "mnt",
            1
        );
    }
}
