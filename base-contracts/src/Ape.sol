// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "src/interfaces/IAxelarGateway.sol";

contract Ape {
    address constant AXELAR_MANTLE_GATEWAY =
        0xe432150cce91c13a887f7D836923d5597adD8E31; //TESTNET

    function ape(uint256 newNumber) external {
        IAxelarGateway(AXELAR_MANTLE_GATEWAY).callContractWithToken(
            "base",
            "", // address on base
            bytes(""),
            "mnt",
            1
        );
    }
}
