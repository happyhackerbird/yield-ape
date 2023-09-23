// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "lib/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import "src/interfaces/IPool.sol";

contract Yield is AxelarExecutable {
    address constant AAVE_POOL = 0xA238Dd80C259a72e81d7e4664a9801593F98d1c5;

    constructor(address gateway_) AxelarExecutable(gateway_) {}

    function _executeWithToken(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload,
        string calldata tokenSymbol,
        uint256 amount
    ) internal override {
        // decode recipient
        address recipient = address(this);
        // abi.decode(payload, (address));
        // get ERC-20 address from gateway
        address tokenAddress = gateway.tokenAddresses(tokenSymbol);

        // deposit into Aave
        IPool(AAVE_POOL).deposit(tokenAddress, amount, recipient, 0);
        // transfer received tokens to the recipient
        // IERC20(tokenAddress).transfer(recipient, amount);
    }
}
