// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "lib/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import "src/interfaces/IPool.sol";
import "src/interfaces/IERC20.sol";

contract Yield is AxelarExecutable {
    address constant AAVE_POOL = 0xA238Dd80C259a72e81d7e4664a9801593F98d1c5; //mainnet
    address constant ONEINCH_ROUTER =
        0x1111111254EEB25477B68fb85Ed929f73A960582;
    address constant USDbC = 0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA;
    address constant axlUSDC = 0xEB466342C4d449BC9f53A865D5Cb90586f405215;

    constructor(address gateway_) AxelarExecutable(gateway_) {}

    function _executeWithToken(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload,
        string calldata tokenSymbol,
        uint256 amount
    ) internal override {
        address recipient = address(this);
        // get ERC-20 address from gateway
        address tokenAddress = gateway.tokenAddresses(tokenSymbol);

        // transfer tokens from gateway to this contract
        IERC20(tokenAddress).transfer(recipient, amount);

        swapWith1Inch(payload);

        // decode payload
        // address _payload = abi.decode(payload, (address));
        // swap using calldata

        // deposit into Aave
        IPool(AAVE_POOL).deposit(tokenAddress, amount, recipient, 0);

        // transfer received tokens to the recipient
    }

    function swapWith1Inch(bytes calldata swapCallData) public {
        uint balance = IERC20(axlUSDC).balanceOf(address(this));
        IERC20(axlUSDC).approve(ONEINCH_ROUTER, balance);
        (bool success, bytes memory retData) = ONEINCH_ROUTER.call(
            swapCallData
        );
        require(success, "swap failed");
    }
}
