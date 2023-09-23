// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "";

contract Yield is AxelarExecutable {
    function _executeWithToken(
        string memory sourceChain,
        string memory sourceAddress,
        bytes calldata payload,
        string memory tokenSymbol,
        uint256 amount
    ) internal virtual {}
}
